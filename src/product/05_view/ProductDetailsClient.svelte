<script lang="ts">
  import { Consts } from "../../Constants";
  import Gallery from "../../common/Gallery.svelte";
  import Like from "../../common/Like.svelte";
  import ProductModel from "../01_model/ProductModel";
  import ReviewsClient from "../../comments/CommentsClient.svelte";
  import CommentModel from "../../comments/CommentModel";
  import ProductService from "../03_logic/ProductService";

  const product = ProductModel.fromJsonLDInDocument();
  const productServ = new ProductService();

  function addToCar(product: ProductModel): void {
    const addToCardEvent = new CustomEvent(Consts.EVENT_ADD_TO_CARD, {
      detail: product,
    });
    window.dispatchEvent(addToCardEvent);
  }
</script>

<section class="page-container">
  <article>
    <div class="flex flex-col sm:flex-row justify-between">
      <div class="mb-4 mt-2">
        <h1 class="text-2xl font-bold mb-4">{product.name}</h1>
        <div class="flex flex-col mb-4">
          Precio:
          <span class="text-lg font-bold mb-4">${product.price}.00</span>

          <span
            >Comentarios: <kbd class="kbd kbd-sm">({product.commentCount})</kbd
            ></span
          >
          <span class="flex"
            >Calificacion: <kbd class="kbd kbd-sm">
              <div class="rating">
                <input
                  type="radio"
                  name="rating-new-comment"
                  class="mask mask-star-2 bg-orange-400"
                  checked
                />
              </div>
              {product.commentsRating}</kbd
            ></span
          >
        </div>
      </div>
      <div class="relative w-full sm:w-1/2 mb-4">
        <figure>
          <Gallery allImages={product.imageUrls} />
          <Like type="products" id={product.id} amount={product.likes} />
        </figure>
      </div>
    </div>
    <div class="flex justify-end">
      <button class="btn btn-primary" on:click={() => addToCar(product)}
        >Add</button
      >
    </div>
    <div>
      Descripcion:
      <p class="mb-4">{product.description}</p>
    </div>
  </article>

  <div class="divider" />

  <ReviewsClient
    comments={product.comments}
    idTarget={product.id}
    commentServ={productServ}
  />
</section>

<style>
  @import "/static/tailwin.css";
</style>
