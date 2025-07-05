import { IValidationConfig } from "../../types";

export const ValidationConfig: IValidationConfig = {
   formSelector: '.form',
	inputSelector: '.form__input',
	submitButtonSelector: '.form__submit',
	inactiveButtonClass: 'button_alt-disable',
	inputErrorClass: 'input_type_error',
	errorClass: 'form__error',
}