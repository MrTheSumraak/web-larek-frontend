export class Basket {
   
}

export class BasketView {

   clearBasket () {
      // basketList.innerHTML = ''
   }

   private lockedButton (button: HTMLButtonElement) {
      button.disabled = true
      button.classList.add ('button_alt-disable')
   }

   private unLocked (button: HTMLButtonElement) {
      button.disabled = false
      button.classList.remove ('button_alt-disable')
   }

   checkButton (button: HTMLButtonElement, basketList: HTMLElement, ) {
      if (basketList && basketList.children.length === 0) {
         this.lockedButton(button)
      } else {
         this.unLocked (button)
      }
   }
}