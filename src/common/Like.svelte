<script lang="ts">
  import LikesServiceFactory from "./LikesService";

  export let id: number = 0;
  export let type: string;
  export let amount: number;

  const likes = LikesServiceFactory.getInstance(type);

  let active: boolean = likes.isLiked(id);

  function swap(): void {
    if (active) {
      active = !likes.delete(id);
      amount--;
    } else {
      active = likes.add(id);
      amount++;
    }
  }
</script>

<div
  class="absolute left-3 top-3 w-fit"
  on:click={() => {
    swap();
  }}
>
  <div class="swap {active ? 'swap-active' : ''} ">
    <!-- fill -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      class="swap-on fill-current"
      viewBox="0 0 16 16"
    >
      <path
        d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"
      />
    </svg>

    <!-- emply -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      class="swap-off fill-current"
      viewBox="0 0 16 16"
    >
      <path
        d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"
      />
    </svg>

    <span class="relative m-auto font-bold text-base">
      {amount}
    </span>
  </div>
</div>

<style>
  .swap-on {
    color: red;
  }

  .swap-off {
    color: white;
  }
</style>
