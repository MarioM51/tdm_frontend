<script lang="ts">
  import Gallery from "../../common/Gallery.svelte";
  import Like from "../../common/Like.svelte";
  import { Consts } from "../../Constants";
  import ProductModel from "../01_model/ProductModel";

  export let onHomeScreen: boolean = false;

  const products = ProductModel.fromArrayJsonLDInDocument();

  function addToCar(product: ProductModel): void {
    const addToCardEvent = new CustomEvent(Consts.EVENT_ADD_TO_CARD, {
      detail: product,
    });
    window.dispatchEvent(addToCardEvent);
  }
</script>

<section class="page-container">
  <h1
    class="text-2xl font-bold"
    class:cursor-pointer={onHomeScreen}
    class:underline={onHomeScreen}
    on:click={() => {
      if (onHomeScreen) {
        window.location.href = "/products";
      }
    }}
  >
    Products
  </h1>
  {#if products.length <= 0}
    There is no products
  {/if}

  <div class="products">
    {#each products as p}
      <article
        class="product card card-compact bg-base-200 shadow-xl min-w-[300px]"
      >
        <figure>
          <Gallery allImages={p.imageUrls} urlImages={p.getUrl()} />
          <Like type="products" id={p.id} amount={p.likes} />
        </figure>
        <div class="card-body">
          <a href={p.getUrl()}>
            <h2 class="card-title">{p.name}</h2>
            <p>{p.description}</p>
          </a>
          <div class="flex justify-between content-end">
            <span class="text-lg font-bold pt-4">${p.price}.00</span>
            <button class="btn btn-primary" on:click={() => addToCar(p)}
              >Add</button
            >
          </div>
          <div class="flex flex-col mt-2 text-right text-xs">
            <div class="mb-2">
              Comentarios: <kbd class="kbd kbd-sm">({p.commentCount})</kbd>
            </div>
            <div class="flex content-center justify-end">
              <div>Calificacion:</div>
              <kbd class="kbd kbd-sm">
                <div class="rating">
                  <input
                    type="radio"
                    name="rating-new-comment"
                    class="mask mask-star-2 bg-orange-400"
                    checked
                  />
                </div>
                {p.commentsRating}
              </kbd>
            </div>
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
