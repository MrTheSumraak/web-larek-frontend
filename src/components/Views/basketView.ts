import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { SelectedProduct } from '../../types';

export class BasketView extends Component {
	private basketButton: HTMLButtonElement;
	private basketList: HTMLElement;
	private finalPrice: HTMLElement;
	private counter: HTMLElement;
	private orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, emitter: EventEmitter) {
		super(container);
		this.basketButton = ensureElement(
			'[data-id="basketOn"]'
		) as HTMLButtonElement;
		this.basketList = ensureElement(
			'[data-id="basketListTemplate"]',
			container
		);
		this.finalPrice = ensureElement('[data-id="finalPrice"]', container);
		this.counter = ensureElement('[data-id="basketCounter"]');
		this.orderButton = ensureElement(
			'[data-id="makingOrderButton"]',
			container
		) as HTMLButtonElement;

		this.orderButton.addEventListener('click', () => {
			emitter.emit('order:detailsRequestedAdress');
		});

		this.basketButton.addEventListener('click', () => {
			emitter.emit('basket:on');
		});
	}

	set productList(items: HTMLElement[]) {
		this.basketList.replaceChildren(...items);
	}

	set totalPrice(value: number) {
		this.finalPrice.textContent = `${value} синапсов`;
	}

	set counterValue(value: number) {
		this.counter.textContent = String(value);
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
			basketList.innerHTML = ''
			this.lockedButton(button);
			const basketNull = createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			});
			basketNull.className = 'card__text';
			basketList.appendChild(basketNull);
		} else this.unLockedButton(button);
	}
}

export class BasketItem {
	private element: HTMLElement;

	constructor(product: SelectedProduct, index: number, emitter: EventEmitter,) {
		const template = document.querySelector(
			'[data-id="addedProductTemplate"]'
		) as HTMLTemplateElement;
		const clone = template.content.cloneNode(true) as HTMLElement;
		const item = clone.querySelector('[data-id="basketItem"]') as HTMLElement;
		item.dataset.itemId = product.id;

		clone.querySelector('[data-id="basketCardTtitle"]').textContent =
			product.title;
		clone.querySelector('[data-id="basketCardPrice"]').textContent =
			product.priceProduct;
		clone.querySelector('[data-id="basketIndex"]').textContent = String(
			index + 1
		);

		this.element = item;

		this.getElement()
			?.addEventListener('click', () => {
				emitter.emit('basket:itemRemoved', { id: product.id });
			});
	}

	getElement(): HTMLElement {
		return this.element;
	}
}


