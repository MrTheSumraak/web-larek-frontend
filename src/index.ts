import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ValidationConfig } from './components/base/validationConfig';
import { ApiWebLarek } from './components/Models/apiWebLarek';
import { Model } from './components/Models/models';
import { Validation } from './components/Models/validation';
import { BasketItem, BasketView } from './components/Views/basketView';
import { CardPreviewCurrentCard } from './components/Views/CurrentCardView';
import { FormAdress, FormContacts } from './components/Views/form';
import { ModalWindow } from './components/Views/modalWidnow';
import { objCardClass } from './components/Views/objClass';
import { OrderModel } from './components/Views/Order';
import { PageView } from './components/Views/PageViews';
import { PreviewCardContent } from './components/Views/previewCardView';
import { Succes } from './components/Views/succes';
import { TemplateListView } from './components/Views/Templates/templateInit';
import {
	BasketTemplateItems,
	CatalogtemplateItems,
	ContactsTemplateItems,
	OrderTemplateItems,
	PreviewTemplateItems,
	SuccessTemplateItems,
} from './components/Views/Templates/templateItems';
import { ProductCard, SelectedProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const main = ensureElement<HTMLElement>('[data-id="main"]');
const basketCounter = ensureElement<HTMLElement>('[data-id="basketCounter"]');

const templateInit = new TemplateListView();
const emitter = new EventEmitter();
const validation = new Validation();

const basketContent = new BasketTemplateItems(templateInit.basketTemplate);
const previewContent = new PreviewTemplateItems(templateInit.previewTemplate);
const productItems = new CatalogtemplateItems(templateInit.catalogTemplate);
const orderItems = new OrderTemplateItems(templateInit.orderTemplate);
const contactsItem = new ContactsTemplateItems(templateInit.contactsTemplate);
const successItems = new SuccessTemplateItems(templateInit.successTemplate);

const modalManager = new ModalWindow(modalContainer, emitter);
const apiManager = new Api(API_URL);
const modelManager = new Model(emitter);
const apiWebLarek = new ApiWebLarek(apiManager);
const basketView = new BasketView(basketContent.basketInside, emitter);
const previewCardContent = new PreviewCardContent(
	productItems,
	previewContent,
	emitter
);
const formAdress = new FormAdress(orderItems.formOrder, emitter);
const formContacts = new FormContacts(contactsItem.formContacts, emitter);
const succes = new Succes(successItems.orderSuccess, emitter);
const setOrder = new OrderModel();

apiWebLarek
	.getCards()
	.then((items) => {
		modelManager.setItems = items;
		emitter.emit('cards:loading', modelManager.responceItems);
	})
	.catch((err) => console.warn(`${err}`));

emitter.on('cards:loading', (products: ProductCard[]) => {
	const product = new PageView(
		products,
		CDN_URL,
		templateInit.catalogTemplate,
		emitter
	);
	product.renderProductList(main);
});

const cardPreviewCurrentCard = new CardPreviewCurrentCard();

emitter.on('cardPreview:on', (ev: MouseEvent) => {
	const cardEl = (ev.currentTarget || ev.target) as HTMLElement;
	if (!cardEl) return;

	cardPreviewCurrentCard.setCurrentCard(cardEl, objCardClass);

	const cardDescription = cardEl.dataset.description;

	previewCardContent.setContent({
		category: cardPreviewCurrentCard.currentCardElement.category,
		title: cardPreviewCurrentCard.currentCardElement.title,
		img: cardPreviewCurrentCard.currentCardElement.img,
		price: cardPreviewCurrentCard.currentCardElement.price,
		cardDescription: cardDescription,
	});


	setTimeout(() => {
		const preview = document.querySelector(
			'[data-id="cardPreview"]'
		) as HTMLElement;
		preview.dataset.idPersonal = cardEl.dataset.idPersonal;
		console.log(preview.dataset.idPersonal);

	}, 0);

	modalManager.setContent(previewContent.cardFull);
	modalManager.render();
});

emitter.on('basket:install', () => {
	const preview = document.querySelector(
		'[data-id="cardPreview"]'
	) as HTMLElement;
	const cardId = preview.dataset.idPersonal;
	emitter.emit('checkButton:off', { cardId });

	if (
		!cardPreviewCurrentCard.currentCardElement ||
		!cardPreviewCurrentCard.currentId
	)
		return;

	if (
		cardPreviewCurrentCard.currentCardElement.price.toLowerCase() === 'бесценно'
	) {
		alert('Бесценный товар не может быть добавлен в корзину');
		return;
	}

	const product: SelectedProduct = {
		title: cardPreviewCurrentCard.currentCardElement.title,
		priceProduct: cardPreviewCurrentCard.currentCardElement.price,
		id: cardPreviewCurrentCard.currentId,
	};


	emitter.emit('basket:itemAdded', product);
	modalManager.closeModal();
});

emitter.on(
	'checkButton:off',
	({ cardId }: { cardId: string }) => {
		const isInBasket = modelManager
			.getBasketProducts()
			.some((el) => el.id === cardId);

		if (isInBasket) {
			alert('Такой продукт уже добавлен в корзину!');
		}
	}
);

emitter.on('basket:on', () => {
	modalManager.setContent(basketContent.basketInside);
	modalManager.render();
	basketView.checkBasketButton(
		basketContent.makingOrderButton,
		basketContent.basketList
	);
});

emitter.on('basket:itemAdded', (product: SelectedProduct) => {
	modelManager.addProduct(product);
});

emitter.on('basket:itemRemoved', ({ id }: { id: string }) => {
	modelManager.removeProduct(id);
	basketView.checkBasketButton(
		basketContent.makingOrderButton,
		basketContent.basketList
	);
});

emitter.on('basket:change', (products: SelectedProduct[]) => {
	const items = products.map((product, index) => {
		const item = new BasketItem(product, index, emitter).getElement();

		return item;
	});

	basketView.productList = items;
	basketView.totalPrice = modelManager.getTotal();
	basketView.counterValue = products.length;

	if (products.length === 0) {
		basketView.lockedButton(basketContent.makingOrderButton);
	} else {
		basketView.unLockedButton(basketContent.makingOrderButton);
	}
});

emitter.on('order:detailsRequestedAdress', () => {
	modalManager.setContent(orderItems.formOrder);
	modalManager.openModal();

	basketView.lockedButton(orderItems.submitButtonFurther);

	validation.enableValidation(
		ValidationConfig,
		formAdress.isPaymentSelected(orderItems.buttonOnline, orderItems.buttonCash)
	);
});

emitter.on('order:detailsRequestedContacts', () => {
	modalManager.setContent(contactsItem.formContacts);
	modalManager.openModal();

	setTimeout(() => {
		basketView.lockedButton(contactsItem.submitButtonContacts);
	}, 0);

	validation.enableValidation(
		ValidationConfig,
		formAdress.isPaymentSelected(orderItems.buttonOnline, orderItems.buttonCash)
	);
});

emitter.on('btnChecked:online', () => {
	orderItems.buttonCash.classList.remove('button_alt-active');
	basketView.toggleClass(orderItems.buttonOnline, 'button_alt-active');

	setOrder.setPayment('online');
});

emitter.on('btnChecked:cash', () => {
	orderItems.buttonOnline.classList.remove('button_alt-active');
	basketView.toggleClass(orderItems.buttonCash, 'button_alt-active');

	setOrder.setPayment('cash');
});

emitter.on('order:submit', () => {
	const order = {
		address: setOrder.getOrderData().address,
		email: setOrder.getOrderData().email,
		phone: setOrder.getOrderData().phone,
		payment: setOrder.getOrderData().payment,
		items: modelManager.getBasketProducts().map((p) => p.id),
		total: modelManager.getTotal(),
	};

	interface IResponse {
		id: string;
		total: number;
	}

	apiWebLarek
		.postOrder(order)
		.then((data: IResponse) => {
			console.log(data);
			modalManager.setContent(successItems.orderSuccess);
			successItems.orderSuccessDescription.textContent = `Списано ${data.total} синапсов`;
			modalManager.openModal();
			modelManager.clearBasket();
			emitter.on('succes:of', () => {
				modalManager.closeModal();
			});
		})
		.catch((err) => console.warn(err));
});

emitter.on('input:adress', (ev: Event) => {
	setOrder.setAddress((ev.target as HTMLInputElement).value);
});

emitter.on('input:email', (ev: InputEvent) => {
	setOrder.setEmail((ev.target as HTMLInputElement).value);
});

emitter.on('input:phone', (ev: Event) => {
	setOrder.setPhone((ev.target as HTMLInputElement).value);
});

// --------- test -----------

// modelManager

// if (modelManager.getBasketProducts())

// modelManager.getBasketProducts().forEach((el) => {
// 	console.log(el)
// })
