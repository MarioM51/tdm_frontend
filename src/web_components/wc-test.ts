import Test from '../Test.svelte'
import type { SvelteComponent } from 'svelte'

customElements.define(
  'wc-test',
  class extends HTMLElement {
    _element: SvelteComponent;
    //_items = ["item 1","Item 2","Item 3"]
    
    constructor() {
      super()
  
      const shadowRoot = this.attachShadow({ mode: 'open' })
  
      this._element = new Test({
        target: shadowRoot,
        props: {
          // items: this.getAttribute('items').split(','),
        },
      })
    }
    disconnectedCallback(): void {
      this._element?.$destroy();
    }
  }
)