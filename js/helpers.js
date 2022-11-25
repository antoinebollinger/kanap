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

export class Modal {
    mainContainer = document.querySelector("body");
    modal = document.querySelector(".modal__backdrop");

    constructor() {
        this._init();
    }

    _renderModal() {
        this.mainContainer.insertAdjacentHTML("afterbegin", `
            <div class="modal__backdrop">
                <div class="modal">
                    <div class="modal__header"><strong>Kanap indique :</strong></div>
                    <div class="modal__body"></div>
                    <div class="modal__footer">
                        <div class="modal__footer__close">
                            <button class="modal__hide">Fermer</button>
                        </div>
                        <div class="modal__footer__confirm hidden">            
                            <button class="modal__hide">Annuler</button>
                            <button class="modal__confirm">Valider</button>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    setText(text = "") {
        this.modal.querySelector(".modal__body").innerHTML = text;
        return this;
    }

    async setConfirm() {
        this.modal.querySelector(".modal__footer__close").classList.add("hidden");
        this.modal.querySelector(".modal__footer__confirm").classList.remove("hidden");
        return new Promise((resolve, reject) => {
            document.querySelectorAll(".modal__hide").forEach(button => button?.addEventListener("click", () => {
                this.hideModal();
                reject();
            }));
            document.querySelectorAll(".modal__confirm").forEach(button => button?.addEventListener("click", () => {
                this.hideModal();
                resolve();
            }));
        })
    }

    showModal(text = "") {
        this.modal.classList.add("show");

        this.setText(text);

        return this;
    }

    hideModal() {
        this.modal.classList.remove("show");

        this.setText();
        this.modal.querySelector(".modal__footer__close").classList.remove("hidden");
        this.modal.querySelector(".modal__footer__confirm").classList.add("hidden");

        return this;
    }

    _init() {
        if (!this.modal) {
            this._renderModal();
            document.querySelectorAll(".modal__hide").forEach(button => button?.addEventListener("click", () => {
                this.hideModal();
            }));
            this.modal = document.querySelector(".modal__backdrop");
        }
    }
}

export class CartModel {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
        this.modal = new Modal();
    }

    _storeCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }
    /**
     * 
     * Expected arguments
     * {id, quantity, color}
     */
    async addToCart() {
        const product = [...arguments][0];
        if (!!!product) return;
        try {
            if (product.quantity == 0)
                throw new Error("Merci d'indiquer une quantité différente de 0.");
            if (product.color == "")
                throw new Error("Merci de choisir une couleur.");
            const alreadyInTheCart = this.cart.find(ele => ele.id == product.id && ele.color == product.color);
            if (alreadyInTheCart !== undefined) {
                try {
                    await this.modal.showModal("Déjà présent dans le panier. Voulez-vous ajouter la quantité à la quantité déjà présente ?").setConfirm();
                    const tmp = parseInt(alreadyInTheCart.quantity) + +product.quantity;
                    alreadyInTheCart.quantity = tmp;
                    this.modal.showModal(`La quantité a bien été modifiée.<br/><a href="./cart.html">Voir mon panier</a>`);
                } catch (error) {
                    console.log("non");
                }
            } else {
                this.cart.push([...arguments][0]);
                this.modal.showModal(`Votre produit a bien été ajouté au panier.<br/><a href="./cart.html">Voir mon panier</a>`);
            }
            this._storeCart();
        } catch (err) {
            this.modal.showModal(err.message);
            console.error(err);
            // alert(err);
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
