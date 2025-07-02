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

	check() {
		console.log(this.product);
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
		// console.log(imgProduct)
		const priceProduct = galleryItem.querySelector('[data-id="cardPrice"]') as HTMLElement

		this.setText(categoryProduct, productElement.category)
		this.setText(titleProduct, productElement.title)
		this.setImage(imgProduct, `${contentUrl}${productElement.image}`)
		this.setText(priceProduct, String(productElement.price))
		galleryItem.setAttribute('data-id-personal', productElement.id)
		galleryItem.setAttribute('data-description', productElement.description)
		this.buttonElement = galleryItem

		galleryItem.addEventListener ('click', (ev) => {
			emitter.emit ('cardPreview:on', ev)
		})
	}

	getElement (): HTMLElement {
		return this.buttonElement
	}
}