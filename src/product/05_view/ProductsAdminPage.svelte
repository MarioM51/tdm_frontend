<script lang="ts">
  import { onMount } from "svelte";
  import FaPlus from "svelte-icons/fa/FaPlus.svelte";
  import FaImage from "svelte-icons/fa/FaImage.svelte";
  import ProductViewModel from "../04_viewModel/ProductViewModel";
  import type IProductViewModel from "../04_viewModel/IProductViewModel";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import FaEdit from "svelte-icons/fa/FaEdit.svelte";
  import { Consts } from "../../Constants";

  const prodImg = Consts.HOST + "/api/products/image/";
  const IMAGE_404 = "/favicon.ico";

  const productVM: IProductViewModel = ProductViewModel.getInstance();

  const productsRequest = productVM.getProductsRequest();
  const products = productVM.getProducts();

  const productOnForm = productVM.getProductOnForm();
  const productOnFormRequest = productVM.getProductOnFormRequest();
  const uploadImageReq = productVM.getUploadImageReq();

  const productToDelete = productVM.getProductToDelete();
  const productToDeleteRequest = productVM.getProductToDeleteRequest();

  const errorMsg = productVM.getErrorMsg();
  const errorFormMsg = productVM.getErrorFormMsg();
  const errorUploadImage = productVM.getErrorUploadImage();

  let files: FileList;
  let showForm = false;
  let showDelForm = false;

  onMount(() => {
    productVM.onInit();
  });

  productOnForm.subscribe((prod) => {
    setTimeout(() => {
      showForm = prod != null;
    }, 10);
  });

  productToDelete.subscribe((toDel) => {
    setTimeout(() => {
      showDelForm = toDel != null;
    }, 10);
  });

  let imgPreview;
  let imgPreviewImage = null;
  function previewImage() {
    const fileReader = new FileReader();
    if (files[0] != undefined) {
      fileReader.readAsDataURL(files[0]);
      fileReader.addEventListener("load", function () {
        imgPreview.src = this.result;
        imgPreviewImage = this.result;
      });
    } else {
      imgPreview.src = IMAGE_404;
    }
  }
</script>

<section>
  <h2>Productos</h2>
  <main>
    <div id="table-products-content">
      {#if $errorMsg != null}
        <div>
          <div class="alert alert-warning max-w-xs">
            {$errorMsg}
          </div>
        </div>
      {/if}

      <button
        class="btn btn-sm btn-success mb-4"
        on:click={() => {
          productVM.onClickAdd();
        }}
      >
        <div class="icon-btn"><FaPlus /></div>
        Add
      </button>
      <div class="overflow-x-auto flex justify-center">
        <table class="table m-auto table-compact table-zebra">
          <thead>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {#await $productsRequest}
              <button class="btn btn-circle loading btn-disabled" />
            {:then _}
              {#if $products != null}
                {#if $products.length <= 0}
                  <tr>
                    <td colspan="3">No Products</td>
                  </tr>
                {/if}
                {#each $products as product, k}
                  <tr>
                    <td>
                      <a
                        href={prodImg +
                          product.id +
                          "?updateAt=" +
                          product.image?.updateAt}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <img
                          src={product.image != null
                            ? prodImg +
                              product.id +
                              "?updateAt=" +
                              product.image?.updateAt
                            : IMAGE_404}
                          onerror="if (this.src != '{IMAGE_404}') this.src = '{IMAGE_404}';"
                          height="50"
                          width="50"
                          alt="icon"
                          loading="lazy"
                        />
                      </a>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td class="flex justify-center">
                      <div
                        class="icon"
                        on:click={() => productVM.onClickEdit(k)}
                      >
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
    </div>

    {#if $productOnForm != null}
      <div class="modal" class:modal-open={showForm}>
        <div class="modal-box">
          <h3>{$productOnForm.id == null ? "Add" : "Update"} Product</h3>

          <div class="modal-action">
            {#await $productOnFormRequest}
              <button class="btn loading btn-disabled">Loading</button>
            {:then _}
              {#if $productOnForm?.id == null}
                <button
                  on:click={() => {
                    productVM.onSubmitAdd(files);
                    imgPreviewImage = undefined;
                    files = null;
                  }}
                  class="btn btn-success">Add</button
                >
              {:else}
                <button
                  on:click={() => {
                    productVM.onConfirmEdit(files);
                    imgPreviewImage = undefined;
                    files = null;
                  }}
                  class="btn btn-info">Edit</button
                >
              {/if}
            {/await}
            <button on:click={() => productVM.closeProductForm()} class="btn"
              >Close</button
            >
          </div>

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
                <button
                  class="absolute top-0 left-0 rounded-r-none btn disabled"
                  class:loading={$uploadImageReq != null}
                >
                  {#if $uploadImageReq == null}
                    <div class="icon"><FaImage /></div>
                  {/if}
                </button>

                <input
                  id="image"
                  type="file"
                  accept="image/png, image/jpeg"
                  bind:files
                  on:change={previewImage}
                  class="w-full pr-16 input input-bordered pl-[75px]"
                />
              </div>

              <div class="flex justify-center pt-3">
                <img
                  src={$productOnForm.image != null && imgPreviewImage == null
                    ? prodImg +
                      $productOnForm.id +
                      "?updateAt=" +
                      $productOnForm.image.updateAt
                    : imgPreviewImage != null
                    ? imgPreviewImage
                    : IMAGE_404}
                  height="200px"
                  width="200px"
                  onerror="if (this.src != '{IMAGE_404}') this.src = '{IMAGE_404}';"
                  bind:this={imgPreview}
                  alt="icon"
                  loading="lazy"
                />
              </div>

              {#if $errorUploadImage != null}
                <label class="label" for="image">
                  <span class="label-text-alt text-error"
                    >{$errorUploadImage}</span
                  >
                </label>
              {/if}
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

          {#if $errorFormMsg != null}
            <div>
              <div class="alert alert-warning max-w-xs">
                {$errorFormMsg}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    {#if $productToDelete != null}
      <div class="modal" class:modal-open={showDelForm}>
        <div class="modal-box">
          Are you sure you want to delete the product <b
            >{$productToDelete.name}</b
          >?
          <div class="modal-action">
            {#await $productToDeleteRequest}
              <button class="btn loading btn-disabled">Loading</button>
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

  .icon-btn {
    cursor: pointer;
    width: 15px;
    height: 15px;
    margin: 5px;
  }

  .icon:hover {
    color: rgb(85, 85, 248);
  }

  .icon-del:hover {
    color: rgb(248, 85, 85);
  }
</style>
