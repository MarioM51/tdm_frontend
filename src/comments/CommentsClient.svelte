<script lang="ts">
  import LoadingSpiner from "../common/LoadingSpiner.svelte";

  import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
  import CommentForm from "./CommentForm.svelte";
  import ResponseForm from "./ResponseForm.svelte";
  import type CommentModel from "./CommentModel";
  import CommentsClientViewModel from "./CommentsClientViewModel";
  import type ICommentService from "./ICommentService";
  import AsyncButton from "../common/AsyncButton.svelte";

  export let idTarget: number;
  export let comments: CommentModel[];
  export let commentServ: ICommentService;

  const _authVM = AuthViewModel.getInstance();
  const session = _authVM.getSession();

  const commentVM = new CommentsClientViewModel(comments, commentServ);
  const allComments = commentVM.getAll();
  const allReq = commentVM.getAllReq();
  const addReq = commentVM.getAddReq();
  const delReqs = commentVM.getDeleteReq();
</script>

<div>
  <h2>Comentarios</h2>
  <CommentForm
    onSubmit={(newComment, cleanForm) => {
      newComment.idTarget = parseInt(idTarget + "");
      commentVM.add(newComment).then(() => {
        cleanForm();
      });
    }}
    errorMsg={commentVM._errorMsg}
    req={addReq}
  />

  {#await $allReq}
    <div class="flex justify-center">
      <LoadingSpiner /> Cargando comentarios...
    </div>
  {/await}

  <section class="p-2">
    {#each $allComments as comment (comment.id)}
      <article class="bg-base-200 mb-4 p-4">
        <div class="flex justify-between m-2">
          <div>
            {"User " + comment.idUser}
          </div>
          <div class="flex">
            <div class="rating">
              {#if comment.stars != 0}
                {#each [1, 2, 3, 4, 5] as i (i + "_ran")}
                  <input
                    disabled
                    type="radio"
                    name="rating-blog-{comment.id}"
                    value={i}
                    class="mask mask-star-2 bg-orange-400 cursor-default"
                    checked={i <= comment.stars}
                  />
                {/each}
              {/if}
            </div>
            <div id="comment-actions" style="max-width: 90px;">
              {#if $session?.id == comment.idUser || $session?.hasRols( ["admin"] )}
                <AsyncButton
                  label="Eliminar"
                  className="btn btn-xs btn-error"
                  onClick={() => {
                    return commentVM.remove(comment);
                  }}
                />
              {/if}
            </div>
          </div>
        </div>
        <p class="p-1">{comment.content}</p>
        {#each comment.responses as response}
          <article id="comment-response" class="relative bg-base-300 mb-4 ml-8">
            <div class="flex justify-between m-2">
              <div>
                {"User " + response.idUser}
              </div>
              <div style="max-width: 90px;">
                {#if $session?.id == response.idUser || $session?.hasRols( ["admin"] )}
                  <AsyncButton
                    label="Eliminar"
                    className="btn btn-xs btn-error"
                    onClick={() => {
                      return commentVM.remove(response);
                    }}
                  />
                {/if}
              </div>
            </div>
            <p class="p-1">{response.content}</p>
          </article>
        {/each}
        <ResponseForm
          onSubmit={(newComment) => {
            newComment.idTarget = parseInt(idTarget + "");
            newComment.responseTo = parseInt(comment.id + "");
            commentVM.addResponse(newComment);
          }}
          req={addReq}
        />
      </article>
    {/each}
  </section>
</div>

<style>
  @import "http://192.168.1.81/static_003/tailwin.css";
</style>
