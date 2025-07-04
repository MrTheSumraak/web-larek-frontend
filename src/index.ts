// -------- импорты

import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Model } from './components/Models/models';
import { BasketView } from './components/Views/basketView';
import { ModalWindow } from './components/Views/modalWidnow';
import { PageView } from './components/Views/pageViews';
import { PreviewCardContent } from './components/Views/previewCardView';
import { TemplateListView } from './components/Views/Templates/templateInit';
import {
	AddedProductTemplateItems,
	BasketTemplateItems,
	CatalogtemplateItems,
	PreviewTemplateItems,
} from './components/Views/Templates/templateItems';
import { ICurrentCardClass, ProductCard } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { SearchElementsCurrentCard } from './components/Views/CurrentCardView';
import { objCardClass, objLiClass } from './components/Views/objClass';

// --------- константы

{
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const main = ensureElement<HTMLElement>('[data-id="main"]');

// ------ классы

// находим все темплейнты
// решил, что хранение всех темплейнтов в одном классе хорошая идея для ООП
const templateInicilization = new TemplateListView();

const emitter = new EventEmitter();

// элементы темплейнтов
const basketContent = new BasketTemplateItems(templateInicilization.basketTemplate);
const previewContent = new PreviewTemplateItems(templateInicilization.previewTemplate);
const productItems = new CatalogtemplateItems(templateInicilization.catalogTemplate);
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
	basketManager.checkButton(
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
		emitter.emit ('placeOrder:product')
	}, { once: true })
});

emitter.on('cardPreview:on', (ev: MouseEvent) => {
	const cardEl = basketManager.getClosestElement(ev, '.card')
	const currentId = cardEl.dataset.idPersonal

	if (!cardEl) return;

	const currentCardElement = new SearchElementsCurrentCard (cardEl, objCardClass)
	// console.log(`элементы текущей карточки': ${currentCardElement.category}, ${currentCardElement.price}, ${currentCardElement.title}`)
	const cardDescription = cardEl.dataset.description
	previewCardContent.setContent({
  		category: currentCardElement.category,
  		title: currentCardElement.title,
		img: currentCardElement.img,
  		price: currentCardElement.price,
  		cardDescription: cardDescription
	});
	modalManager.setContent(previewContent.cardFull);
	modalManager.render();

	if (!basketManager.isPrice(currentCardElement.price, 'бесценно')) {
      basketManager.lockedButton(previewContent.cardButtonPreview);
   } else {
      basketManager.unLocked(previewContent.cardButtonPreview);
   }

	previewContent.cardButtonPreview.addEventListener('click', () => {
		emitter.emit ('basket:itemAdded', {
  			title: currentCardElement.title,
  			price: currentCardElement.price,
			id: currentId
})
	}, { once: true })
});

emitter.on ('basket:itemAdded',(payload: { title: string, price: string, id: string}) => {
	if (basketManager.isPrice(payload.price, 'бесценно')) {
		basketManager.addProductBasket(payload, basketContent.basketList)
		modalManager.closeModal()
		basketContent.finalPriceButton.textContent = 
		`
		${String(modelManager.getSumOfPrices(basketManager.productList))} синапсов
		`
	} 
})

emitter.on ('remove:element', (ev: MouseEvent) => {
	const currentElement = basketManager.getClosestElement(ev, '[data-id="basketItem"]')
	basketManager.removeDomElement<HTMLElement>(currentElement)

	const currentId = currentElement.dataset.itemId

	const index = basketManager.productList.findIndex (item => item.id === currentId)
	if (index !== -1) {
		basketManager.productList.splice(index, 1)
		modelManager.upDateIndex(basketContent.basketList, objLiClass)
		return
	} else {
		console.log(`товар ${currentElement} не был удален`)
		console.log(basketManager.productList)
	}
})

emitter.on ('placeOrder:product', () => {
	console.log('hello')
})
}

// --------- test -----------

// modelManager