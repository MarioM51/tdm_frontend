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
  <div class="rating mb-1">
    Rating:
    {#key $comment.stars}
      {#each [1, 2, 3, 4, 5] as i}
        <input
          type="radio"
          name="rating-new-comment"
          value={i}
          class="mask mask-star-2 bg-orange-400"
          checked={i <= $comment.stars}
          on:click={() => {
            $comment.stars = i;
          }}
        />
      {/each}
    {/key}
  </div>
  <div class="form-control">
    <textarea
      bind:value={$comment.content}
      maxlength={CommentModel.MAX_LENGTH}
      class="textarea textarea-bordered h-24"
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
    <button class="btn btn-error" on:click={calcel}>Cancel</button>
    <button class="" on:click={submit} />

    <ButtonAsyncAction
      label="Publish"
      clases="btn btn-success ml-2"
      onAct={submit}
      obs={req}
    />
  </div>
</div>
