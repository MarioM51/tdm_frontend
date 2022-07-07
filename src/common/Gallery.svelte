<script lang="ts">
  import Carousel from "svelte-carousel";
  import type { Writable } from "svelte/store";

  export let images: string[];
</script>

<!-- Put this part before </body> tag -->
<Carousel
  class="carousel w-full cursor-pointer"
  let:loaded
  let:showPrevPage
  let:showNextPage
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

  {#each images as src, imageIndex}
    <div class="img-container max-h-screen">
      {#if loaded.includes(imageIndex)}
        <img
          {src}
          style="width:100%; max-height: 100vh;"
          loading="lazy"
          alt="nature"
        />
      {/if}
    </div>
  {/each}

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

<style>
  .gallery-btn-ontainer {
    @apply grid content-center z-10 absolute h-full;
  }
</style>
