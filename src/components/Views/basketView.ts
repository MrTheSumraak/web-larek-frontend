import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class BasketView {
	basketButton: HTMLButtonElement;

	constructor(emiter: EventEmitter) {
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				emiter.emit('basket:on');
			});
		}
	}

	clearBasket() {
		// basketList.innerHTML = ''
	}

	private lockedButton(button: HTMLButtonElement) {
		button.disabled = true;
		button.classList.add('button_alt-disable');
	}

	private unLocked(button: HTMLButtonElement) {
		button.disabled = false;
		button.classList.remove('button_alt-disable');
	}

	checkButton(button: HTMLButtonElement, basketList: HTMLElement) {
		const itemsList = Array.from(basketList.children).filter(
			(item) => !item.classList.contains('card__text')
		);
		if (!basketList || itemsList.length === 0) {
			basketList.innerHTML = '';
			this.lockedButton(button);
				const basketNull = createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				});
				basketNull.className = 'card__text';
				basketList.appendChild(basketNull);
				console.log(basketList);
		} else {
			this.unLocked(button);
		}
	}
}
