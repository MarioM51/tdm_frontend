<script lang="ts">
  import type ProductImage from "src/product/01_model/ProductImage";

  import Carousel from "svelte-carousel";
  import { to_number } from "svelte/internal";
  import { Writable, Readable, writable, get } from "svelte/store";
  import ButtonAsyncAction from "./ButtonAsyncAction.svelte";
  import WideRatio from "./WideRatio.svelte";

  interface OnActFunc {
    (idImage: number): void;
  }

  export let uploadImageReq: Readable<Promise<any>>;
  export let deleteImageReq: Readable<Promise<ProductImage>>;

  export let allFiles: Writable<FileList[]>;
  export let initials: string[] = [];
  export let initials_path: string;
  export let onDelete: OnActFunc;

  let currentIdImage: number = 0;
  let currentIndex: number = 0;

  let images: any[] = [];
  for (let i = 0; i < initials.length; i++) {
    images.push(initials_path + "/" + initials[i]);
  }

  const reload = writable(true);
  const showDelete = writable(false);

  let files: FileList;

  function previewImage() {
    const fileReader = new FileReader();
    if (files[0] != undefined) {
      $allFiles.push(files);
      fileReader.readAsDataURL(files[0]);
      fileReader.addEventListener("load", function () {
        images.unshift(this.result);
        reload.set(false);
        setTimeout(() => {
          reload.set(true);
        }, 100);
      });
    }
  }

  function onChangeimage(event: any) {
    currentIndex = event.detail;
    if (images[currentIndex] == null) {
      showDelete.set(false);
      return;
    }
    const isLocal = images[currentIndex].startsWith("data:image");
    showDelete.set(true);
    if (!isLocal) {
      let idString = images[event.detail].slice(
        images[currentIndex].lastIndexOf("/") + 1,
        images[currentIndex].length
      );
      let idNumber = parseInt(idString);
      currentIdImage = idNumber;
    }
  }

  function deleteImage(): void {
    const isLocal = images[currentIndex].startsWith("data:image");
    if(isLocal) {
      removeCurrentImage();
    } else {
      onDelete(currentIdImage);
    }
  }
  deleteImageReq.subscribe((delReq) => {
    if (delReq != null) {
      delReq.then((img) => {
        if (currentIdImage == img.id_image) {
          removeCurrentImage()
        }
      });
    }
  });

  function removeCurrentImage() {
    images = images.filter((i) => i != images[currentIndex]);
    reload.set(false);
    setTimeout(() => {
      reload.set(true);
    }, 100);
  }
</script>

<div>
  <div class="file_container">
    <div class="file_button-wrap flex">
      {#if $showDelete}
        <ButtonAsyncAction
          obs={deleteImageReq}
          letShowError={false}
          label="Delete"
          onAct={() => deleteImage()}
          clases="btn btn-error"
        />
      {/if}

      <div>
        <label
          class="file_button rounded-r-none btn btn-primary"
          for="image"
          class:loading={$uploadImageReq != null}
          class:btn-disabled={$uploadImageReq != null}
        >
          Add
        </label>
        <input
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          bind:files
          on:change={previewImage}
        />
      </div>
    </div>
  </div>

  {#if $reload}
    <Carousel
      let:showPrevPage
      let:showNextPage
      on:pageChange={(evt) => onChangeimage(evt)}
    >
      <div slot="prev" class="gallery-btn-ontainer" style="left: 5px;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          class="btn-sm btn-circle cursor-pointer bg-neutral-content fill-neutral-focus"
          on:click={showPrevPage}
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
          />
        </svg>
      </div>

      {#if images.length > 0}
        {#each images as src}
          <img {src} alt="nature" style="height: 100%; width: 100%;" />
        {/each}
      {:else}
        <WideRatio msg="No image" />
      {/if}

      <div slot="next" class="gallery-btn-ontainer" style="right: 5px;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          on:click={showNextPage}
          width="32"
          height="32"
          class="btn-sm btn-circle cursor-pointer bg-neutral-content fill-neutral-focus"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
          />
        </svg>
      </div>
    </Carousel>
  {/if}
</div>

<style>
  .gallery-btn-ontainer {
    @apply grid content-center z-10 absolute h-full;
  }

  .file_container {
    position: relative;
    z-index: 20;
  }

  input[type="file"] {
    position: absolute;
    z-index: -1;
    top: 10px;
    left: 8px;
    display: none;
  }

  .file_button-wrap {
    position: absolute;
    z-index: 10;
    top: 10px;
    right: 10px;
  }

  .file_button {
    cursor: pointer;
    border-radius: 5px;
    font-size: 13px;
    font-weight: bold;
  }
</style>
