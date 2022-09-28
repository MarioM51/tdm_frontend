<script lang="ts">
  import { Readable, writable } from "svelte/store";
  import ButtonAsyncAction from "../common/ButtonAsyncAction.svelte";
  import CommentModel from "./CommentModel";

  interface FnSubmit<E> {
    (resp: E): void;
  }

  export let onSubmit: FnSubmit<CommentModel>;
  export let req: Readable<Promise<any>>;

  let comment = writable(new CommentModel());
  let errorMsg: string = ``;

  function submit(): void {
    errorMsg = $comment.validateInForm();
    if (errorMsg != ``) {
      return;
    }
    $comment.created_at = new Date();
    $comment.stars = 0;
    onSubmit($comment);
    comment.set(new CommentModel());
  }
  function calcel(): void {
    comment.update((c) => {
      c.content = "";
      c.stars = 1;
      return c;
    });
  }
</script>

<div class="flex flex-col mb-8">
  <div class="form-control">
    <textarea
      bind:value={$comment.content}
      maxlength={CommentModel.MAX_LENGTH}
      class="textarea textarea-bordered h-12 ml-4"
      placeholder="Write a new comment"
    />
    {#if errorMsg != ``}
      <div class="label">
        <span class="label-text-alt" />
        <span class="label-text-alt">{errorMsg}</span>
      </div>
    {/if}
  </div>
  <div class="flex justify-center sm:justify-end mt-1">
    <button class="btn btn-xs btn-error" on:click={calcel}>Borrar</button>
    <button class="" on:click={submit} />

    <ButtonAsyncAction
      label="Responder"
      clases="btn btn-xs btn-success ml-2"
      onAct={submit}
      obs={req}
    />
  </div>
</div>
