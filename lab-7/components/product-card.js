const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: 'Segoe UI', sans-serif;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%; 
      transition: transform 0.3s, box-shadow 0.3s; 
      position: relative;
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
      position: relative;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s; 
    }
    .card:hover img {
      transform: scale(1.05); 
    }
    .content {
      padding: 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
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
      margin-top: auto; 
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
      display: none; 
      z-index: 2;
    }
  </style>

  <div class="card">
    <div class="img-box">
      <img src="" alt="Product">
      <div class="promo"></div>
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

  static get observedAttributes() {
    return ['title', 'price', 'image', 'promo'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;

    if (name === 'image') {
       this.shadowRoot.querySelector('img').src = newVal;
       this.shadowRoot.querySelector('img').alt = this.getAttribute('title') || 'Produkt';
    } 
    else if (name === 'promo') {
       const el = this.shadowRoot.querySelector('.promo');
       if (newVal) {
           el.style.display = 'block';
           el.textContent = newVal;
       } else {
           el.style.display = 'none';
       }
    }
    if (name === 'title') this._updateSlot('title', newVal);
    if (name === 'price') this._updateSlot('price', `$${parseFloat(newVal).toFixed(2)}`);
  }
  get title() { return this.getAttribute('title'); }
  set title(val) { this.setAttribute('title', val); }

  get price() { return this.getAttribute('price'); }
  set price(val) { this.setAttribute('price', val); }

  get image() { return this.getAttribute('image'); }
  set image(val) { this.setAttribute('image', val); }

  get promo() { return this.getAttribute('promo'); }
  set promo(val) { 
      if (val) this.setAttribute('promo', val);
      else this.removeAttribute('promo');
  }

  set colors(val) { this._updateSlot('colors', val); }
  set sizes(val) { this._updateSlot('sizes', val); }

  _updateSlot(name, text) {
      let el = this.querySelector(`[slot="${name}"]`);
      if (!el) {
          el = document.createElement('span');
          el.slot = name;
          this.appendChild(el);
      }
      el.textContent = text;
  }

  connectedCallback() {
      this.shadowRoot.querySelector('button').addEventListener('click', this.#handleAddToCart);
  }

  disconnectedCallback() {
      this.shadowRoot.querySelector('button').removeEventListener('click', this.#handleAddToCart);
  }

  #handleAddToCart = () => {
      this.dispatchEvent(new CustomEvent('add-to-cart', {
          bubbles: true,
          composed: true,
          detail: {
              title: this.title,
              price: parseFloat(this.price)
          }
      }));
  }
}

customElements.define('product-card', ProductCard);