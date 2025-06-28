import { ProductCard } from "../types"

export class ProductModel {  // класс управляет карточками товара
   protected items: ProductCard[] = [] 

   constructor () {
      this.items = []
   }

   getItems (): ProductCard[] {  // получаем массив карточек товара
      return this.items
   }

   getProductId (id: number): ProductCard | undefined {  // ищем определенный товар по id
      return this.items.find((item) => item.id === id)
   }
}