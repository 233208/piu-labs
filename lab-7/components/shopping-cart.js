const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      min-width: 280px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 20px;
    }
    h3 { margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    ul { list-style: none; padding: 0; margin: 0; max-height: 400px; overflow-y: auto; }
    li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .remove { color: #e74c3c; cursor: pointer; font-weight: bold; margin-left: 10px; }
    .total { margin-top: 20px; font-weight: bold; font-size: 1.2rem; text-align: right; border-top: 2px solid #eee; padding-top: 10px; }
    .empty { color: #999; text-align: center; font-style: italic; margin: 20px 0; }
  </style>

  <h3>Cart</h3>
  <div id="cart-items">
    <div class="empty">Your cart is empty</div>
  </div>
  <div class="total" style="display:none">Total: $0.00</div>
`;

export default class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.items = [];
    }

    addItem(product) {
        this.items.push(product);
        this.render();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.render();
    }

    render() {
        const container = this.shadowRoot.getElementById('cart-items');
        const totalEl = this.shadowRoot.querySelector('.total');
        
        container.innerHTML = '';

        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty">Your cart is empty</div>';
            totalEl.style.display = 'none';
        } else {
            const ul = document.createElement('ul');
            this.items.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.title}</span>
                    <span>
                        $${item.price.toFixed(2)}
                        <span class="remove" data-index="${index}">&times;</span>
                    </span>
                `;
                ul.appendChild(li);
            });
            container.appendChild(ul);

            const total = this.items.reduce((sum, p) => sum + p.price, 0);
            totalEl.textContent = `Suma: $${total.toFixed(2)}`;
            totalEl.style.display = 'block';

            ul.querySelectorAll('.remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.removeItem(parseInt(e.target.dataset.index));
                });
            });
        }
    }
}

customElements.define('shopping-cart', ShoppingCart);