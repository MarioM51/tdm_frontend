<script lang="ts">
  import { onMount } from "svelte";
  import FaPlus from "svelte-icons/fa/FaPlus.svelte";
  import FaImage from "svelte-icons/fa/FaImage.svelte";
  import ProductViewModel from "../04_viewModel/ProductViewModel";
  import type IProductViewModel from "../04_viewModel/IProductViewModel";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import FaEdit from "svelte-icons/fa/FaEdit.svelte";

  const productVM: IProductViewModel = ProductViewModel.getInstance();

  const productsRequest = productVM.getProductsRequest();
  const products = productVM.getProducts();

  const productOnForm = productVM.getProductOnForm();
  const productOnFormRequest = productVM.getProductOnFormRequest();

  const productToDelete = productVM.getProductToDelete();
  const productToDeleteRequest = productVM.getProductToDeleteRequest();

  const errorMsg = productVM.getErrorMsg();

  onMount(() => {
    productVM.onInit();
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
          productVM.onClickAdd();
        }}
      >
        <div class="icon"><FaPlus /></div>
        Add Product
      </button>
      <table class="table m-auto table-compact table-zebra">
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
              {#each $products as product, k}
                <tr>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td class="flex justify-center">
                    <div class="icon" on:click={() => productVM.onClickEdit(k)}>
                      <FaEdit />
                    </div>

                    <div
                      class="icon icon-del"
                      on:click={() => productVM.onClickRemove(k)}
                    >
                      <FaRegTrashAlt />
                    </div>
                  </td>
                </tr>
              {/each}
            {/if}
          {/await}
        </tbody>
      </table>
    </div>

    {#if $productOnForm != null}
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
                bind:value={$productOnForm.name}
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
                bind:value={$productOnForm.price}
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
                  bind:value={$productOnForm.image}
                  id="image"
                  type="text"
                  disabled
                  class="w-full pr-16 input input-bordered pl-[75px]"
                />
              </div>
            </div>

            <div class="form-control">
              <label class="label" for="description">
                <span class="label-text">Description</span>
              </label>
              <textarea
                bind:value={$productOnForm.description}
                id="description"
                class="textarea h-24 textarea-bordered"
              />
            </div>
          </div>

          <div class="modal-action">
            {#await $productOnFormRequest}
              Loading...
            {:then addStatus}
              {#if addStatus == null}
                {#if $productOnForm.id == null}
                  <button
                    on:click={() => productVM.onSubmitAdd()}
                    class="btn btn-success">Add</button
                  >
                {:else}
                  <button
                    on:click={() => productVM.onConfirmEdit()}
                    class="btn btn-info">Edit</button
                  >
                {/if}
              {/if}
            {/await}
            <button on:click={() => productVM.closeProductForm()} class="btn"
              >Close</button
            >
          </div>
        </div>
      </div>
    {/if}

    {#if $productToDelete != null}
      <div class="modal modal-open">
        <div class="modal-box">
          Are you sure you want to delete the product <b
            >{$productToDelete.name}</b
          >?
          <div class="modal-action">
            {#await $productToDeleteRequest}
              Loading...
            {:then deleteStatus}
              {#if deleteStatus == null}
                <button
                  on:click={() => productVM.onConfirmRemove()}
                  class="btn btn-error">Delete</button
                >
              {/if}
            {/await}
            <button on:click={() => productVM.onClickRemove(-1)} class="btn"
              >Close</button
            >
          </div>
        </div>
      </div>
    {/if}
  </main>
</section>

<style>
  .icon {
    cursor: pointer;
    width: 22px;
    height: 22px;
    margin: 10px;
  }
  .icon:hover {
    color: rgb(85, 85, 248);
  }

  .icon-del:hover {
    color: rgb(248, 85, 85);
  }
</style>
