<script lang="ts">
  import LoadingSpiner from "../common/LoadingSpiner.svelte";
  import ButtonAsyncAction from "../common/ButtonAsyncAction.svelte";

  import OrdersViewModel from "./OrdersClientViewModel";

  const orderVM = OrdersViewModel.getInstance();
  orderVM.onInit();

  //observers
  const orders = orderVM.getOrders();
  const reqAdd = orderVM.getReqAdd();
  const reqAll = orderVM.getReqAll();
  const errormsg = orderVM.getErrorMessage();
</script>

<div>
  <h1 class="text-2xl font-bold underline">Orders</h1>
  {#await $reqAll}
    <center><LoadingSpiner />Fetching orders...</center>
  {/await}
  {#await $reqAdd}
    <center><LoadingSpiner /> Adding...</center>
  {/await}
  {#if $errormsg != null}
    <center>{$errormsg}</center>
  {/if}

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
          <table class="table w-full table-compact mb-2">
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
            <div class="flex justify-end w-52">
              {#if order.confirmed_at == null}
                <ButtonAsyncAction
                  obs={order.confirmPromise}
                  label="Confirm"
                  onAct={() => orderVM.confirm(order.id)}
                  clases="btn btn-success mr-3"
                />
              {/if}

              {#if order.accepted_at == null}
                <ButtonAsyncAction
                  obs={order.deletePromise}
                  label="Cancel"
                  onAct={() => orderVM.delete(order.id)}
                  clases="btn btn-error"
                />
              {/if}
            </div>
          </div>
          {#if order.confirmed_at != null && order.accepted_at == null}
            <p class="text-primary-content text-center">
              Waiting to be accepted
            </p>
          {/if}

          {#if order.accepted_at != null}
            <p class="text-primary-content text-center">Order Accepted</p>
          {/if}
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
