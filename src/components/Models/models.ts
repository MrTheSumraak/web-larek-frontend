import { ProductCard, SelectedProduct } from '../../types';
import { createElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Model {
	responceItems: ProductCard[]
	protected emitter: EventEmitter;
	private basketIds: Set<string> = new Set();
	private basketProducts: SelectedProduct[] = [];

	constructor(emitter: EventEmitter) {
		this.emitter = emitter;
	}

	set setItems (value: ProductCard[]) {
		this.responceItems = value
	}

	getBasketProducts(): SelectedProduct[] {
		console.log(this.basketProducts)
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

	getTotal(): number {
		return this.basketProducts.reduce((sum, item) => {
			const digits = item.priceProduct.replace(/[^\d]/g, '');
			return sum + (digits ? parseInt(digits, 10) : 0);
		}, 0);
	}
}
