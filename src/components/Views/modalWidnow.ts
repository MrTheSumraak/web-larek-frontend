export class Modal {

	protected openModal(openBtn: HTMLElement, modalWindow: HTMLElement, page: HTMLElement) {

		if (!openBtn) {
			throw new Error('Кнопка открытия не найдена');
		}

		openBtn.addEventListener('click', () => {
			modalWindow.classList.add('modal_active');
		});

		page.classList.add ('page__locked')
	}

	protected closeModal(modalWindow: HTMLElement, page:HTMLElement): void {
		const closeButton = modalWindow.querySelector('.modal__close');

		if (!closeButton) {
			throw new Error('Кнопка закрытия не найдена');
		}

		closeButton.addEventListener('click', () => {
			modalWindow.classList.remove('modal_active');
		});

		page.classList.remove ('page__locked')
	}

	setupModalListeners(
		modalWidnow: HTMLElement,
		openBtn: HTMLElement,
		page: HTMLElement
	): void {
		this.openModal(openBtn, modalWidnow, page);
		this.closeModal(modalWidnow, page);
	}
}
