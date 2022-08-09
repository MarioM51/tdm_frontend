import ProductDetailsClient from '../product/05_view/ProductDetailsClient.svelte'
import type { SvelteComponent } from 'svelte'

customElements.define(
  'wc-product-client-details',
  class extends HTMLElement {
    _element: SvelteComponent;
    
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
  
      this._element = new ProductDetailsClient({
        target: shadowRoot,
        props: {
          // items: this.getAttribute('items').split(','),
        },
      });
    }
    disconnectedCallback(): void {
      this._element?.$destroy();
    }
  }
)