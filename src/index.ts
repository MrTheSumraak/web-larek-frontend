// -------- импорты

import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ValidationConfig } from './components/base/validationConfig';
import { ApiWebLarek } from './components/Models/apiWebLarek';
import { Model, OrderCurrent } from './components/Models/models';
import { Validation } from './components/Models/validation';
import { BasketView } from './components/Views/basketView';
import { SearchElementsCurrentCard } from './components/Views/CurrentCardView';
import { ModalWindow } from './components/Views/modalWidnow';
import { objCardClass, objLiClass } from './components/Views/objClass';
import { PageView } from './components/Views/pageViews';
import { PreviewCardContent } from './components/Views/previewCardView';
import { TemplateListView } from './components/Views/Templates/templateInit';
import {
	BasketTemplateItems,
	CatalogtemplateItems,
	ContactsTemplateItems,
	OrderTemplateItems,
	PreviewTemplateItems,
	SuccessTemplateItems,
} from './components/Views/Templates/templateItems';
import { ProductCard } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

// console.log(ValidationConfig.submitButtonSelector)


{
	// --------- константы

	const modalContainer = ensureElement<HTMLElement>('#modal-container');
	const main = ensureElement<HTMLElement>('[data-id="main"]');
	const basketCounter = ensureElement<HTMLElement>('[data-id="basketCounter"]')

	// ------ классы

	// находим все темплейнты
	// решил, что хранение всех темплейнтов в одном классе хорошая идея для ООП
	const templateInicilization = new TemplateListView();

	const emitter = new EventEmitter();
	const validation = new Validation();

	// элементы темплейнтов
	const basketContent = new BasketTemplateItems(
		templateInicilization.basketTemplate
	);
	const previewContent = new PreviewTemplateItems(
		templateInicilization.previewTemplate
	);
	const productItems = new CatalogtemplateItems(
		templateInicilization.catalogTemplate
	);
	const orderItems = new OrderTemplateItems(
		templateInicilization.orderTemplate
	);
	const contactsItem = new ContactsTemplateItems(
		templateInicilization.contactsTemplate
	);

	const succesItems = new SuccessTemplateItems (templateInicilization.successTemplate)
	// console.log(contactsItem)
	// const addedProduct = new AddedProductTemplateItems(templateInicilization.addedProductTemplate)

	// менеджеры
	const modalManager = new ModalWindow(modalContainer, emitter);
	const apiManager = new Api(API_URL);
	const basketManager = new BasketView(emitter);
	const modelManager = new Model();
	const apiWebLarek = new ApiWebLarek (apiManager, emitter)
	const orderCurrent = new OrderCurrent()

	const previewCardContent = new PreviewCardContent(
		productItems,
		previewContent
	);

	// ------- реализация

	window.addEventListener('DOMContentLoaded', () => {
		apiWebLarek.getCards();
	})

	emitter.on('cards:loading', (products: ProductCard[]) => {
		const product = new PageView(
			products,
			CDN_URL,
			templateInicilization.catalogTemplate,
			emitter
		);
		product.renderProductList(main);
		// console.log(products);
	});

	emitter.on('basket:on', () => {
		modalManager.setContent(basketContent.basketInside);
		modalManager.render();
		basketManager.checkBasketButton(
			basketContent.makingOrderButton,
			basketContent.basketList
		);

		basketContent.basketList.addEventListener('click', (ev) => {
			const target = ev.target as HTMLElement;
			if (target.matches('[data-id="basketItemDeleteButton"]')) {
				emitter.emit('remove:element', ev);
			}
		});

		basketContent.makingOrderButton.addEventListener(
			'click',
			() => {
				emitter.emit('order:detailsRequestedAdress');
			},
			{ once: true }
		);
	});


	emitter.on('cardPreview:on', (ev: MouseEvent) => {
		const cardEl = basketManager.getClosestElement<HTMLElement>(ev, '.card');
		const cardDescription = cardEl.dataset.description;
		const currentId = cardEl.dataset.idPersonal;

		if (!cardEl) return;

		const currentCardElement = new SearchElementsCurrentCard(
			cardEl,
			objCardClass
		);
		// console.log(`элементы текущей карточки': ${currentCardElement.category}, ${currentCardElement.price}, ${currentCardElement.title}`)
		previewCardContent.setContent({
			category: currentCardElement.category,
			title: currentCardElement.title,
			img: currentCardElement.img,
			price: currentCardElement.price,
			cardDescription: cardDescription,
		});
		modalManager.setContent(previewContent.cardFull);
		modalManager.render();

		basketManager.isPrice(currentCardElement.price, 'бесценно')
			? basketManager.lockedButton(previewContent.cardButtonPreview)
			: basketManager.unLocked(previewContent.cardButtonPreview);

		previewContent.cardButtonPreview.addEventListener(
			'click',
			(ev) => {
				emitter.emit('basket:itemAdded', {
					title: currentCardElement.title,
					price: currentCardElement.price,
					id: currentId,
				});
				modelManager.handleOnceOrMoreClick(ev, basketManager.lockedButton)
			},
			{ once: true }
		);
	});

	emitter.on(
		'basket:itemAdded',
		(payload: { title: string; price: string; id: string }) => {
			if (!basketManager.isPrice(payload.price, 'бесценно')) {
				const added = modelManager.addProductToBasket({
					nameProduct: payload.title,
					priceProduct: payload.price,
					id: payload.id,
				});

				if (added) {
					basketManager.renderBasket(
						modelManager.getBasketProducts(),
						basketContent.basketList
					);
					basketContent.finalPrice.textContent = `${modelManager.getSumOfPrices(
						modelManager.getBasketProducts()
					)} синапсов`;
					modalManager.closeModal();
					basketManager.updateCounter(basketCounter)
				}
			}

			console.log(basketManager.productList);
		}
	);

	emitter.on('remove:element', (ev: MouseEvent) => {
		const currentElement = basketManager.getClosestElement<HTMLElement>(
			ev,
			'[data-id="basketItem"]'
		);
		const currentId = currentElement.dataset.itemId;

		basketManager.removeDomElement(currentElement);
		modelManager.removeProductById(
			currentId,
			basketContent.basketList,
			objLiClass
		);
		// basketManager.renderBasket(
		// 	modelManager.getBasketProducts(),
		// 	basketContent.basketList
		// );
		basketManager.checkBasketButton(
			basketContent.makingOrderButton,
			basketContent.basketList
		);
		basketManager.clearTotalIfBasketEmpty(
			basketContent.basketList,
			basketContent.finalPrice
		);
		basketManager.updateCounter(basketCounter)
		console.log(basketManager.productList);
	});

	emitter.on('order:detailsRequestedAdress', () => {
		modalManager.setContent(orderItems.formOrder);
		modalManager.openModal();

		setTimeout(() => {
			basketManager.lockedButton(orderItems.submitButtonFurther);
		}, 0);
		
		validation.enableValidation(ValidationConfig);

		orderItems.formOrder.addEventListener('click', (ev) => {
			const target = ev.target as HTMLElement;
			if (target.matches('[data-id="submitButtonFurther"]')) {
				ev.preventDefault();
				emitter.emit('order:detailsRequestedContacts');
				console.log('hello');
				
			}

			if (target.matches('[data-id="buttonOnline"]')) {
				emitter.emit('btnChecked:online');
			}
			if (target.matches('[data-id="buttonCash"]')) {
				emitter.emit('btnChecked:cash');
			}
		});

		orderCurrent.set ({
			total: +(basketContent.finalPrice.textContent.replace(/[^\d]/g, "")),
			items: orderCurrent.getCurrentId (modelManager.basketProducts, orderCurrent.order.items)
		})

		// modelManager.isClassBtn(orderItems.buttonOnline, basketManager.lockedButton, orderItems.submitButtonFurther, basketManager.unLocked)
	});

	emitter.on ('btnChecked:online', () => {
		orderItems.buttonCash.classList.remove('button_alt-active')
		basketManager.toggleClass(orderItems.buttonOnline, 'button_alt-active')
	})

	emitter.on ('btnChecked:cash', () => {
		orderItems.buttonOnline.classList.remove('button_alt-active')
		basketManager.toggleClass(orderItems.buttonCash, 'button_alt-active')
	})

	emitter.on('order:detailsRequestedContacts', () => {
		// console.log(document.querySelector('[data-id="submitButtonFurther"]'));
		modalManager.setContent(contactsItem.formContacts);
		modalManager.openModal();
		setTimeout(() => {
			basketManager.lockedButton(contactsItem.submitButtonContacts);
		}, 0);
		validation.enableValidation(ValidationConfig);

		orderCurrent.set ({address: orderItems.formInputAdress.value})
		console.log(orderCurrent.get())
	});

	contactsItem.submitButtonContacts.addEventListener('click', () => {
		emitter.emit ('order:submit')
	})

	emitter.on ('order:submit', () => {
		orderCurrent.set ({
			email: contactsItem.emalInput.value,
			phone: contactsItem.phoneInput.value
		})
		console.log(orderCurrent.get())
		apiWebLarek.postOrder(orderCurrent.get()).then(() => {
			modalManager.setContent(succesItems.orderSuccess);
			succesItems.orderSuccessDescription.textContent = `Списано ${basketContent.finalPrice.textContent}`
			modalManager.openModal();
			basketManager.clearBasket(basketContent.basketList, basketContent.finalPrice)
			succesItems.orderSuccessButton.addEventListener('click', () => {
				modalManager.closeModal()
			})
		})
	})
}

// --------- test -----------

// modelManager
