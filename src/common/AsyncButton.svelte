<script lang="ts">
  import type { AsyncAction } from "./types/FuncTypes";

  export let label: string;
  export let onClick: AsyncAction;
  export let className: string = "";

  let req: Promise<any>;

  function action() {
    req = onClick();
    req.catch((_) => {
      req = null;
    });
  }
</script>

<div>
  {#await req}
    <button class={className} disabled>{label}</button>
  {:then _}
    <button class={className} on:click={action}>{label}</button>
  {/await}
</div>
