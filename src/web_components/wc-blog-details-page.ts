import BlogDetailsPage from '../blog/BlogDetailsPage.svelte'
import type { SvelteComponent } from 'svelte'

customElements.define(
  'wc-blog-details-page',
  class extends HTMLElement {
    _element: SvelteComponent;

    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
  
      this._element = new BlogDetailsPage({
        target: shadowRoot,
      });
    }
    disconnectedCallback(): void {
      this._element?.$destroy();
    }
  }
)