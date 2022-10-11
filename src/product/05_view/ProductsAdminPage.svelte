<script lang="ts">
  import { onMount } from "svelte";
  import FaPlus from "svelte-icons/fa/FaPlus.svelte";
  import ProductAdminViewModel from "../04_viewModel/ProductAdminViewModel";
  import type IProductAdminViewModel from "../04_viewModel/IProductAdminViewModel";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import FaEdit from "svelte-icons/fa/FaEdit.svelte";
  import IoMdRefreshCircle from "svelte-icons/io/IoMdRefreshCircle.svelte";
  import { writable, Writable } from "svelte/store";
  import MultipleImageInput from "../../common/MultipleImageInput.svelte";
  import ProductImage from "../01_model/ProductImage";

  const IMAGE_404 = "/favicon.ico";

  const productVM: IProductAdminViewModel = ProductAdminViewModel.getInstance();

  const productsRequest = productVM.getProductsRequest();
  const products = productVM.getProducts();

  const productOnForm = productVM.getProductOnForm();
  const productOnFormRequest = productVM.getProductOnFormRequest();
  const uploadImageReq = productVM.getUploadImageReq();

  const productToDelete = productVM.getProductToDelete();
  const productToDeleteRequest = productVM.getProductToDeleteRequest();

  const deleteImageReq = productVM.getDeleteImageReq();

  const errorMsg = productVM.getErrorMsg();
  const errorFormMsg = productVM.getErrorFormMsg();
  const errorUploadImage = productVM.getErrorUploadImage();

  let files: Writable<FileList[]> = writable([]);
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

      <div class="mb-4">
        <button
          class="btn btn-sm btn-success"
          on:click={() => {
            productVM.onClickAdd();
          }}
        >
          <div class="icon-btn"><FaPlus /></div>
          Agregar
        </button>

        <button
          class="btn btn-sm gap-2"
          on:click={() => {
            productVM.onInit();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path
              d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
            />
          </svg>
          Recargar
        </button>
      </div>

      <div class="overflow-x-auto flex justify-center">
        <table class="table m-auto table-compact table-zebra">
          <thead>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </thead>
          <tbody>
            {#await $productsRequest}
              <button class="btn btn-circle loading btn-disabled" />
            {:then _}
              {#if $products != null}
                {#if $products.length <= 0}
                  <tr>
                    <td colspan="3">No hay producto</td>
                  </tr>
                {/if}
                {#each $products as product, k}
                  <tr>
                    <td>
                      <a
                        href={product.hasImages()
                          ? product.images[0].getUrlImage()
                          : IMAGE_404}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <img
                          src={product.hasImages()
                            ? product.images[0].getUrlImage()
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
          <h3>{$productOnForm.id == null ? "Add" : "Update"} Producto</h3>

          <div class="modal-action">
            {#await $productOnFormRequest}
              <button class="btn loading btn-disabled">Cargando...</button>
            {:then _}
              {#if $productOnForm?.id == null}
                <button
                  on:click={() => {
                    productVM.onSubmitAdd($files);
                    files = writable([]);
                  }}
                  class="btn btn-success">Agregar</button
                >
              {:else}
                <button
                  on:click={() => {
                    productVM.onConfirmEdit($files);
                    files = writable([]);
                  }}
                  class="btn btn-info">Editar</button
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
                <span class="label-text">Nombre</span>
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
                <span class="label-text">Precio</span>
              </label>
              <input
                type="number"
                bind:value={$productOnForm.price}
                id="price"
                class="input input-bordered"
              />
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">En pagina de inicio</span>
                <input
                  type="checkbox"
                  class="toggle toggle-info"
                  checked={$productOnForm.onHomeScreen != null}
                  on:change={() => {
                    if ($productOnForm.onHomeScreen != null) {
                      $productOnForm.onHomeScreen = null;
                    } else {
                      $productOnForm.onHomeScreen = new Date();
                    }
                  }}
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label" for="image">
                <span class="label-text">Image</span>
              </label>
              <div class="flex justify-center">
                <div style="width: 300px; height: 200px;">
                  <MultipleImageInput
                    initials_path={ProductImage.IMG_URL}
                    initials={$productOnForm.hasImages()
                      ? $productOnForm.images.map((pi) => pi.id + "")
                      : []}
                    {uploadImageReq}
                    {deleteImageReq}
                    allFiles={files}
                    onDelete={(idImage) => {
                      productVM.onDeleteImage(idImage);
                    }}
                  />
                </div>
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
