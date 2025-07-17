import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class FormAdress extends Component {
	constructor(container: HTMLElement, emitter: EventEmitter) {
		super(container);

		this.container.addEventListener('click', (ev) => {
			const target = ev.target as HTMLElement;
			if (target.matches('[data-id="submitButtonFurther"]')) {
				ev.preventDefault();
				emitter.emit('order:detailsRequestedContacts');
			}

			if (target.matches('[data-id="buttonOnline"]')) {
				emitter.emit('btnChecked:online');
			}

			if (target.matches('[data-id="buttonCash"]')) {
				emitter.emit('btnChecked:cash');
			}

			if (target.matches('[data-id="formInputAdress"]')) {
				target.addEventListener('change', (ev) => {
					emitter.emit('input:adress', ev);
				});
			}
		});
	}

	isPaymentSelected(
		btnOnline: HTMLButtonElement,
		btnCash: HTMLButtonElement
	): boolean {
		return (
			btnOnline.classList.contains('button_alt-active') ||
			btnCash.classList.contains('button_alt-active')
		);
	}
}

export class FormContacts extends Component {
	constructor(container: HTMLElement, emitter: EventEmitter) {
		super(container);

		this.container.addEventListener('click', (ev) => {
			const target = ev.target as HTMLElement;
			if (target.matches('[data-id="submitButtonContacts"]')) {
				ev.preventDefault();
				emitter.emit('order:submit');
			}

			if (target.matches('[data-id="emailInput"]')) {
				target.addEventListener('change', (ev) => {
					emitter.emit('input:email', ev);
				});
			}

			if (target.matches('[data-id="phoneInput"]')) {
				target.addEventListener('change', (ev) => {
					emitter.emit('input:phone', ev);
				});
			}
		});
	}
}
