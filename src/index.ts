import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/common/Model/LarekApi';
import { Card } from './components/common/Views/card';
import { Page } from './components/common/Views/page';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import {
	AppState,
	CatalogChangeEvent,
	Product,
} from './components/common/Model/appData';
import { Basket, BasketItem } from './components/common/Views/basket';
import { Modal } from './components/common/Views/modal';
import { Contacts, OrderForm } from './components/common/Views/order';
import { Success } from './components/common/Views/success';
import { IOrder, IOrderContact, IOrderDelivery, IProduct } from './types';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new AppState({}, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:select', item);
			},
		});
		return card.render({
			category: item.category,
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('card:select', (item: Product) => {
	appState.setPreview(item);
});

events.on('card:select', (item: Product) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('add:product', item),
	});

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			selected: item.selected,
		}),
	});

	if (item.price === null) {
		card.buttonTitle = false;
	}
	if (appState.basket.includes(item)) {
		card.buttonTitle = true;
	}
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

events.on('basket:changed', () => {
	let total = 0;
	let basketItemsCount = 0;
	basket.items = appState.getProducts().map((item) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appState.removeFromBasket(item);
			},
		});
		total += item.price;
		++basketItemsCount;
		return card.render({
			index: basketItemsCount,
			title: item.title,
			price: item.price,
		});
	});
	basket.total = total;
	appState.order.total = total;
	page.counter = appState.getProducts().length;
});

events.on('add:product', (item: IProduct) => {
	appState.addToBasket(item);
	modal.close();
});

events.on('card:delete', (item: IProduct) => {
	appState.removeFromBasket(item);
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			valid: order.valid,
			errors: order.errors,
			address: '',
			payment: 'онлайн',
		}),
	});
});

events.on('order.payment:change', (data: { target: string }) => {
	appState.setPaymentMethod(data.target);
});

events.on('order.address:change', (data: { value: string }) => {
	appState.setOrderDeliveryField(data.value);
});

events.on('deliveryFormError:change', (errors: Partial<IOrderDelivery>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	appState.setItems();
	modal.render({
		content: contacts.render({
			valid: contacts.valid,
			errors: contacts.errors,
			email: '',
			phone: '',
		}),
	});
});

events.on('contacts.email:change', (data: { value: string }) => {
	appState.setOrderEmail(data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
	appState.setOrderPhone(data.value);
});

events.on('contactsFormError:change', (errors: Partial<IOrderContact>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	const order: IOrder = {
		payment: appState.order.payment,
		address: appState.order.address,
		email: appState.order.email,
		phone: appState.order.phone,
		items: appState.basket.map((item) => item.id),
		total: appState.getTotal(),
	};

	console.log(order)

	api
		.orderResult(order)
		.then((result) => {
			appState.clearBasket();
			appState.clearOrder();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});
