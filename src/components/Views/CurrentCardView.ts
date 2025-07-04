import { ICurrentCardClass } from "../../types"


export class SearchElementsCurrentCard {

   category: string
   title: string
   img: string
   price: string

   constructor (cardEl: HTMLElement, objClass: ICurrentCardClass) {
      this.getCurrentCardElement(cardEl, objClass)
   }

   getCurrentCardElement (cardEl: HTMLElement, objClass: ICurrentCardClass) {
      this.category = cardEl.querySelector<HTMLElement>(objClass.category)?.textContent ?? '';
      this.title = cardEl.querySelector<HTMLElement>(objClass.title)?.textContent ?? '';
	   this.img = cardEl.querySelector<HTMLImageElement>(objClass.img)?.getAttribute('src') ?? '';
	   this.price = cardEl.querySelector<HTMLElement>(objClass.price)?.textContent ?? '';
   }
}