import { ICardCatalogItems, IPreviewItems, IPreviewCardContent } from "../../types";
import { EventEmitter } from "../base/events";

export class PreviewCardContent {

   protected cardContent: ICardCatalogItems
   protected previewContent: IPreviewItems

   constructor (cardContent: ICardCatalogItems, previewContent: IPreviewItems, emitter: EventEmitter) {
      this.cardContent = cardContent
      this.previewContent = previewContent

      this.previewContent.cardButtonPreview.addEventListener('click', (ev) => {
         emitter.emit ('basket:install', ev)
      })
   }

   setContent (data: IPreviewCardContent) {
      this.previewContent.cardTitlePreview.textContent = data.title
      this.previewContent.cardPricePreview.textContent = data.price
      this.previewContent.imagePreview.src = data.img
      this.previewContent.cardCategoryPreview.textContent = data.category
      this.previewContent.cardDescriptionPreview.textContent = data.cardDescription
   }
}