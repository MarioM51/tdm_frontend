<script lang="ts">
  import Router from "svelte-spa-router";
  import TopBar from "./layout/TopBar.svelte";
  import routes from "./routes";
</script>

<main>
  <TopBar />
  <Router {routes} />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .icon {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
</style>
