<script lang="ts">
  import { onMount } from "svelte";
  import FaPlus from "svelte-icons/fa/FaPlus.svelte";
  import FaImage from "svelte-icons/fa/FaImage.svelte";
  import ProductViewModel from "../04_viewModel/ProductViewModel";
  import type IProductViewModel from "../04_viewModel/IProductViewModel";

  const productMV: IProductViewModel = ProductViewModel.getInstance();

  const productsRequest = productMV.getProductsRequest();
  const products = productMV.getProducts();

  const productToAdd = productMV.getProductToAdd();
  const productToAddRequest = productMV.getProductToAddRequest();

  const errorMsg = productMV.getErrorMsg();

  onMount(() => {
    productMV.onInit();
  });
</script>

<section>
  <h2>Productos</h2>
  <main>
    <div id="table-products-content" class="p-8">
      {#if $errorMsg != null}
        <div class="flex justify-center">
          <div class="alert alert-warning max-w-xs">
            {$errorMsg}
          </div>
        </div>
      {/if}

      <button
        class="btn btn btn-success"
        on:click={() => {
          productMV.onClickAdd(true);
        }}
      >
        <div class="icon"><FaPlus /></div>
        Add Product
      </button>
      <table class="table m-auto">
        <thead>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {#await $productsRequest}
            Loading
          {:then _}
            {#if $products != null}
              {#if $products.length <= 0}
                <tr>
                  <td colspan="3">No Products</td>
                </tr>
              {/if}
              {#each $products as product}
                <tr>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>More</td>
                </tr>
              {/each}
            {/if}
          {/await}
        </tbody>
      </table>
    </div>

    {#if $productToAdd != null}
      <div class="modal modal-open">
        <div class="modal-box">
          <h3>Add Product</h3>
          <div id="product-form">
            <div class="form-control">
              <label class="label" for="name">
                <span class="label-text">Name</span>
              </label>
              <input
                type="text"
                bind:value={$productToAdd.name}
                id="name"
                class="input input-bordered"
              />
            </div>

            <div class="form-control">
              <label class="label" for="price">
                <span class="label-text">Price</span>
              </label>
              <input
                type="number"
                bind:value={$productToAdd.price}
                id="price"
                class="input input-bordered"
              />
            </div>

            <div class="form-control">
              <label class="label" for="image">
                <span class="label-text">Image</span>
              </label>
              <div class="relative">
                <button class="absolute top-0 left-0 rounded-r-none btn">
                  <div class="icon"><FaImage /></div>
                </button>
                <input
                  bind:value={$productToAdd.image}
                  id="image"
                  type="text"
                  disabled
                  class="w-full pr-16 input  input-bordered"
                />
              </div>
            </div>

            <div class="form-control">
              <label class="label" for="description">
                <span class="label-text">Description</span>
              </label>
              <textarea
                bind:value={$productToAdd.description}
                id="description"
                class="textarea h-24 textarea-bordered"
              />
            </div>
          </div>

          <div class="modal-action">
            {#await $productToAddRequest}
              Loading...
            {:then addStatus}
              {#if addStatus == null}
                <button
                  on:click={() => productMV.onSubmitAdd()}
                  class="btn btn-success">Add</button
                >
              {/if}
            {/await}
            <button on:click={() => productMV.onClickAdd(false)} class="btn"
              >Close</button
            >
          </div>
        </div>
      </div>
    {/if}
  </main>
</section>
