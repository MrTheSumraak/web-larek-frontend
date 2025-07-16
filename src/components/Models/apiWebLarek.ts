import { ProductCard, ProductResponse } from '../../types';
import { Api } from '../base/api';

export interface IOrderResult {
	id: string;
}

export class ApiWebLarek {
	protected apiContent: Api;

	constructor(api: Api) {
		this.apiContent = api;
	}

	getCards(): Promise<ProductCard[]> {
		return this.apiContent
			.get<ProductResponse>('/product')
			.then((res) => res.items);
	}

	postOrder(order: any) {
		return this.apiContent.post('/order', order);
	}
}
