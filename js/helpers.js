import { APIURL } from "./config.js";

export const AJAX = async (url, upload = undefined) => {
    try {
        const fetchData = upload ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(upload) } : {};
        const res = await fetch(url, fetchData);
        if (!res.ok) {
            throw new Error(res.status);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        return {};
    }
}

export class CartModel {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    }

    _storeCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }
    /**
     * 
     * Expected arguments
     * {id, quantity, color}
     */
    addToCart() {
        const product = [...arguments][0];
        if (!!!product) return;
        try {
            if (product.quantity == 0)
                throw new Error("Merci d'indiquer une quantité différente de 0.");
            if (product.color == "")
                throw new Error("Merci d'indiquer une couleur.");
            const alreadyInTheCart = this.cart.find(ele => ele.id == product.id && ele.color == product.color);
            if (alreadyInTheCart !== undefined) {
                if (confirm("Déjà présent dans le panier. Voulez-vous ajouter la quantité à la quantité déjà présente ?")) {
                    const tmp = parseInt(alreadyInTheCart.quantity) + +product.quantity;
                    alreadyInTheCart.quantity = tmp;
                }
            } else {
                this.cart.push([...arguments][0]);
                alert("Votre produit a bien été ajouté au panier.")
            }
            this._storeCart();
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    updateItem() {
        const product = [...arguments][0];
        if (!!!product) return;
        const alreadyInTheCart = this.cart.find(ele => ele.id == product.id && ele.color == product.color);
        if (alreadyInTheCart !== undefined)
            alreadyInTheCart.quantity = product.quantity;
        this._storeCart();
    }

    deleteItem() {
        const product = [...arguments][0];
        if (!!!product) return;
        const newCart = this.cart.filter(ele => !(ele.id == product.id && ele.color == product.color));
        this.cart = newCart;
        this._storeCart();
    }

    emptyCart() {
        this.cart = [];
        this._storeCart();
    }

    async order() {
        const contact = [...arguments][0];
        const order = await AJAX(`${APIURL}/order`, {
            ...contact, products: this.cart.map(item => item.id)
        });
        return order;
    }
}