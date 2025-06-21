export class Modal {
	openClose(event: Event, adRem: 'add' | 'remove') {
		const target = event.target as HTMLElement;
		const popup = target.closest('.modal');

		if (popup) {
			popup.classList[adRem]('modal_active');
		} else {
			throw new Error(`Элемент ${popup} не найден!`);
		}
	}

	openModal(btn: HTMLButtonElement, modalWindow: HTMLElement) {
		btn.addEventListener('click', () => {
			modalWindow.classList.add('modal_active');
		});
	}

	protected closeModal(ev: Event): void {
		this.openClose(ev, 'remove');
	}

	setupModalListeners(): void {
		const modalList = document.querySelectorAll('.modal');

		if (modalList.length === 0) {
			throw new Error(`Коллекция modalList не найдена!`);
		}

		modalList.forEach((modal) => {
			modal.addEventListener('click', (evt) => {
				const target = evt.target as HTMLElement;

				if (target.classList.contains('modal__close') || target === modal) {
					this.closeModal(evt);
				}
			});
		});
	}
}
