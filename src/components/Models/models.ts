import { ICurrentCardClass, ProductCard, ProductResponse, SelectedProduct } from "../../types";
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

   upDateIndex (list: HTMLElement, obj: ICurrentCardClass) {
      const items = Array.from(list.querySelectorAll(obj.item))

      items.forEach ((el, index) => {
         const li = el.querySelector(obj.index) as HTMLElement
         if (li) {
            li.textContent = String(index + 1)
         }
      })
   }
}