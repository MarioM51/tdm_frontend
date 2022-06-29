<script type="ts">
  import type { Writable } from "svelte/store";

  export let isOpen: Writable<boolean>;
  export let navUrls: Array<any>;

  function switchMenu() {
    console.log("aa");
    isOpen.set(!$isOpen);
  }
</script>

<div class="drawer-side">
  <label for="my-drawer" class="drawer-overlay" />
  <ul
    class="menu p-4 overflow-y-auto w-11/12 sm:w-80 bg-neutral text-neutral-content"
  >
    <!-- Sidebar content here -->
    <li>
      <div class="flex justify-end" on:click={() => switchMenu()}>
        <svg
          class="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
          ><polygon
            points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
          /></svg
        >
      </div>
    </li>
    {#each navUrls as nu}
      <li>
        <a href={nu.url} on:click={() => switchMenu()}>{nu.label}</a>
      </li>
    {/each}
  </ul>
</div>
