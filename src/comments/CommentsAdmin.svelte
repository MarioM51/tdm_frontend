<script lang="ts">
  import LoadingSpiner from "../common/LoadingSpiner.svelte";

  import CommentsAdminViewModel, {
    CommentType,
  } from "./CommentsAdminViewModel";
  import AsyncButton from "../common/AsyncButton.svelte";

  const commentsAVM = new CommentsAdminViewModel();
  commentsAVM.onInit();

  const productComments = commentsAVM.getCommentsOnTable();
  const productCommentsReq = commentsAVM.getTableReq();
  const commentTypeShowing = commentsAVM.commentTypeShowing;
  const errorMsg = commentsAVM.getErrorMessage();
</script>

<div>
  <h1 class="text-2xl font-bold underline mb-8">Comments</h1>
  <div class="tabs flex justify-center">
    <span
      class="tab tab-bordered"
      class:tab-active={$commentTypeShowing == CommentType.PRODUCT}
      on:click={() => {
        commentsAVM.getAllProductComments();
      }}>Products</span
    >
    <span
      class="tab tab-bordered"
      class:tab-active={$commentTypeShowing == CommentType.BLOG}
      on:click={() => {
        commentsAVM.getAllBlogComments();
      }}>Blogs</span
    >
  </div>

  <div>
    <AsyncButton
      className="btn btn-primary btn-sm"
      label="Recargar"
      onClick={() => {
        if ($commentTypeShowing == CommentType.PRODUCT) {
          commentsAVM.getAllProductComments();
        } else if ($commentTypeShowing == CommentType.BLOG) {
          commentsAVM.getAllBlogComments();
        }
        return $productCommentsReq;
      }}
    />

    {#if $errorMsg != null || $errorMsg != ""}
      {$errorMsg}
    {/if}

    {#await $productCommentsReq}
      <LoadingSpiner /> Cargando...
    {:then _}
      <div class="overflow-x-auto mt-8">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <th />
            <th>User</th>
            <th
              >{$commentTypeShowing == CommentType.BLOG
                ? "Blog"
                : "Product"}</th
            >
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
                      href="/{$commentTypeShowing == CommentType.BLOG
                        ? 'blogs'
                        : 'products'}/temp-{pc.idTarget}"
                      target="_blank"
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
</div>
