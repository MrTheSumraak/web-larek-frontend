import { IModalData, ProductCard } from '../../types';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class PageView {

	private product: ProductCard[];
	private contentUrl: string
	protected productTemplate: HTMLTemplateElement
	protected emitter: EventEmitter

	constructor(dataItems: ProductCard[] = [], contentUrl: string, template: HTMLTemplateElement, emitter: EventEmitter) {
		this.product = dataItems;
		this.contentUrl = contentUrl
		this.productTemplate = template

		this.emitter = emitter
	}
		
	renderProductList(main: HTMLElement) {
		this.product.forEach((product) => {
			const createCard = new ProductCardCreate(product, this.productTemplate, this.contentUrl, this.emitter)
			main.appendChild(createCard.getElement())
		});
	}
}

class ProductCardCreate extends Component<IModalData> {
	private buttonElement: HTMLButtonElement

	constructor (productElement: ProductCard, template: HTMLTemplateElement, contentUrl: string,  emitter: EventEmitter, container?: HTMLElement) {
		super (container)
		const productClone = template.content.cloneNode(true) as DocumentFragment

		const galleryItem = productClone.querySelector('[data-id="galleryItem"]') as HTMLButtonElement
		const categoryProduct = galleryItem.querySelector('[data-id="cardCategory"]') as HTMLElement
		const titleProduct = galleryItem.querySelector('[data-id="cardTitle"]') as HTMLElement
		const imgProduct = galleryItem.querySelector('[data-id="cardImage"]') as HTMLImageElement
		const priceProduct = galleryItem.querySelector('[data-id="cardPrice"]') as HTMLElement

		this.setText(categoryProduct, productElement.category)
		this.setText(titleProduct, productElement.title)
		this.setImage(imgProduct, `${contentUrl}${productElement.image}`)
		this.setText(priceProduct, `${String(productElement.price)} синапсов`)
		galleryItem.setAttribute('data-id-personal', productElement.id)
		galleryItem.setAttribute('data-description', productElement.description)
		this.buttonElement = galleryItem

		this.setClassCategory (categoryProduct)
		this.setPrice(priceProduct)

		galleryItem.addEventListener ('click', (ev) => {
			emitter.emit ('cardPreview:on', ev)
		})
	}

	setClassCategory (element: HTMLElement, ) {
		if (element.textContent.toLowerCase() === 'другое') {
			this.toggleClass(element, 'card__category_other')
		}
		if (element.textContent.toLowerCase() === 'дополнительное') {
			this.toggleClass(element, 'card__category_additional')
		}
		if (element.textContent.toLowerCase() === 'кнопка') {
			this.toggleClass(element, 'card__category_button')
		}
		if (element.textContent.toLowerCase() === 'хард-скил') {
			this.toggleClass(element, 'card__category_hard')
		}
	}

	setPrice (priceProduct: HTMLElement) {
		if (priceProduct.textContent === 'null синапсов') {
			priceProduct.textContent = 'Бесценно'
		}
	}

	getElement (): HTMLElement {
		return this.buttonElement
	}
}