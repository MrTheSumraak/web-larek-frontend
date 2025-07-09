import { IPreviewCardContent, SelectedProduct } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class BasketView extends Component<IPreviewCardContent> {
	basketButton: HTMLButtonElement;
	productList: SelectedProduct[] = [];

	constructor(emiter: EventEmitter, container?: HTMLElement) {
		super(container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				emiter.emit('basket:on');
			});
		}
	}

	clearBasket(basketList: HTMLElement, totalPrice?: HTMLElement) {
		while (basketList.firstChild) {
			basketList.removeChild(basketList.firstChild);
		}
		if (totalPrice) {
			this.clearTotalIfBasketEmpty(basketList, totalPrice)
		}
	}

	isListChildren(basketList: HTMLElement): boolean {
		const itemsList = Array.from(basketList.children).filter(
			(item) => !item.classList.contains('card__text')
		);

		if (itemsList.length === 0) return true;
		return false;
	}

	checkBasketButton(button: HTMLButtonElement, basketList: HTMLElement) {
		if (this.isListChildren(basketList)) {
			this.clearBasket(basketList);
			this.lockedButton(button);
			const basketNull = createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			});
			basketNull.className = 'card__text';
			basketList.appendChild(basketNull);
		} else this.unLocked(button);
	}

	clearTotalIfBasketEmpty<T extends HTMLElement>(basketList: T, el: T) {
		if (this.isListChildren(basketList)) {
			el.textContent = '0 синапсов';
		}
	}

	// addProductBasket (data: Partial<IPreviewCardContent>, basketList: HTMLElement) {
	// 	const addedProduct: SelectedProduct = {
	// 		nameProduct: data.title,
	// 		priceProduct: String(data.price),
	// 		id: String(data.id)
	// 	}
	// 	this.productList.push(addedProduct)
	// 	// this.basketIds.add(String(data.id))
	// 	console.log(this.productList)

	// 	this.renderBasket(data, basketList)
	// }

	updateCounter(counter: HTMLElement, list?: []): void {
		counter.textContent = String(this.productList.length);
	}

	renderBasket(productList: SelectedProduct[], basketList: HTMLElement) {
		this.clearBasket(basketList)
		this.productList = productList;

		//  if (productList.length === 0) {
		//    const empty = createElement<HTMLParagraphElement>('p', {
		//      textContent: 'Корзина пуста',
		//      className: 'card__text'
		//    });
		//    basketList.appendChild(empty);
		//    return;
		//  }

		productList.forEach((product, index) => {
			const template = document.querySelector(
				'[data-id="addedProductTemplate"]'
			) as HTMLTemplateElement;
			const clone = template.content.cloneNode(true) as HTMLElement;
			const item = clone.querySelector('[data-id="basketItem"]') as HTMLElement;
			item.dataset.itemId = product.id;

			clone.querySelector('[data-id="basketCardTtitle"]').textContent =
				product.nameProduct;
			clone.querySelector('[data-id="basketCardPrice"]').textContent =
				product.priceProduct;
			clone.querySelector('[data-id="basketIndex"]').textContent = String(
				index + 1
			);

			basketList.appendChild(clone);
		});
	}
}
