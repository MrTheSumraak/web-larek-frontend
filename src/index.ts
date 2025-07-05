// -------- импорты

import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Model } from './components/Models/models';
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
	PreviewTemplateItems
} from './components/Views/Templates/templateItems';
import { ProductCard } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { Validation } from './components/Models/validation';
import { ValidationConfig } from './components/base/validationConfig';

// console.log(ValidationConfig.submitButtonSelector)

// --------- константы

{
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const main = ensureElement<HTMLElement>('[data-id="main"]');

// ------ классы

// находим все темплейнты
// решил, что хранение всех темплейнтов в одном классе хорошая идея для ООП
const templateInicilization = new TemplateListView();

const emitter = new EventEmitter();
const validation = new Validation ()

// элементы темплейнтов
const basketContent = new BasketTemplateItems(templateInicilization.basketTemplate);
const previewContent = new PreviewTemplateItems(templateInicilization.previewTemplate);
const productItems = new CatalogtemplateItems(templateInicilization.catalogTemplate);
const orderItems = new OrderTemplateItems (templateInicilization.orderTemplate)
const contactsItem = new ContactsTemplateItems (templateInicilization.contactsTemplate)
// console.log(contactsItem)
// const addedProduct = new AddedProductTemplateItems(templateInicilization.addedProductTemplate)

// менеджеры 
const modalManager = new ModalWindow(modalContainer, emitter);
const apiManager = new Api(API_URL);
const basketManager = new BasketView(emitter);
const modelManager = new Model(apiManager, emitter);

const previewCardContent = new PreviewCardContent(productItems, previewContent);

// ------- реализация

window.addEventListener('DOMContentLoaded', () => {
	modelManager.getCards();
});

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

	basketContent.basketList.addEventListener ('click', (ev) => {
		const target = ev.target as HTMLElement
		if (target.matches('[data-id="basketItemDeleteButton"]')) {
         emitter.emit('remove:element', ev);
   }
	})

	basketContent.makingOrderButton.addEventListener ('click', () => {
		emitter.emit ('order:detailsRequestedAdress')
	}, { once: true })
});

emitter.on('cardPreview:on', (ev: MouseEvent) => {
	const cardEl = basketManager.getClosestElement<HTMLElement>(ev, '.card')
	const cardDescription = cardEl.dataset.description
	const currentId = cardEl.dataset.idPersonal

	if (!cardEl) return;

	const currentCardElement = new SearchElementsCurrentCard (cardEl, objCardClass)
	// console.log(`элементы текущей карточки': ${currentCardElement.category}, ${currentCardElement.price}, ${currentCardElement.title}`)
	previewCardContent.setContent({
  		category: currentCardElement.category,
  		title: currentCardElement.title,
		img: currentCardElement.img,
  		price: currentCardElement.price,
  		cardDescription: cardDescription
	});
	modalManager.setContent(previewContent.cardFull);
	modalManager.render();

	basketManager.isPrice(currentCardElement.price, 'бесценно') ?  
	basketManager.lockedButton(previewContent.cardButtonPreview) : 
	basketManager.unLocked(previewContent.cardButtonPreview);

	previewContent.cardButtonPreview.addEventListener('click', () => {
		emitter.emit ('basket:itemAdded', {
  			title: currentCardElement.title,
  			price: currentCardElement.price,
			id: currentId
})
	}, { once: true })
});

emitter.on ('basket:itemAdded',(payload: { title: string, price: string, id: string}) => {
	if (!basketManager.isPrice(payload.price, 'бесценно')) {
		basketManager.addProductBasket(payload, basketContent.basketList)
		modalManager.closeModal()
		basketContent.finalPrice.textContent = 
		`
		${String(modelManager.getSumOfPrices(basketManager.productList))} синапсов
		`
	} 
})

emitter.on ('remove:element', (ev: MouseEvent) => {
	const currentElement = basketManager.getClosestElement<HTMLElement>(ev, '[data-id="basketItem"]')
	basketManager.removeDomElement<HTMLElement>(currentElement)

	const currentId = currentElement.dataset.itemId
	modelManager.removeProductById (basketManager.productList, 
		currentId, 
		basketContent.basketList, 
		objLiClass, 
		basketManager.productList
	)
	basketManager.checkBasketButton(
		basketContent.makingOrderButton,
		basketContent.basketList
	);
	basketManager.clearTotalIfBasketEmpty(basketContent.basketList, basketContent.finalPrice)
})

emitter.on ('order:detailsRequestedAdress', () => {
	modalManager.setContent(orderItems.formOrder)
	modalManager.openModal()

	setTimeout(() => {
		basketManager.lockedButton(orderItems.submitButtonFurther)
	}, 0);
	validation.enableValidation(ValidationConfig)

	orderItems.formOrder.addEventListener ('click', (ev) => {
		const target = ev.target as HTMLElement
		if (target.matches('[data-id="submitButtonFurther"]')) {
			ev.preventDefault()
			emitter.emit ('order:detailsRequestedContacts')
			console.log('hello')
		}
	})
})

emitter.on ('order:detailsRequestedContacts', () => {
	modalManager.setContent(contactsItem.formContacts)
	modalManager.openModal()
	setTimeout(() => {
		basketManager.lockedButton(contactsItem.submitButtonContacts)
	}, 0);
	validation.enableValidation(ValidationConfig)
})
}

// --------- test -----------

// modelManager