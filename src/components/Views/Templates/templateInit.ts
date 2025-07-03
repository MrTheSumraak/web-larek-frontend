import { ensureElement } from '../../../utils/utils';

export class TemplateListView {
   successTemplate: HTMLTemplateElement;
   catalogTemplate: HTMLTemplateElement;
   previewTemplate: HTMLTemplateElement;
   addedProductTemplate: HTMLTemplateElement;
   basketTemplate: HTMLTemplateElement;
   orderTemplate: HTMLTemplateElement;
   contactsTemplate: HTMLTemplateElement;

   constructor() {
      this.successTemplate = this.getTemplate(
         '[data-id="successTemplate"]'
      ) as HTMLTemplateElement;
      this.catalogTemplate = this.getTemplate(
         '[data-id="catalogtemplate"]'
      ) as HTMLTemplateElement;
      this.previewTemplate = this.getTemplate(
         '[data-id="previewTemplate"]'
      ) as HTMLTemplateElement;
      this.addedProductTemplate = this.getTemplate(
         '[data-id="addedProductTemplate"]'
      ) as HTMLTemplateElement;
      this.basketTemplate = this.getTemplate(
         '[data-id="basketTemplate"]'
      ) as HTMLTemplateElement;
      this.orderTemplate = this.getTemplate(
         '[data-id="orderTemplate"]'
      ) as HTMLTemplateElement;
      this.contactsTemplate = this.getTemplate(
         '[data-id="contactsTemplate"]'
      ) as HTMLTemplateElement;
   }

   private getTemplate(selector: string): HTMLTemplateElement {
      const template = ensureElement(selector);
      return template as HTMLTemplateElement;
   }
}