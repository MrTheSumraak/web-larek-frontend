import { ICardCatalogItems, IPreviewItems, IPreviewCardContent } from "../../types";

export class PreviewCardContent {

   protected cardContent: ICardCatalogItems
   protected previewContent: IPreviewItems

   constructor (cardContent: ICardCatalogItems, previewContent: IPreviewItems) {
      this.cardContent = cardContent
      this.previewContent = previewContent
   }

   setContent (data: IPreviewCardContent) {
      this.previewContent.cardTitlePreview.textContent = data.title
      this.previewContent.cardPricePreview.textContent = data.price
      this.previewContent.imagePreview.src = data.img
      this.previewContent.cardCategoryPreview.textContent = data.category
      this.previewContent.cardDescriptionPreview.textContent = data.cardDescription
   }
}