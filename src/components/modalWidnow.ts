export class Modal {

	closeModal(ev: Event): void {
		const target = ev.target as HTMLElement;
		const popup = target.closest('.modal');
		if (popup) {
			popup.classList.remove('modal_active');
		} else {
			throw new Error(`Элемент ${popup} не найден!`);
		}
	}
   
}
