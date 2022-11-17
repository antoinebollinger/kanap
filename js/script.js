import { APIURL } from "./config.js";
import { AJAX } from "./helpers.js";

class Product {
    constructor(product) {
        this.product = product;
    }

    _renderProduct() {
        return `
            <a href="./product.html?id=${this.product._id}">
                <article>
                    <img src="${this.product.imageUrl}" alt="${this.product.altTxt}">
                    <h3 class="productName">${this.product.name}</h3>
                    <p class="productDescription">${this.product.description}</p>
                </article>
            </a>
        `;
    }
}

class App {
    mainContainer = document.getElementById("items");

    constructor() {
        this._init();
    }

    async _init() {
        this.products = await AJAX(APIURL);
        this._renderProducts();
    }

    _renderProducts() {
        this.mainContainer.innerHTML = "";
        this.mainContainer.insertAdjacentHTML("beforeend", this.products.map(product => {
            const model = new Product(product);
            return model._renderProduct();
        }).join(""));
    }
}

new App();