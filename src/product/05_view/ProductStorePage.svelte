<script lang="ts">
  import Gallery from "../../common/Gallery.svelte";
  import Like from "../../common/Like.svelte";
  import { Consts } from "../../Constants";
  import ProductImage from "../01_model/ProductImage";

  import ProductModel from "../01_model/ProductModel";

  const products = ProductModel.fromArrayJsonLDInDocument();

  function addToCar(product: ProductModel): void {
    const addToCardEvent = new CustomEvent(Consts.EVENT_ADD_TO_CARD, {
      detail: product,
    });
    window.dispatchEvent(addToCardEvent);
  }
</script>

<section class="page-container">
  <h1 class="text-2xl font-bold underline">Products</h1>
  {#if products.length <= 0}
    There is no products
  {/if}

  <div class="products">
    {#each products as p}
      <article
        class="product card card-compact bg-base-200 shadow-xl min-w-[300px]"
      >
        <figure>
          <Gallery allImages={p.images.map((i) => i.getUrlImage())} />
          <Like type="products" id={p.id} amount={p.likes} />
          <!--
          <img
            loading="lazy"
            class="w-full cursor-pointer"
            src="/api/products/image/{p.id}?a={p.image.updateAt}"
            alt="image of {p.name}"
          />
          -->
        </figure>
        <div class="card-body">
          <h2 class="card-title">{p.name}</h2>
          <p>{p.description}</p>
          <div class="flex justify-between content-end">
            <span class="text-lg font-bold pt-4">${p.price}.00</span>
            <button class="btn btn-primary" on:click={() => addToCar(p)}
              >Add</button
            >
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  @import "/static/tailwin.css";

  .products {
    display: flex;
    flex-wrap: wrap; /* acomodamos los cursos auno al lado del otro y que caigan*/
    justify-content: space-around;
    margin-top: 2rem;
  }

  .product {
    flex: 0 1 100%;
    margin-bottom: 2rem;
  }

  @media only screen and (min-width: 530px) {
    .product {
      flex: 0 1 calc(50% - 2rem);
    }
  }

  @media only screen and (min-width: 750px) {
    .product {
      flex: 0 1 calc(33% - 2rem);
    }
  }

  @media only screen and (min-width: 1024px) {
    .product {
      flex: 0 1 calc(25% - 2rem);
    }
  }
</style>
