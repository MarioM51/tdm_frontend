<script lang="ts">
  import ErrorModel from "../error/ErrorModel";
  import type { AsyncAction } from "./types/FuncTypes";

  export let label: string;
  export let onClick: AsyncAction;
  export let className: string = "";

  let req: Promise<any>;
  let errmsg: string = null;

  function action() {
    errmsg = null;
    req = onClick();
    req
      .catch((error) => {
        errmsg = ErrorModel.getMessageError(error);
      })
      .finally(() => {
        req = null;
      });
  }
</script>

<div>
  {#await req}
    <button class={className + " loading"} disabled>{label}</button>
  {:then _}
    <div>
      <button class={className} on:click={action}>{label}</button>
      <div
        class="modal modal-bottom sm:modal-middle"
        class:modal-open={errmsg != null}
      >
        <div class="modal-box">
          <h3 class="font-bold text-lg">Error</h3>
          <p class="py-4">
            {errmsg}
          </p>
          <div class="modal-action">
            <button
              class="btn"
              on:click={() => {
                errmsg = null;
              }}>Ok</button
            >
          </div>
        </div>
      </div>
    </div>
  {/await}
</div>

<style>
</style>
