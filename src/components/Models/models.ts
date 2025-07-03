import { ProductCard, ProductResponse, SelectedProduct } from "../../types";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";
import { BasketView } from "../Views/basketView";

export class Model {
   protected apiContent: Api
   protected items: ProductCard[]
   protected emmiter: EventEmitter

   constructor (api: Api, emmiter: EventEmitter, productList?: SelectedProduct[]) {
      this.apiContent = api
      this.emmiter = emmiter
      // this.getSumOfPrices(productList)
   }

   getCards () {
      this.apiContent.get<ProductResponse>('/product').then(data => {
         this.items = data.items
         console.log(data.items)

         this.emmiter.emit('cards:loading', this.items)
      })
   }

   // getSumOfPrices (productList: SelectedProduct[]) {
   //    productList.reduce (item => item.priceProduct)
   // }
}

// export class ProductModel {  // класс управляет карточками товара
//    protected items: ProductCard[] = [] 

//    constructor () {
//       this.items = []
//    }

//    getProductId (id: number): ProductCard | undefined {  // ищем определенный товар по id
//       return this.items.find((item) => item.id === id)
//    }
// }