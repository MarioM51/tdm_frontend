<script lang="ts">
  import type { AsyncAction } from "./types/FuncTypes";

  export let label: string;
  export let onClick: AsyncAction;

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
    Cargando...
  {:then _}
    <button on:click={action}>{label}</button>
  {/await}
</div>
