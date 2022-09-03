import HomeClient from '../home/05_view/HomeClient.svelte'
import type { SvelteComponent } from 'svelte'

customElements.define(
  'wc-home',
  class extends HTMLElement {
    _element: SvelteComponent;
    
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      this._element = new HomeClient({
        target: shadowRoot,
      });
    }
    disconnectedCallback(): void {
      this._element?.$destroy();
    }
  }
)