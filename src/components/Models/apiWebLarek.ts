import { ProductCard, ProductResponse } from '../../types';
import { Api } from '../base/api';
import { EventEmitter } from '../base/events';

export interface IOrderResult {
	id: string;
}

export class ApiWebLarek {
	protected apiContent: Api;
	protected emmiter: EventEmitter;
	protected items: ProductCard[];

	constructor(api: Api, emmiter: EventEmitter) {
		this.apiContent = api;
		this.emmiter = emmiter;
	}

	getCards() {
		this.apiContent
			.get<ProductResponse>('/product')
			.then((data) => {
				this.items = data.items;
				this.emmiter.emit('cards:loading', this.items);
			})
			// .catch((err) => alert(`Упс, данные с сервера заблудились (: :${err}`));
	}

	// getCardsss() {
	// 	this.apiContent
	// 		.get<ProductResponse>('/order')
	// 		.then((data) => {
	// 			console.log(data)
	// 		})
	// 		// .catch((err) => alert(`Упс, данные с сервера заблудились (: :${err}`));
	// }

	postOrder(order: any): Promise<IOrderResult> {
		return this.apiContent
			.post('/order', order)
			.then((data: IOrderResult) => data)
	}
}
