<script lang="ts">
  import ButtonAsyncAction from "../common/ButtonAsyncAction.svelte";
  import OrdersAdminViewModel from "./OrdersAdminViewModel";

  const orderVM = OrdersAdminViewModel.getInstance();
  orderVM.findAllOrders();

  //observers
  const all = orderVM.getAll();
  const allReq = orderVM.getAllReq();
</script>

<div>
  <h1 class="text-2xl font-bold underline">Orders</h1>
  {#await $allReq}
    <center>Fetching orders...</center>
  {/await}

  {#if $all.length <= 0}
    There is no orders yet
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full mb-2">
        <thead>
          <th>Id</th>
          <th>Client</th>
          <th>Details</th>
          <th>Total</th>
          <th style="width: 150px;">Actions</th>
        </thead>
        <tbody>
          {#each $all as order}
            <tr style="border-bottom: 2px solid black;">
              <td>{order.id}</td>
              <td>{order.idUser}</td>
              <td>
                <table
                  id="details"
                  class="table table-compact w-full bg-neutral-content"
                >
                  <thead>
                    <th>Name</th>
                    <th>Add Up</th>
                  </thead>
                  <tbody>
                    {#each order.products as l}
                      <tr>
                        <td>{l.name} ( ${l.unitaryPrice} X {l.amount} )</td>
                        <td>${l.total}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </td>
              <td>${order.totalSum()}</td>
              <td class="flex flex-col" style="width: 150px;">
                {#if order.confirmed_at != null}
                  {#if order.accepted_at != null}
                    <button class="btn btn-disabled bg-base-200 mb-4"
                      >Accepted</button
                    >
                  {:else}
                    <ButtonAsyncAction
                      obs={order.acceptPromise}
                      label="Accept"
                      onAct={() => orderVM.accept(order.id)}
                      clases="btn btn-success w-full mb-4"
                    />
                  {/if}

                  {#if order.confirmed_at == null}
                    <ButtonAsyncAction
                      obs={order.deletePromise}
                      label="Reject"
                      onAct={() => orderVM.reject(order.id)}
                      clases="btn btn-error"
                    />
                  {/if}

                  {#if order.confirmed_at != null}
                    <ButtonAsyncAction
                      obs={order.deletePromise}
                      label="Delete"
                      onAct={() => orderVM.delete(order.id)}
                      clases="btn btn-error"
                    />
                  {/if}
                {:else}
                  No confirmed
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  #details th,
  #details td {
    @apply bg-neutral-content text-neutral-focus;
  }
</style>
