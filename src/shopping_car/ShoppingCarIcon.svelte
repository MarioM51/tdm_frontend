<script lang="ts">
  import { writable } from "svelte/store";
  import ShoppingCarVM from "./ShoppingCarVM";

  const shoppingCar = ShoppingCarVM.getInstance();
  shoppingCar.onInit();

  //const products = shoppingCar.getProducts();
  const bill = shoppingCar.getBill();
  const isOpen = writable(false);
  let closeSC = false;
</script>

<div
  class="dropdown dropdown-end"
  class:dropdown-open={$isOpen}
  on:mouseenter={() => {
    closeSC = false;
  }}
  on:mouseleave={() => {
    closeSC = true;
    setTimeout(() => {
      if (closeSC) {
        isOpen.set(false);
      }
    }, 200);
  }}
>
  <div
    class="btn btn-ghost btn-circle"
    on:click={() => {
      isOpen.set(!$isOpen);
    }}
  >
    <div class="indicator">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style="height: 32px; width:32px"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        /></svg
      >
      {#if $bill.lines.length > 0}
        <span class="indicator-item badge badge-primary px-1"
          >{$bill.amountProducts}</span
        >
      {/if}
    </div>
  </div>

  <div
    class="!fixed sm:!absolute w-full sm:w-[420px] z-10 pt-1 card card-compact dropdown-content shadow bg-base-200 text-base-content shadow-xl pt-8"
    on:click={() => {
      console.log("gano click");
    }}
  >
    <div class="card-body">
      <div class="text-center">
        {#if $bill.lines.length > 0}
          <div class="overflow-x-auto max-h-[256px]">
            <table class="table table-zebra w-full table-compact">
              <thead>
                <th class="bg-neutral text-neutral-content">Name</th>
                <th class="bg-neutral text-neutral-content">Add Up</th>
                <th class="bg-neutral" />
              </thead>
              <tbody>
                {#each $bill.lines as l}
                  <tr>
                    <td>{l.name} ( ${l.unitaryPrice} X {l.amount} )</td>
                    <td>${l.total}</td>
                    <td>
                      <button
                        class="btn btn-circle btn-error btn-sm"
                        on:click={() => {
                          shoppingCar.removeProduct(l);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-dash"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"
                          />
                        </svg>
                      </button>

                      <button
                        class="btn btn-circle btn-success btn-sm"
                        on:click={() => {
                          shoppingCar.addProduct(l);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-plus-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="flex justify-between pt-4">
            <div class="text-right">
              <p class="font-bold text-lg">Total</p>
              <p class="font-bold text-2xl">${$bill.total}.00</p>
            </div>
            <div class="card-actions justify-end mt-4">
              <button
                class="btn btn-primary"
                on:click={() => {
                  isOpen.set(false);
                  window.document.activeElement.blur();
                  shoppingCar.addToOrders();
                }}>Confirm</button
              >
            </div>
          </div>
        {:else}
          <p>Nothing over here</p>
        {/if}
        <span
          class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 bg-base-300"
          on:click={() => {
            isOpen.set(!$isOpen);
          }}>✕</span
        >
      </div>
    </div>
  </div>
</div>

<style>
  @import "http://192.168.1.81/static_003/tailwin.css"; ;
</style>
