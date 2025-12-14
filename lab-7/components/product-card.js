const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    .img-box {
      width: 100%;
      height: 250px;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    ::slotted(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .card:hover ::slotted(img) {
      transform: scale(1.05);
    }
    .content {
      padding: 20px;
    }
    h2 {
      font-size: 1.25rem;
      margin: 0 0 10px 0;
      color: #2c3e50;
    }
    .price {
      font-size: 1.1rem;
      color: #e74c3c;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .row {
      margin-bottom: 8px;
      font-size: 0.9rem;
      color: #555;
    }
    button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      margin-top: 15px;
      transition: background 0.2s, transform 0.1s;
    }
    button:hover {
      background-color: #2980b9;
    }
    button:active {
      transform: scale(0.95);
    }
    .promo {
      position: absolute;
      top: 15px;
      right: 15px;
      background-color: #e74c3c;
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes pop {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
  </style>

  <div class="card">
    <div class="img-box">
      <slot name="image"></slot>
      <div class="promo">
        <slot name="promo"></slot>
      </div>
    </div>
    
    <div class="content">
      <h2><slot name="title">Product</slot></h2>
      <div class="price"><slot name="price"></slot></div>
      <div class="row">
        <b>Colors:</b> <slot name="colors"></slot>
      </div>
      <div class="row">
        <b>Sizes:</b> <slot name="sizes"></slot>
      </div>
      <button>Add to Cart</button>
    </div>
  </div>
`;

export default class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
      const btn = this.shadowRoot.querySelector('button');
      btn.addEventListener('click', () => alert('Added to cart!'));

      const promoSlot = this.shadowRoot.querySelector('slot[name="promo"]');
      if (promoSlot.assignedNodes().length === 0) {
          this.shadowRoot.querySelector('.promo').style.display = 'none';
      }
  }
}

customElements.define('product-card', ProductCard);
