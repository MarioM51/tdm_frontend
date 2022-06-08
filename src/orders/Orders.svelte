<script lang="ts">
  import OrdersViewModel from "./OrdersViewModel";

  const orderVM = OrdersViewModel.getInstance();
  orderVM.fetchOrders();

  //observers
  const orders = orderVM.getOrders();
  const reqAdd = orderVM.getReqAdd();
  const reqAll = orderVM.getReqAll();
  const reqDel = orderVM.getReqDel();
</script>

<div>
  <h1 class="text-2xl font-bold underline">Orders</h1>
  {#await $reqAll}
    <center>Fetching orders...</center>
  {/await}
  {#await $reqAdd}
    <center>Adding...</center>
  {/await}
  {#await $reqDel}
    <center>Deleting...</center>
  {:then}
    {#if $reqDel != null}
      <center>Order Deleted</center>
    {/if}
  {:catch _}
    <center>Error deleting order</center>
  {/await}

  {#if $orders.length <= 0}
    {#if $reqAdd == null}
      Add a order whit the shoping car
    {/if}
  {:else}
    {#each $orders as order}
      <div class="card overflow-x-auto bg-neutral mt-4">
        <div class="card-body">
          <h2 class="card-title text-white">
            Order ID: {order.id}
          </h2>
          <table class="table w-full mb-2">
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
          <div class="flex justify-between card-actions">
            <div class="text-2xl text-white">
              Total: ${order.totalSum()}
            </div>
            <div>
              <button class="btn btn-success">Confirm</button>
              <button
                class="btn btn-error"
                on:click={() => {
                  orderVM.delete(order.id);
                }}>Cancel</button
              >
            </div>
          </div>
        </div>
      </div>
      <hr />
    {/each}
  {/if}
</div>

<style>
  @import "/static/tailwin.css";

  hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>
