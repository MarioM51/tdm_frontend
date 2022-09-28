<script lang="ts">
  import LoadingSpiner from "../common/LoadingSpiner.svelte";
  import type { Readable } from "svelte/store";

  import CommentsAdminViewModel from "./CommentsAdminViewModel";
  import AsyncButton from "../common/AsyncButton.svelte";

  const commentsAVM = new CommentsAdminViewModel();
  commentsAVM.onInit();

  const isProductPanelVisible: Readable<boolean> =
    commentsAVM.getIsProductPanelVisible();
  const productComments = commentsAVM.getProductComments();
  const productCommentsReq = commentsAVM.getProductCommentsReq();

  const isBlogPanelVisible: Readable<boolean> =
    commentsAVM.getIsBlogPanelVisible();
</script>

<div>
  <h1 class="text-2xl font-bold underline mb-8">Comments</h1>
  <div class="tabs flex justify-center">
    <span
      class="tab tab-bordered"
      class:tab-active={$isProductPanelVisible}
      on:click={() => {
        commentsAVM.showProductPanel();
      }}>Products</span
    >
    <span
      class="tab tab-bordered"
      class:tab-active={$isBlogPanelVisible}
      on:click={() => {
        commentsAVM.showBlogPanel();
      }}>Blogs</span
    >
  </div>

  <div class:hidden={!$isProductPanelVisible}>
    <h2 class="text-1xl font-bold underline mb-2">Product Comments</h2>
    <AsyncButton
      className="btn btn-primary btn-sm"
      label="Recargar"
      onClick={() => {
        commentsAVM.getAllProductComments();
        return $productCommentsReq;
      }}
    />
    {#await $productCommentsReq}
      <LoadingSpiner /> Cargando...
    {:then _}
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <th>id</th>
            <th>User</th>
            <th>Product</th>
            <th>Stars</th>
            <th>Comment</th>
          </thead>
          <tbody>
            {#if $productComments.length < 0}
              <tr><td>Ningun comentario de producto encontrado</td></tr>
            {:else}
              {#each $productComments as pc (pc.id)}
                <tr>
                  <td>{pc.id}</td>
                  <td>{pc.idUser}</td>
                  <td>
                    <a
                      class="link link-accent"
                      href="/products/temp-{pc.idTarget}"
                    >
                      {pc.idTarget}
                    </a>
                  </td>
                  <td>{pc.stars}</td>
                  <td>{pc.content}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    {/await}
  </div>

  <div class:hidden={!$isBlogPanelVisible}>
    <h2 class="text-1xl font-bold underline mb-2">Blog Comments</h2>
  </div>
</div>
