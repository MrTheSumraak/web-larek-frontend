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

components/models.ts - компонент отвечает за работу бизнесс-логики
components/views.ts - компонент отвечает за отображение 
components/presenters.ts - компонент-презентор, отвевает за соединение компонентов models и views
components/modal.ts - компонент модальных окон, отвечающий за открытие/закрытие

компонент models:

class ProductModel {  - класс управляет карточками товара
   protected items - в этом поле хранятся карточки товара

   constructor () {}

   getItems () {} - получаем массив карточек товара

   getProductId (id: number){} - ищем определенный товар по id

   getInfoProduct () {} - получаем детальную информацию о товаре

}

class basketModel {
   protected basket [] - массив выбранных товаров

   addProductToBasket () {} - добавляет товар в корзину

   deleteProductToBasket () {} - удаляет товар из корзины

   getTotalAmountOfGoods () {} - высчитывает и возвращает итоговую сумму заказа

   removeFromCart () {} - метод фильтрует товары в корзине, оставляя только уникальные заказы (с разными id) 

   checkProduct () {} - проверка товара на его существование в корзине перед добавлением

   clearBasket () {} - очищает корщину

}


компонент views:

class ProductView {  - класс занимается отображением контента

   renderProductBasket () {} - метод отображает товары, которые есть в корзине

   renderProductList () {} - метод отображает товары на главной странице

   renderBasket () {} - метод отображает корзину

   renderProductDescription () {} - метод отображает окно с описанием товара для дальнейшей его передчаи в корзину
   
}

компонент presenters:

class ProductPresenter { - класс соединяет отображение и бизнесс-логику: получает данные из model и передает для отображения

   constructor (ProductModel, ProductView) 

   displayProducts () {} - метод будет брать данные из ProductModel и отображать на странице с помощью методов ProductView
   
}

компонент modal:

class Modal { - класс занимается управлением модальными окнами

   openModal () {} -метод открывает модальное окно

   closeModal () {} - метод закрывает модальное окно
}