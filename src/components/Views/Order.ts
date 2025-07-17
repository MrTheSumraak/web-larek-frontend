export class OrderModel {
	data: {
		address: string;
		email: string;
		phone: string;
		payment: 'online' | 'cash' | null;
	};

	constructor() {
		this.data = {
			address: '',
			email: '',
			phone: '',
			payment: null,
		};
	}

	setAddress(value: string) {
		this.data.address = value;
	}

	setEmail(value: string) {
		this.data.email = value;
	}

	setPhone(value: string) {
		this.data.phone = value;
	}

	setPayment(method: 'online' | 'cash') {
		this.data.payment = method;
	}

	getOrderData() {
		return this.data;
	}
}
