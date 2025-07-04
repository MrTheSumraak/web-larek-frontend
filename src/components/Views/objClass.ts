import { ICurrentCardClass } from "../../types"

export const objCardClass: ICurrentCardClass = {
   category: '[data-id="cardCategory"]',
   title: '[data-id="cardTitle"]',
   img: '[data-id="cardImage"]',
   price: '[data-id="cardPrice"]',
}

export const objLiClass: ICurrentCardClass = {
	item: '[data-id="basketItem"]',
	index: '[data-id="basketIndex"]'
}