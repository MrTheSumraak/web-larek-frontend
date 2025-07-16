import { Component } from "../base/Component"
import { EventEmitter } from "../base/events"

export class Succes extends Component {

   constructor (container: HTMLElement, emitter: EventEmitter) {
      super (container)

      this.container.querySelector('[data-id="orderSuccessButton"]').addEventListener('click', () => {
         emitter.emit('succes:of')
      })
   }
}