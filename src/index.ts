import './scss/styles.scss';

import { ProductResponse } from './types';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/Views/basketView';
import { Modal } from './components/Views/modalWidnow';
import { PageView } from './components/Views/PageViews';
import { ensureElement } from './utils/utils';

document.addEventListener('DOMContentLoaded', () => {

   apiManager.get<ProductResponse>('/product').then((dat) => {
      const product = new PageView(dat.items, contentUrl)
      product.renderProductList(main)
      console.log(dat.items)
});
})

const baseUrl = `${process.env.API_ORIGIN}/api/weblarek`;
const contentUrl = `${process.env.API_ORIGIN}/content/weblarek`;

const emitter = new EventEmitter()
const modalManager = new Modal();
const apiManager = new Api(baseUrl);
const basketManager = new BasketView()

const main = ensureElement('[data-id="main"]') as HTMLElement

const basketModal = ensureElement('[data-id="basketModal"]') as HTMLElement
const basketList = basketModal.querySelector('.basket__list') as HTMLElement
const basketButton = ensureElement('[data-id="basketOn"]') as HTMLButtonElement

// const productItem = ensureElement('[data-id="galleryItem"]')
const modalPreview = ensureElement('[data-id="modalPreview"]')
// console.log(productItem)


modalManager.setupModalListeners();

modalManager.openModal(basketButton, basketModal);