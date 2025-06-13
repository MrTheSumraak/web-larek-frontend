import { ProductCard } from "../types";

class ProductView {
	renderProductList(products: ProductCard[]): void {
		products.forEach((product) => {
			console.log(`Товар: ${product.name}, Цена: ${product.price}`);
		});
	}
}