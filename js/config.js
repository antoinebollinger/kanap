export const APIURL = "http://localhost:3000/api/products";

export const regexs = {
    alpha: {
        regex: /^[/a-zA-Z0-9\u00C0-\u017F -,]+$/,
        msg: "Ce champ ne doit contenir que des caractères alphanumériques."
    },
    text: {
        regex: /^[a-zA-Z -,]+$/,
        msg: "Ce champ ne doit contenir que des lettres."
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        msg: "Veuillez rentrer une adresse email valide."
    }
}