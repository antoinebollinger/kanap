import { APIURL, regexs } from "./config.js";
import { AJAX, CartModel } from "./helpers.js";

class Cart {
    mainContainer = document.getElementById("cart__items");
    totalQuantityContainer = document.getElementById("totalQuantity");
    totalPriceContainer = document.getElementById("totalPrice");
    orderButton = document.getElementById("order");
    orderForm = document.querySelector(".cart__order__form");

    constructor() {
        this.cartModel = new CartModel();
        this._init();
    }

    async _renderCart() {
        this.mainContainer.innerHTML = "";
        const products = await Promise.all(this.cartModel.cart.map(item => AJAX(`${APIURL}/${item.id}`)));
        this.mainContainer.insertAdjacentHTML("beforeend", this.cartModel.cart.map((item, i) => `
            <article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                <div class="cart__item__img">
                    <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${products[i].name}</h2>
                    <p>${item.color}</p>
                    <p>${products[i].price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                    </div>
                </div>
            </article>
        `).join(""));
        this.totalQuantityContainer.innerHTML = this.cartModel.cart.reduce((acc, cur) => acc += +cur.quantity, 0);
        this.totalPriceContainer.innerHTML = this.cartModel.cart.reduce((acc, cur, i) => acc += (+products[i].price * +cur.quantity), 0);
    }

    _addUpdateItem_handler() {
        document.querySelectorAll(".itemQuantity").forEach(ele => ele?.addEventListener("change", (e) => {
            this.cartModel.updateItem({
                id: e.target.closest("article").dataset.id,
                color: e.target.closest("article").dataset.color,
                quantity: e.target.value
            });
            this._init();
        }))
    }

    _deleteItem_handler() {
        document.querySelectorAll(".deleteItem").forEach(ele => ele?.addEventListener("click", (e) => {
            this.cartModel.deleteItem({
                id: e.target.closest("article").dataset.id,
                color: e.target.closest("article").dataset.color,
            });
            this._init();
        }));
    }

    _order_handler() {
        this.orderButton.addEventListener("click", async (e) => {
            e.preventDefault();
            await this._order();
        });
        this.orderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this._order();
        });
    }

    async _order() {
        if (this.cartModel.cart.length == 0) {
            alert("Votre panier est vide !");
            return;
        }
        const inputs = Array.from(this.orderForm.elements).filter(input => input.name !== "");
        let test = true;
        inputs.forEach(input => {
            let regex = regexs.alpha;
            switch (input.name) {
                case "email":
                    regex = regexs.email;
                    break;
                case "firstName":
                case "lastName":
                    regex = regexs.text;
                    break;
                default:
                    regex = regexs.alpha;
                    break;
            }
            if (!regex.regex.test(input.value)) {
                input.nextElementSibling.innerHTML = regex.msg;
                test = false;
            } else {
                input.nextElementSibling.innerHTML = "";
            }
        });
        if (!test) return;
        const contact = inputs.reduce((o, key) => ({ ...o, [key.id]: key.value }), {});
        const order = await this.cartModel.order({ contact });
        if (!order.orderId) return;
        this.cartModel.emptyCart();
        window.location.href = `confirmation.html?orderId=${order.orderId}`
    }

    async _init() {
        await this._renderCart();
        this._addUpdateItem_handler();
        this._deleteItem_handler();
        this._order_handler();
    }
}

new Cart();