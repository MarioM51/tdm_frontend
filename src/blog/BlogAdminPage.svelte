<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { BlogAdminViewModel } from "./BlogAdminViewModel";
  import Notification from "../common/Notification.svelte";

  const blodAdminMV = BlogAdminViewModel.getInstance();
  onMount(() => {
    blodAdminMV.onInit();
  });
  onDestroy(() => {
    blodAdminMV.hiddeMessage();
  });

  const blogsReq = blodAdminMV.getBlogsReq();
  const blogs = blodAdminMV.getBlogs();
  const msg = blodAdminMV.getMsg();
</script>

<section>
  <h1 class="text-2xl font-bold underline mb-8">Blogs</h1>

  <Notification
    {msg}
    onClose={() => {
      blodAdminMV.hiddeMessage();
    }}
  />

  {#if $blogsReq != null}
    <a class="btn btn-sm" href="#/blog-form/0">Agregar</a>
    <button
      class="btn btn-sm gap-2"
      on:click={() => {
        blodAdminMV.onInit();
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

    <div class="flex justify-center overflow-x-auto">
      {#await $blogsReq}
        Loading...
      {:then _}
        {#if $blogs != null}
          {#if $blogs.length > 0}
            <table class="table table-zebra w-full max-w-lg">
              <thead>
                <th class="w-[10px]">Id</th>
                <th class="w-[30px]">Thumbnail</th>
                <th>TiTle</th>
                <th>Edit</th>
              </thead>
              {#each $blogs as b}
                <tbody>
                  <td>{b.id}</td>
                  <td class="flex justify-center"
                    ><img
                      src={b.buildImgURL()}
                      width="50px"
                      height="25px"
                      onerror="if (this.src != 'favicon.ico') this.src = 'favicon.ico';"
                      alt="something"
                    /></td
                  >
                  <td>{b.title}</td>
                  <td
                    ><a class="btn btn-sm" href="#/blog-form/{b.id}">Edit</a
                    ></td
                  >
                </tbody>
              {/each}
            </table>
          {:else}
            No hay blogs
          {/if}
        {/if}
      {:catch _}
        Algo malo paso
      {/await}
    </div>
  {:else}
    <button class="btn">Cargar</button>
  {/if}
</section>
