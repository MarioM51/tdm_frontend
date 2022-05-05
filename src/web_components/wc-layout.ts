import Layout from '../common/Layout/Layout.svelte'
import type { SvelteComponent } from 'svelte'

customElements.define(
  'wc-layout',
  class extends HTMLElement {
    _element: SvelteComponent;
    //_items = ["item 1","Item 2","Item 3"]
    
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
  
      this._element = new Layout({
        target: shadowRoot,
        props: {
          // items: this.getAttribute('items').split(','),
        },
      });

      
      const oldContent = this._element.$$.root.querySelector('#layout-content-page');
      const newContent = document.getElementById("content-page");
      oldContent.replaceWith(newContent)
    }
    disconnectedCallback(): void {
      // Destroy the Svelte component when this web component gets
      // disconnected. If this web component is expected to be moved
      // in the DOM, then you need to use `connectedCallback()` and
      // set it up again if necessary.
      this._element?.$destroy();
    }
  }
)