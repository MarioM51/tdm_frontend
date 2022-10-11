<script lang="ts">
  import ShoppingCar from "../../shopping_car/ShoppingCarIcon.svelte";
  import UserLoggedMenu from "./UserLoggedMenu.svelte";

  export let navUrls: Array<any>;
</script>

<div class="navbar bg-neutral text-neutral-content z-40">
  <label tabindex="0" for="my-drawer" class="btn btn-ghost btn-circle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h7"
      /></svg
    >
  </label>

  <div class="flex-1">
    <a href="/" class="btn btn-ghost px-0 normal-case title-size"
      >Tienda de Mario</a
    >
  </div>
  <div class="flex-none">
    <span class="hidden sm:inline">
      {#each navUrls as nu}
        <a class="btn btn-ghost" href={nu.url}>{nu.label}</a>
      {/each}
    </span>
    <UserLoggedMenu />
    <ShoppingCar />
  </div>
</div>

<style>
  .title-size {
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
  }

  @media (min-width: 300px) {
    .title-size {
      font-size: 1.125rem; /* 18px */
      line-height: 1.75rem; /* 28px */
    }
  }
</style>
