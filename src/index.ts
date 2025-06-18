import { Modal } from './components/modalWidnow';
import './scss/styles.scss';

const modalManager = new Modal()

const setupModalListeners = (): void => {  // это я пока просто на скорую руку сделал, что бы закрыть попап
	const modalList = document.querySelectorAll('.modal');

	if (modalList.length > 0) {
		modalList.forEach((modal) => {
			const delBtn = modal.querySelector('.modal__close');
			delBtn.addEventListener('click', (evt) => {
				modalManager.closeModal(evt);
			});
		});
	} else {
      throw new Error(`Коллекция ${modalList} не найдена!`)
   }
};

setupModalListeners()