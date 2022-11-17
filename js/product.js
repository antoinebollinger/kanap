import { APIURL } from "./config.js";
import { AJAX, CartModel, Modal } from "./helpers.js";

class Product {
    imageContainer = document.querySelector(".item__img");
    titleContainer = document.getElementById("title");
    priceContainer = document.getElementById("price");
    descriptionContainer = document.getElementById("description");
    colorsContainer = document.getElementById("colors");

    addToCartButton = document.getElementById("addToCart");

    constructor(productId) {
        this._init(productId);
    }

    _renderProduct() {
        this.imageContainer.insertAdjacentHTML("afterbegin", `
            <img src="${this.product.imageUrl}" alt="${this.product.altTxt}">
        `);
        this.titleContainer.innerHTML = this.product.name;
        this.priceContainer.innerHTML = this.product.price;
        this.descriptionContainer.innerHTML = this.product.description;
        this.colorsContainer.insertAdjacentHTML("beforeend", this.product.colors.map(color => `<option value="${color}">${color}</option>`).join(""))
    }

    _addToCart_handler() {
        this.addToCartButton.addEventListener("click", e => {
            e.preventDefault();
            const quantity = document.getElementById("quantity").value;
            const color = document.getElementById("colors").value;
            const cart = new CartModel();
            cart.addToCart({ id: this.product._id, color, quantity });
        })
    }

    async _init(productId) {
        this.product = await AJAX(`${APIURL}/${productId}`);
        this._renderProduct();
        this._addToCart_handler();
    }
}

const params = Object.fromEntries(new URLSearchParams(window.location.search));

new Product(params.id);