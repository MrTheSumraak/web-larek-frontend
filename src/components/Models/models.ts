import { SelectedProduct } from '../../types';
import { createElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Model extends Component {
	protected emitter: EventEmitter;
	private basketIds: Set<string> = new Set();
	private basketProducts: SelectedProduct[] = [];

	constructor(emitter: EventEmitter, container?: HTMLElement) {
		super(container)
		this.emitter = emitter;
	}

	getBasketProducts(): SelectedProduct[] {
		return this.basketProducts;
	}

	addProduct(product: SelectedProduct): void {
		if (this.basketIds.has(product.id)) return;
		this.basketIds.add(product.id);
		this.basketProducts.push(product);
		this.emitter.emit('basket:change', this.basketProducts);
	}

	removeProduct(id: string): void {
		this.basketProducts = this.basketProducts.filter((p) => p.id !== id);
		this.basketIds.delete(id);
		this.emitter.emit('basket:change', this.basketProducts);
	}

	clearBasket(): void {
		this.basketProducts = [];
		this.basketIds.clear();
		this.emitter.emit('basket:change', this.basketProducts);
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
			this.lockedButton(button);
			const basketNull = createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			});
			basketNull.className = 'card__text';
			basketList.appendChild(basketNull);
		} else this.unLockedButton(button);
	}

	getTotal(): number {
		return this.basketProducts.reduce((sum, item) => {
			const digits = item.priceProduct.replace(/[^\d]/g, '');
			return sum + (digits ? parseInt(digits, 10) : 0);
		}, 0);
	}
}
