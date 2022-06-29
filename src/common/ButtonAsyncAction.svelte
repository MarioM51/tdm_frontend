<script lang="ts">
  import type { Readable } from "svelte/store";

  interface OnActFunc {
    (): void;
  }

  export let obs: Readable<Promise<any>>;
  export let label: string;
  export let clases: string;
  export let onAct: OnActFunc;

  let errorMsg: string = null;

  function showError(errorIn: any): string {
    errorMsg = errorIn.cause;
    return "";
  }
</script>

<div class="flex flex-col">
  {#await $obs}
    <button class={clases + " btn-disabled loading bg-base-200"}>{label}</button
    >
  {:then _}
    <button class={clases} on:click={() => onAct()}>{label}</button>
    {#if errorMsg != null}
      <span id="msg-error" class="text-primary-content">{@html errorMsg}</span>
    {/if}
  {:catch err}
    {showError(err) || ""}
  {/await}
</div>
