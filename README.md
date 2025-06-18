# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

В работе применяется паттерн MVP, где:

components/models.ts -  отвечает за работу бизнесс-логики
components/views.ts -  отвечает за отображение 
components/presenters.ts - презентор, отвевает за соединение models и views
components/modal.ts - отвечающий за открытие/закрытие

*********

models:

class ProductModel {  - класс управляет карточками товара

   protected items - в этом поле хранятся карточки товара

   constructor () {}

   getItems () {} - получаем массив карточек товара

   setItems () {} - метод записи в модель полученных данных о продукте

   getProductId (id: number){} - ищем определенный товар по id

   getInfoProduct () {} - получаем детальную информацию о товаре

}

class basketModel {

   protected basket [] - массив выбранных товаров

   addProductToBasket () {} - добавляет товар в корзину

   deleteProductToBasket () {} - удаляет товар из корзины

   getTotalAmountOfGoods () {} - высчитывает и возвращает итоговую сумму заказа

   checkProduct () {} - проверка товара на его существование в корзине перед добавлением

   clearBasket () {} - очищает корщину

}

class OrderModel { - класс для работы с данными клиента

   private: orderData: { - в этом поле будут храниться данные пользователя о заказе
      address: string;
        paymentMethod: string;
        email: string;
        phone: string;
   }

   constructor () {}

   getorderData () {} - метод получает уже готовый объект данных пользователя для дальнейшей работы с ним

   checkvalidateEmail () {} - метод проверяет валидность введеного email-адреса

   checkvalidatePhone () {} - метод проверяет корректность введенного номера телефона

}


*********

views:

class ProductCardView { - класс отображает список товаров

   constructor () {} 

   getItems - метод получения карточек товара

   renderProductList () {} - метод отображения карточек

}

class ProductDetailsView { - класс отображает подробную информацию о товаре

   renderProductDetails () {}

   getDetalsItems () {} - метод получает подробную информация о товаре для ее отображения

   checkBuyButton () {} - метод блокирует кнопку 'купить', если товар уже в корзине

}

class CartModalView { - класс отображает модальное окно корзины

    constructor() {} 

    getBasketItems() - метод получения списка товаров в корзине

    updateCartCount() - метод обновления счетчика товаров в корзине

    renderCart() {} - метод отображения корзины
} 

class PurchaseListView { - класс отображает список покупок

    constructor() {} 

    getPurchaseList() - метод получения списка выбранных товаров  

    renderPurchaseList() {} - метод отображения списка покупок перед оформлением заказа  
}

class DeliveryFormView { - класс отображает форму доставки

    constructor() {} 

    getDeliveryInfo() - метод получения данных о доставке

    submitDeliveryForm() {} - метод обработки формы доставки
}

class ContactsFormView { - класс отображает форму контактов

    constructor() {} 

    getContactsInfo() - метод получения контактных данных  

    submitContactsForm() {} - метод обработки формы контактов  
}

class SuccessView { - класс отображает успешное оформление заказа

    constructor() {} 

    renderSuccessMessage() {} - метод отображения экрана об успешном заказе  
}

class ModalWindow { - класс занимается управлением модальными окнам

   constructor (HTMLElement) {}

   openModal () {} -метод открывает модальное окно

   closeModal () {} - метод закрывает модальное окно
}

*********

события:

basket:open - открыть корзину

basket:add - добавить товар в корзину

basket:remove - удалить товар из корзины

product:details - открыть детали товара

order:submit - оформить заказ

*********