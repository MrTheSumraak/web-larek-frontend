import './scss/styles.scss';

import { ProductResponse, SelectedProduct } from './types';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/Views/basketView';
import { Modal } from './components/Views/modalWidnow';
import { PageView } from './components/Views/PageViews';
import { ensureElement } from './utils/utils';
import { TemplateView } from './components/Views/templateInit';
import { CatalogtemplateItems } from './components/Views/templateItems';

const baseUrl = `${process.env.API_ORIGIN}/api/weblarek`;
const contentUrl = `${process.env.API_ORIGIN}/content/weblarek`;
console.log(baseUrl);

const templateInicilization = new TemplateView();
const emitter = new EventEmitter();
const modalManager = new Modal();
const apiManager = new Api(baseUrl);
const basketManager = new BasketView();
const productItems = new CatalogtemplateItems(
	templateInicilization.catalogTemplate
);
// console.log (productItems.galleryItemButton)

const main = ensureElement('[data-id="main"]') as HTMLElement;
const page = ensureElement ('[data-id="pageLocked"]')
// console.log(page)

const basketModal = ensureElement('[data-id="basketModal"]') as HTMLElement;
const basketList = basketModal.querySelector(
	'[data-id="basketList"]'
) as HTMLElement;
const basketButton = ensureElement('[data-id="basketOn"]') as HTMLButtonElement;
const intermediateBasketButton = ensureElement(
	'[data-id="intermediateButton"]'
) as HTMLButtonElement;
const modalPreview = ensureElement('[data-id="modalPreview"]');


basketManager.checkButton(intermediateBasketButton, basketList);

modalManager.setupModalListeners(
		modalPreview,
		main,
		page
	);

apiManager.get<ProductResponse>('/product').then((dat) => {
	const product = new PageView(
		dat.items,
		contentUrl,
		templateInicilization.catalogTemplate
	);
	product.renderProductList(main);

	console.log(dat.items);
});

modalManager.setupModalListeners(basketModal, basketButton, page);
