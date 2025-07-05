import { IValidationConfig } from '../../types';

export class Validation {
	private showInputError(
		formElement: HTMLFormElement,
		inputElement: HTMLInputElement,
		errorMessage: string,
		validConfig: IValidationConfig
	) {
		const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
		inputElement.classList.add(validConfig.inputErrorClass);
		errorElement.classList.add(validConfig.errorClass);
		console.log(errorElement);
		errorElement.textContent = errorMessage;
	}

	private hideInputError(
		formElement: HTMLFormElement,
		inputElement: HTMLInputElement,
		validConfig: IValidationConfig
	) {
		const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
		inputElement.classList.remove(validConfig.inputErrorClass);
		errorElement.classList.remove(validConfig.errorClass);
		errorElement.textContent = '';
	}

	private isValid(
		formElement: HTMLFormElement,
		inputElement: HTMLInputElement,
		validConfig: IValidationConfig
	) {
		// console.log(inputElement.validity.valid)
		if (inputElement.validity.patternMismatch) {
			inputElement.setCustomValidity(inputElement.dataset.errorMessage);
		} else {
			inputElement.setCustomValidity('');
		}
		if (!inputElement.validity.valid) {
			this.showInputError(
				formElement,
				inputElement,
				inputElement.validationMessage,
				validConfig
			);
		} else {
			this.hideInputError(formElement, inputElement, validConfig);
		}
	}

	private hasInvalidInput(inputList: HTMLInputElement[]): boolean {
		return inputList.some((inputElement: HTMLInputElement) => {
			return !inputElement.validity.valid ;
		});
	}
   // || inputElement.value.trim() === ''

	private toggleButtonState(
		inputList: HTMLInputElement[],
		buttonElement: HTMLButtonElement,
		validConfig: IValidationConfig
	) {
		if (!buttonElement) {
			console.warn('Кнопка не найдена, пропускаем toggleButtonState');
			return;
		}

		if (this.hasInvalidInput(inputList)) {
			buttonElement.disabled = true;
			buttonElement.classList.add(validConfig.inactiveButtonClass);
		} else {
			buttonElement.disabled = false;
			buttonElement.classList.remove(validConfig.inactiveButtonClass);
		}
	}

	private setEventListeners(
		formElement: HTMLFormElement,
		validConfig: IValidationConfig
	) {
		const inputList = Array.from(
			formElement.querySelectorAll(validConfig.inputSelector)
		) as HTMLInputElement[];
		const buttonElement = document.querySelector(
			validConfig.submitButtonSelector
		) as HTMLButtonElement;
		if (validConfig.submitButtonSelector) {
			this.toggleButtonState(inputList, buttonElement, validConfig);
		}
		inputList.forEach((inputElement) => {
			inputElement.addEventListener('input', () => {
				this.isValid(formElement, inputElement, validConfig);
				// console.log(inputElement);
				if (validConfig.submitButtonSelector) {
					this.toggleButtonState(inputList, buttonElement, validConfig);
				}
			});
		});
	}

	enableValidation(validConfig: IValidationConfig) {
		const formList = Array.from(
			document.querySelectorAll(validConfig.formSelector)
		);
		// console.log(formList)

		formList.forEach((formElement: HTMLFormElement) => {
			formElement.addEventListener('submit', (evt) => {
				evt.preventDefault();
			});
			this.setEventListeners(formElement, validConfig);
		});
	}

	clearValidation(
		formElement: HTMLFormElement,
		validConfig: IValidationConfig
	) {
		const inputList = Array.from(
			formElement.querySelectorAll(validConfig.inputSelector)
		);
		const buttonElement = formElement.querySelector(
			validConfig.submitButtonSelector
		) as HTMLButtonElement;
		buttonElement.classList.add(validConfig.inactiveButtonClass);
		buttonElement.disabled = true;
		inputList.forEach((inputElement: HTMLInputElement) => {
			this.hideInputError(formElement, inputElement, validConfig);
			inputElement.setCustomValidity('');
		});
	}
}
