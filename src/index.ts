// -------- импорты

import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Model } from './components/Models/models';
import { BasketView } from './components/Views/basketView';
import { ModalWindow } from './components/Views/modalWidnow';
import { PageView } from './components/Views/pageViews';
import { PreviewCardContent } from './components/Views/previewCardView';
import { TemplateView } from './components/Views/Templates/templateInit';
import {
	BasketTemplateItems,
	CatalogtemplateItems,
	PreviewTemplateItems,
} from './components/Views/Templates/templateItems';
import { ProductCard } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

// --------- константы

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const main = ensureElement<HTMLElement>('[data-id="main"]');

// ------ классы

// находим все темплейнты
// решил, что хранение всех темплейнтов в одном классе хорошая идея для ООП
const templateInicilization = new TemplateView();

const emitter = new EventEmitter();

// элементы темплейнтов
const basketContent = new BasketTemplateItems(templateInicilization.basketTemplate);
const previewContent = new PreviewTemplateItems(templateInicilization.previewTemplate);
const productItems = new CatalogtemplateItems(templateInicilization.catalogTemplate);

// менеджеры 
const modalManager = new ModalWindow(modalContainer, emitter);
const apiManager = new Api(API_URL);
const basketManager = new BasketView(emitter);
const modelManager = new Model(apiManager, emitter);

const previewCardContent = new PreviewCardContent(productItems, previewContent);

// ------- логика

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
	console.log(products);
});

emitter.on('basket:on', () => {
	modalManager.setContent(basketContent.basketInside);
	modalManager.render();
	basketManager.checkButton(
		basketContent.makingOrderButton,
		basketContent.basketList
	);
});

emitter.on('cardPreview:on', (ev: MouseEvent) => {
	const target = ev.target as HTMLElement;
	const cardEl = target.closest('.card') as HTMLElement;

	if (!cardEl) return;

	const category = cardEl.querySelector('.card__category')?.textContent ?? '';
	const title = cardEl.querySelector('.card__title')?.textContent ?? '';
	const img = cardEl.querySelector('.card__image')?.getAttribute('src') ?? '';
	const price = cardEl.querySelector('.card__price')?.textContent ?? '';
	const cardDescription = cardEl.dataset.description
	previewCardContent.setContent({ category, title, img, price, cardDescription });
	modalManager.setContent(previewContent.cardFull);
	modalManager.render();
});
