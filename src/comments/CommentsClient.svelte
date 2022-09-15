<script lang="ts">
  import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
  import ButtonAsyncActionOnCollection from "../common/ButtonAsyncActionOnCollection.svelte";
  import CommentForm from "./CommentForm.svelte";
  import type CommentModel from "./CommentModel";
  import CommentsClientViewModel from "./CommentsClientViewModel";
  import type ICommentService from "./ICommentService";

  export let idTarget: number;
  export let comments: CommentModel[];
  export let commentServ: ICommentService;

  const commentVM = new CommentsClientViewModel(comments, commentServ);
  const _authVM = AuthViewModel.getInstance();

  const allComments = commentVM.getAll();
  const allReq = commentVM.getAllReq();
  const addReq = commentVM.getAddReq();
  const delReqs = commentVM.getDeleteReq();
  const session = _authVM.getSession();

  function removeComment(c: CommentModel): void {
    commentVM.remove(c);
  }
</script>

<div>
  <h2>Comments</h2>
  <CommentForm
    onSubmit={(newComment) => {
      newComment.idTarget = parseInt(idTarget + "");
      commentVM.add(newComment);
    }}
    req={addReq}
  />

  {#await $allReq}
    Loading Comments
  {/await}

  <section class="p-2">
    {#each $allComments as c, numComm (c.id)}
      <article class="relative bg-base-200 mb-4">
        <h3 class="mb-2">{$allComments.length - numComm}</h3>
        <p class="p-1">{c.content}</p>
        <div class="rating absolute right-1 top-1">
          {#if $session?.id == c.idUser}
            <div style="max-width: 90px;">
              <ButtonAsyncActionOnCollection
                label="Remove"
                clases="btn btn-sm btn-error"
                onAct={() => {
                  console.log("delReqs1", $delReqs);
                  removeComment(c);
                  console.log("delReqs2", $delReqs);
                }}
                observers={delReqs}
                indexItem={numComm}
              />
            </div>
          {/if}
          {#each [1, 2, 3, 4, 5] as i (i + "_ran")}
            <input
              disabled
              type="radio"
              name="rating-blog-{c.id}"
              value={i}
              class="mask mask-star-2 bg-orange-400 cursor-default"
              checked={i <= c.stars}
            />
          {/each}
        </div>
      </article>
    {/each}
  </section>
</div>
