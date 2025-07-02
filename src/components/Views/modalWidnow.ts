import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class ModalWindow extends Component<IModalData> {
	protected emitter: EventEmitter
	protected closeButton: HTMLButtonElement
	protected modalContent: HTMLElement

	constructor (container: HTMLElement, emitter: EventEmitter) {
		super (container)
		this.emitter = emitter

		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
   	this.modalContent = ensureElement<HTMLElement>('.modal__content', container);

		this.closeButton.addEventListener('click', this.closeModal.bind(this));
		this.container.addEventListener('click', this.closeModal.bind(this));
		this.modalContent.addEventListener('click', (event) => event.stopPropagation());
	}

  setContent(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

	openModal () {
	 	this.container.classList.add('modal_active');
    	this.emitter.emit('modal:open');
	 	document.body.style.overflow = 'hidden';
	}

	closeModal () {
		this.container.classList.remove('modal_active');
   	this.modalContent.innerHTML = '';
   	this.emitter.emit('modal:close');
		document.body.style.overflow = '';
	}

	render(data?: Partial<IModalData>): HTMLElement {
   	super.render(data);
   	this.openModal();
   	return this.container;
  }
} 