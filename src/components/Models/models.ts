import { ICurrentCardClass, ProductCard, ProductResponse, SelectedProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";

export class Model {
   protected apiContent: Api
   protected items: ProductCard[]
   protected emmiter: EventEmitter

   constructor (api: Api, emmiter: EventEmitter) {
      this.apiContent = api
      this.emmiter = emmiter
   }

   getCards () {
      this.apiContent.get<ProductResponse>('/product').then(data => {
         this.items = data.items
         // console.log(data.items)

         this.emmiter.emit('cards:loading', this.items)
      })
   }

   getSumOfPrices (productList: SelectedProduct[]): number {
      const sum = productList.map ((item) => {
         const initial = item.priceProduct ?? ''
         const result = Array.from (initial).filter (item => item >= '0' && item <= '9').join('')
         return result ? parseInt (result, 10) : 0
      }).reduce ((acc, num) => {
         return acc + num
      }, 0)

      // console.log(sum)
      return sum
   }

   upDateIndexAndPrice<T extends HTMLElement> (list: HTMLElement, obj: ICurrentCardClass, productList: SelectedProduct[]): void {
      const items = Array.from(list.querySelectorAll(obj.item))

      items.forEach ((el, index) => {
         const li = el.querySelector(obj.index) as T
         const price = ensureElement(obj.price) as T
         if (li) {
            li.textContent = String(index + 1)
         } 
         if (price) {
            price.textContent =`${String(this.getSumOfPrices (productList))} синапсов`
         }
      })
   }

   // upDatePrice (list: HTMLElement, obj: ICurrentCardClass) {
   //    const items = Array.from(list.querySelectorAll(obj.item))

   // }



   removeProductById (array: SelectedProduct [], currentId: string, list: HTMLElement, objClass: ICurrentCardClass, productList: SelectedProduct[]) {
      const index = array.findIndex (item => item.id === currentId)
         if (index !== -1) {
            array.splice(index, 1)
   //          if (this.basketIds) {
   //             this.basketIds.delete(currentId);
   //  }
            this.upDateIndexAndPrice(list, objClass, productList)
            return
         }
   }
}