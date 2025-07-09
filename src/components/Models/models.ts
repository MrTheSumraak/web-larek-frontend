import { ICurrentCardClass, IOrder, SelectedProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class Model {
	protected emmiter: EventEmitter;
	private basketIds: Set<string> = new Set();
	basketProducts: SelectedProduct[] = [];

	getBasketProducts(): SelectedProduct[] {
		return this.basketProducts;
	}

	isInBasket(id: string): boolean {
		return this.basketIds.has(id);
	}

	addProductToBasket(product: SelectedProduct): boolean {
		if (this.basketIds.has(product.id)) return false;

		this.basketIds.add(product.id);
		this.basketProducts.push(product);
		return true;
	}

	handleOnceOrMoreClick(
		ev: MouseEvent,
		method: (btn: HTMLButtonElement) => void
	) {
		const btn = ev.currentTarget as HTMLButtonElement;
		const count = parseInt(btn.dataset.clicks ?? '0', 10) + 1;
		btn.dataset.clicks = String(count);

		if (count > 0) {
			method(btn);
		}
	}

	isClassBtn(
		btn: HTMLButtonElement,
		metodLock: (btnLock: HTMLButtonElement) => void,
		btnLock: HTMLButtonElement,
		metodUnLock: (btnLock: HTMLButtonElement) => void
	) {
		if (!btn.classList.contains('button_alt-active')) {
			metodLock(btnLock);
		}
		metodUnLock(btnLock);
	}

	removeProductById(
		currentId: string,
		list: HTMLElement,
		objClass: ICurrentCardClass
	) {
		const index = this.basketProducts.findIndex(
			(item) => item.id === currentId
		);
		if (index !== -1) {
			this.basketProducts.splice(index, 1);
			this.basketIds.delete(currentId);
			this.upDateIndexAndPrice(list, objClass, this.basketProducts);
		}
	}

	getSumOfPrices(productList: SelectedProduct[]): number {
		return productList
			.map((item) => {
				const digits = (item.priceProduct ?? '')
					.split('')
					.filter((ch) => ch >= '0' && ch <= '9')
					.join('');
				return digits ? parseInt(digits, 10) : 0;
			})
			.reduce((acc, num) => acc + num, 0);
	}

	upDateIndexAndPrice<T extends HTMLElement>(
		list: HTMLElement,
		obj: ICurrentCardClass,
		productList: SelectedProduct[]
	): void {
		const items = Array.from(list.querySelectorAll(obj.item));
		items.forEach((el, index) => {
			const li = el.querySelector(obj.index) as T;
			const price = ensureElement(obj.price) as T;
			if (li) li.textContent = String(index + 1);
			if (price)
				price.textContent = `${this.getSumOfPrices(productList)} синапсов`;
		});
	}
}

export class OrderCurrent {
	order: IOrder;

	constructor() {
		this.order = {
			address: '',
			email: '',
			payment: 'card',
			phone: '',
			total: 0,
			items: [],
		};
	}

	set(values: Partial<IOrder>) {
		this.order = {
			...this.order,
			...values,
		};
	}

	getCurrentId(list: SelectedProduct[], arr: string[]): string[] {
		list.forEach((el) => {
			arr.push(el.id);
		});

		return this.order.items;
	}

	// getCurrentTotalPrice(): number {
		
	// }

	get() {
		return this.order;
	}
}
