import { ProductCard } from '../../types';

export class ProductCardCreate {
	private buttonElement: HTMLButtonElement

	constructor (productElement: ProductCard, template: HTMLTemplateElement, contentUrl: string) {
		const productClone = template.content.cloneNode(true) as DocumentFragment

		const galleryItem = productClone.querySelector('[data-id="galleryItem"]') as HTMLButtonElement
		const categoryProduct = galleryItem.querySelector('[data-id="cardCategory"]') as HTMLElement
		const titleProduct = galleryItem.querySelector('[data-id="cardTitle"]') as HTMLElement
		const imgProduct = galleryItem.querySelector('[data-id="cardImage"]') as HTMLImageElement
		// console.log(imgProduct)
		const priceProduct = galleryItem.querySelector('[data-id="cardPrice"]') as HTMLElement

		categoryProduct.textContent = productElement.category
		titleProduct.textContent = productElement.title
		imgProduct.src = `${contentUrl}${productElement.image}`
		priceProduct.textContent = String(productElement.price)
		this.buttonElement = galleryItem
	}

	getElement (): HTMLElement {
		return this.buttonElement
	}
}

export class PageView {

	private product: ProductCard[];
	private contentUrl: string
	protected productTemplate: HTMLTemplateElement

	constructor(dataItems: ProductCard[] = [], contentUrl: string, template: HTMLTemplateElement) {
		this.product = dataItems;
		this.contentUrl = contentUrl
		this.productTemplate = template
	}

	check() {
		console.log(this.product);
	}
		
	renderProductList(main: HTMLElement) {
		this.product.forEach((product) => {
			const createCard = new ProductCardCreate(product, this.productTemplate, this.contentUrl)
			main.appendChild(createCard.getElement())
		});
	}
}