<script lang="ts">
  import Carousel from "svelte-carousel";
  import { Writable, writable } from "svelte/store";

  export let allImages: string[] = [];
  let indedLoaded = 0;
  const loadedImages: string[] = [allImages[indedLoaded]];

  const reDraw = writable(true);

  let toRight = true;
  let btnDer;
  let btnIzq;

  function pushOther() {
    if (allImages.length - 1 > indedLoaded) {
      indedLoaded++;
      loadedImages.push(allImages[indedLoaded]);
      console.log("loadedImages", loadedImages);
      reDraw.set(false);
      setTimeout(() => {
        reDraw.set(true);
        setTimeout(() => {
          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: false,
          });

          if (toRight) {
            console.log("btnDer", btnDer);
            btnDer.dispatchEvent(clickEvent);
          } else {
            console.log("btnIzq", btnIzq);
            btnIzq.dispatchEvent(clickEvent);
          }
        }, 10);
      }, 10);
    }
  }
</script>

<!-- Put this part before </body> tag -->
{#if $reDraw}
  <Carousel let:showPrevPage let:showNextPage>
    <div slot="prev" class="gallery-btn-ontainer" style="left: 5px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        class="btn-sm btn-circle cursor-pointer bg-neutral-content fill-neutral-focus"
        on:click={() => {
          toRight = false;
          showPrevPage();
          pushOther();
        }}
        bind:this={btnIzq}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
        />
      </svg>
    </div>

    {#if allImages == null || allImages.length == 0}
      <img src="/favicon.ico" loading="lazy" alt="nature" />
    {:else}
      {#each loadedImages as src, imageIndex}
        <img {src} loading="lazy" alt="nature" />
      {/each}
    {/if}

    <div slot="next" class="gallery-btn-ontainer" style="right: 5px;">
      <svg
        bind:this={btnDer}
        xmlns="http://www.w3.org/2000/svg"
        on:click={() => {
          toRight = true;
          showNextPage();
          pushOther();
        }}
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
{:else}
  <div class="ratio_container">
    <div class="ratio_text" />
  </div>
{/if}

<style>
  .gallery-btn-ontainer {
    @apply grid content-center z-10 absolute h-full;
  }
  .ratio_container {
    background-color: lightgray;
    width: 100%;
    padding-top: 56.25%;
    position: relative; /* If you want text inside of it */
  }

  /* If you want text inside of the container */
  .ratio_text {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
