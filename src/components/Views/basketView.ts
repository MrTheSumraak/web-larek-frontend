import { IPreviewCardContent, SelectedProduct } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';


export class BasketView extends Component<IPreviewCardContent> {
	basketButton: HTMLButtonElement;
	productList: SelectedProduct[]

	constructor(emiter: EventEmitter, container?: HTMLElement) {
		super (container)
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				emiter.emit('basket:on');
			});
		}

		this.productList = []
	}

	clearBasket() {
		// basketList.innerHTML = ''
	}

	isListChildren (basketList: HTMLElement): boolean {
		const itemsList = Array.from(basketList.children).filter(
			(item) => !item.classList.contains('card__text')
		);

		if (itemsList.length === 0) return true
		return false
	}

	checkButton(button: HTMLButtonElement, basketList: HTMLElement) {
		if (this.isListChildren(basketList)) {
			basketList.innerHTML = '';
			this.lockedButton(button);
				const basketNull = createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				});
				basketNull.className = 'card__text';
				basketList.appendChild(basketNull);
				// console.log(basketList);
		} else {
			this.unLocked(button);
		}
	}

	addProductBasket (data: Partial<IPreviewCardContent>, basketList: HTMLElement) {
		const addedProduct: SelectedProduct = {
			nameProduct: data.title,
			priceProduct: String(data.price),
			id: String(data.id)
		}
		this.productList.push(addedProduct)
		console.log(this.productList)

		this.renderProduct(data, basketList)
	}


	private renderProduct (data: Partial<IPreviewCardContent>, basketList: HTMLElement) {
		const template = document.querySelector('[data-id="addedProductTemplate"]') as HTMLTemplateElement
		const clone = template?.content.cloneNode(true) as HTMLElement
		const item = clone.querySelector('[ data-id="basketItem"]') as HTMLElement
		item.dataset.itemId = String(data.id)
		// console.log(item)
		clone.querySelector('[data-id="basketCardTtitle"]').textContent = data.title
		clone.querySelector('[data-id="basketCardPrice"]').textContent = data.price
		clone.querySelector('[data-id="basketIndex"]').textContent = String(this.productList.length)
		

		basketList.appendChild(clone)
	}
}