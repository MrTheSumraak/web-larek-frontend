
/**
 * Базовый компонент
 */
export abstract class Component<T = string> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // заблокировать кнопку
    lockedButton(button: HTMLButtonElement) {
		button.disabled = true;
		button.classList.add('button_alt-disable');
	}

    // разблокировать кнопку
	unLockedButton(button: HTMLButtonElement) {
		button.disabled = false;
		button.classList.remove('button_alt-disable');
	}

    // проверка текстового содержимого элемента на определенную строку
    isPrice (price: string, checkToString: string): boolean {
		return price.trim().toLowerCase().includes(checkToString);
	}

    // метод возвращает ближайший HTMLElement с заданным классом
    getClosestElement<T extends HTMLElement> (ev: MouseEvent, className: string): T {
        const target = ev.target as T;
	    const cardEl = target.closest(className) as HTMLElement;
        return cardEl as T
    }

    // метод удаляет элемент из DOM дерева
    removeDomElement<T extends HTMLElement> (element: T) {
        if (element) {
            element.remove()
        }
    }

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
