// слой view - интерфейсы отображния

export interface ProductCard { // интерфейс карточки товара, содержащий в себе:
	category: string; // категория товара
	description: string; // описание карточки(софт-скилл, дополнительное, кнопка и тд)
	id: string | number; // id-шник карточки, куда же без него
	image: string;
	price: number; // цена карточки, т.е товара
	title: string; // название
}

export interface ProductResponse {
	total: number;
	items: ProductCard[];
}

export interface CloseModalButton {
	// решил вынести в отдельный интерфейс кнопку закрытия, т.к присутствует в каждой модалке
	closeButton: string | HTMLButtonElement; // кнопка закрытия модалки
}

export interface ProductAddPopup extends ProductCard, CloseModalButton {
	// этот интерфейс модального окна, содержащий все тоже, что и карточка товара + :
	buyButton: string | HTMLButtonElement; // кнопка покупки
}

export interface OrderPopup extends CloseModalButton {
	// модальное окно выбранных заказов - корзина
	nameModal: string; // т.е название модального окна - корзина
	selectedProduct: {
		// выбранный продукт, представим его массивом объектов, в котором:
		sequenceNumber: number; // порядковый номер
		nameProduct: string; // название продукта
		priceProduct: number; // его цена
		deleteProduct: string | HTMLButtonElement; // ну и кнопка удаления продукта из корзины
	}[];
	finalPrice: number; // итоговая цена заказа
	checkoutButton: string | HTMLButtonElement; // кнопка оформления заказа
}

export interface OrderPaymentPopup extends CloseModalButton {
	// модальное окно оплаты заказа
	nameModal: string; // название модального окна - оплата заказа
	orderPaymentSelectionButton: {
		// кнопки выбора оплаты:
		buttonOnline: 'Онлайн';
		buttonUponReceipt: 'При получении';
	};
	inputDeliveryAddress: HTMLInputElement; // поле ввода адреса доставки
	nextButton: HTMLButtonElement; // кнопка дальнейшего действия оплаты заказа
}

export interface ContactInformationUserPopup extends CloseModalButton {
	// модальное окно контактных данных пользователя
	inputEmail: HTMLInputElement;
	inputTel: HTMLInputElement;
	payOrderButton: HTMLButtonElement;
}

export interface OrderConfirmedPopup extends CloseModalButton {
	// ну и модальное окно статуса заказа
	image: string;
	orderStatus: string;
	priceOrder: number;
	forNewPurchasesButton: HTMLButtonElement;
}

// слой "бизнесс-логики"

export interface ProductModel<T> {
	// интерфейс действий с товаром, такие как:
	product: T[]; // массив товаров
	addProduct(): void; // добавление товара в корзину
	removeProduct(): void; // удаление товара из корзины
	getProductById(productId: string | number): T | undefined; // метод ищет товар по айди и возвращает, если он есть, в ином случае undefined
}

export interface BasketModel<T> {
	getCartItems(): T[]; // метод возвращает все товары, добавленные в корзину
	clearBasket(): void; // метод очистки корзины
	getTotalPrice(): number; // метод считает итоговую сумму всех товаров
}

// пока так, накидал основную часть
