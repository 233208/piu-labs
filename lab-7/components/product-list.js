import './product-card.js'; 

export default class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    width: 100%;
                    padding: 20px 0;
                }
            </style>
            <slot></slot>
        `;
    }

    set products(data) {
        this.innerHTML = '';

        data.forEach(item => {
            const card = document.createElement('product-card');

            card.title = item.title;
            card.price = item.price;
            card.image = item.image;
            card.promo = item.promo;
            
            card.colors = item.colors; 
            card.sizes = item.sizes;

            this.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);