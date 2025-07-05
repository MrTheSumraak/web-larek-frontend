import {
	IAddedProductItems,
	IBasketItems,
	ICardCatalogItems,
	IFormContactsItens,
	IFormOrderItems,
	IPreviewItems,
	ISuccessItems,
} from '../../../types';

export abstract class CloneTemplate {
	clone: DocumentFragment;

	constructor(template: HTMLTemplateElement) {
		this.clone = template.content.cloneNode(true) as DocumentFragment;
		// console.log(this.clone)
	}
}

export class SuccessTemplateItems
	extends CloneTemplate
	implements ISuccessItems
{
	orderSuccess: HTMLElement;
	orderSuccesstitle: HTMLElement;
	orderSuccessDescription: HTMLElement;
	orderSuccessButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super(template);
		this.orderSuccess = this.clone.querySelector('[data-id="orderSuccess"]');
		this.orderSuccesstitle = this.orderSuccess.querySelector(
			'[data-id="orderTitle"]'
		);
		this.orderSuccessDescription = this.orderSuccess.querySelector(
			'[data-id="amountMoneyDebited"]'
		);
		this.orderSuccessButton = this.orderSuccess.querySelector(
			'[data-id="orderSuccessButton"]'
		);
	}
}

export class CatalogtemplateItems extends CloneTemplate implements ICardCatalogItems {
   galleryItemButton: HTMLButtonElement
	cardCategory: HTMLElement
	cardTitle: HTMLElement
	cardImage: HTMLImageElement
	cardPrice: HTMLElement

   constructor (template: HTMLTemplateElement) {
      super(template)
      this.galleryItemButton = this.clone.querySelector('[data-id="galleryItem"]') as HTMLButtonElement
      this.cardCategory = this.galleryItemButton.querySelector('[data-id="cardCategory"]') as HTMLElement
      this.cardTitle = this.galleryItemButton.querySelector('[data-id="cardTitle"]') as HTMLElement
      this.cardImage = this.galleryItemButton.querySelector('[data-id="cardImage"]') as HTMLImageElement
      this.cardPrice = this.galleryItemButton.querySelector('[data-id="cardPrice"]') as HTMLElement
   }
}

export class PreviewTemplateItems
	extends CloneTemplate
	implements IPreviewItems
{
	cardFull: HTMLElement;
	imagePreview: HTMLImageElement;
	cardCategoryPreview: HTMLElement;
	cardTitlePreview: HTMLElement;
	cardDescriptionPreview: HTMLElement;
	cardButtonPreview: HTMLButtonElement;
	cardPricePreview: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		super(template);
		this.cardFull = this.clone.querySelector('[data-id="cardPreview"]') as HTMLElement;
		this.imagePreview = this.cardFull.querySelector('[data-id="imagePreview"]');
		this.cardCategoryPreview = this.cardFull.querySelector(
			'[data-id="cardCategoryPreview"]'
		);
		this.cardTitlePreview = this.cardFull.querySelector(
			'[data-id="cardTitlePreview"]'
		);
		this.cardDescriptionPreview = this.cardFull.querySelector(
			'[data-id="cardDescriptionPreview"]'
		);
		this.cardButtonPreview = this.cardFull.querySelector(
			'[data-id="cardButtonPreview"]'
		);
		this.cardPricePreview = this.cardFull.querySelector(
			'[data-id="cardPricePreview"]'
		);
	}
}

export class AddedProductTemplateItems
	extends CloneTemplate
	implements IAddedProductItems
{
	basketItem: HTMLElement;
	basketCardIndex: HTMLElement;
	basketCardTitle: HTMLElement;
	basketCardPrice: HTMLElement;
	basketItemDeleteButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super(template);
		this.basketItem = this.clone.querySelector('[data-id="basketItem"]');
		this.basketCardIndex = this.basketItem.querySelector(
			'[data-id="basketIndex"]'
		);
		this.basketCardTitle = this.basketItem.querySelector(
			'[data-id="basketCardTtitle"]'
		);
		this.basketCardPrice = this.basketItem.querySelector(
			'[data-id="basketCardPrice"]'
		);
		this.basketItemDeleteButton = this.basketItem.querySelector(
			'[data-id="basketItemDeleteButton"]'
		);
	}
}

export class BasketTemplateItems extends CloneTemplate implements IBasketItems {
	basketInside: HTMLElement;
	basketTitle: HTMLElement;
	basketList: HTMLElement;
	makingOrderButton: HTMLButtonElement;
	finalPrice: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		super(template);
		this.basketInside = this.clone.querySelector('[data-id="basketInside"]');
		this.basketTitle = this.basketInside.querySelector(
			'[ data-id="basketTitle"]'
		);
		this.basketList = this.basketInside.querySelector('[data-id="basketListTemplate"]');
		this.makingOrderButton = this.basketInside.querySelector(
			'[data-id="makingOrderButton"]'
		);
		this.finalPrice = this.basketInside.querySelector(
			'[data-id="finalPrice"]'
		);
	}
}

export class OrderTemplateItems
	extends CloneTemplate
	implements IFormOrderItems
{
	formOrder: HTMLFormElement;
	buttonOnline: HTMLButtonElement;
	buttonCash: HTMLButtonElement;
	formInputAdress: HTMLInputElement;
	submitButtonFurther: HTMLButtonElement;
	errorSpanAdress: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		super(template);
		this.formOrder = this.clone.querySelector('[data-id="formOrder"]');
		this.buttonOnline = this.formOrder.querySelector(
			'[data-id="buttonOnline"]'
		);
		this.buttonCash = this.formOrder.querySelector('[ data-id="buttonCash"]');
		this.formInputAdress = this.formOrder.querySelector(
			'[data-id="formInputAdress"]'
		);
		this.submitButtonFurther = this.formOrder.querySelector(
			'[data-id="submitButtonFurther"]'
		);
		this.errorSpanAdress = this.formOrder.querySelector(
			'[data-id="errorSpanAdress"]'
		);
	}
}

export class ContactsTemplateItems
	extends CloneTemplate
	implements IFormContactsItens
{
	formContacts: HTMLFormElement;
	emalInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	submitButtonContacts: HTMLButtonElement;
	errorSpanContacts: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		super(template);
		this.formContacts = this.clone.querySelector('[data-id="formContacts"]');
		this.emalInput = this.formContacts.querySelector('[data-id="emailInput"]');
		this.phoneInput = this.formContacts.querySelector('[data-id="phoneInput"]');
		this.submitButtonContacts = this.formContacts.querySelector(
			'[data-id="submitButtonContacts"]'
		);
		this.errorSpanContacts = this.formContacts.querySelector(
			'[data-id="errorSpanContacts"]'
		);
	}
}
