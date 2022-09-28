<script lang="ts">
  import LoadingSpiner from "../common/LoadingSpiner.svelte";

  import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
  import ButtonAsyncActionOnCollection from "../common/ButtonAsyncActionOnCollection.svelte";
  import CommentForm from "./CommentForm.svelte";
  import ResponseForm from "./ResponseForm.svelte";
  import type CommentModel from "./CommentModel";
  import CommentsClientViewModel from "./CommentsClientViewModel";
  import type ICommentService from "./ICommentService";

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

  function removeComment(c: CommentModel): void {
    commentVM.remove(c);
  }
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
    {#each $allComments as c, numComm (c.id)}
      <article class="bg-base-200 mb-4 p-4">
        <div class="flex justify-between m-2">
          <div>
            {"User " + c.idUser}
          </div>
          <div class="flex">
            <div class="rating">
              {#if c.stars != 0}
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
              {/if}
            </div>
            <div id="comment-actions" style="max-width: 90px;">
              {#if $session?.id == c.idUser || $session?.hasRols(["admin"])}
                <ButtonAsyncActionOnCollection
                  label="Eliminar"
                  clases="btn btn-xs btn-error"
                  onAct={() => {
                    removeComment(c);
                  }}
                  observers={delReqs}
                  indexItem={numComm}
                />
              {/if}
            </div>
          </div>
        </div>
        <p class="p-1">{c.content}</p>
        {#each c.responses as response}
          <article id="comment-response" class="relative bg-base-300 mb-4 ml-8">
            <div class="flex justify-between m-2">
              <div>
                {"User " + response.idUser}
              </div>
              <div style="max-width: 90px;">
                {#if $session?.id == response.idUser || $session?.hasRols( ["admin"] )}
                  <ButtonAsyncActionOnCollection
                    label="Eliminar"
                    clases="btn btn-xs btn-error"
                    onAct={() => {
                      removeComment(response);
                    }}
                    observers={delReqs}
                    indexItem={numComm}
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
            newComment.responseTo = parseInt(c.id + "");
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
