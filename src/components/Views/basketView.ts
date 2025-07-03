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

	checkButton(button: HTMLButtonElement, basketList: HTMLElement) {
		const itemsList = Array.from(basketList.children).filter(
			(item) => !item.classList.contains('card__text')
		);
		if (!basketList || itemsList.length === 0) {
			basketList.innerHTML = '';
			this.lockedButton(button);
				const basketNull = createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				});
				basketNull.className = 'card__text';
				basketList.appendChild(basketNull);
				console.log(basketList);
		} else {
			this.unLocked(button);
		}
	}

	addProductBasket (data: Partial<IPreviewCardContent>, basketList: HTMLElement) {
		const addedProduct: SelectedProduct = {
			nameProduct: data.title,
			priceProduct: String(data.price)
		}
		this.productList.push(addedProduct)
		console.log(this.productList)

		this.renderProduct(data, basketList)
	}

	private renderProduct (data: Partial<IPreviewCardContent>, basketList: HTMLElement) {
		const template = document.querySelector('[data-id="addedProductTemplate"]') as HTMLTemplateElement
		const clone = template?.content.cloneNode(true) as HTMLElement

		clone.querySelector('[data-id="basketCardTtitle"]').textContent = data.title
		clone.querySelector('[data-id="basketCardPrice"]').textContent = data.price
		clone.querySelector('[data-id="basketIndex"]').textContent = String(this.productList.length)

		basketList.appendChild(clone)
	}
}