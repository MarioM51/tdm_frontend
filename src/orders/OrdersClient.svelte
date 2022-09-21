<script lang="ts">
  import LoadingSpiner from "../common/LoadingSpiner.svelte";
  import ButtonAsyncAction from "../common/ButtonAsyncAction.svelte";

  import OrdersViewModel from "./OrdersClientViewModel";
  import InfoPayment from "./InfoPayment";

  const orderVM = OrdersViewModel.getInstance();
  orderVM.onInit();

  //observers
  const orders = orderVM.getOrders();
  const errormsg = orderVM.getErrorMessage();

  const reqAdd = orderVM.getReqAdd();
  const reqAll = orderVM.getReqAll();
  const reqPayment = orderVM.getReqAll();
</script>

<div>
  <h1 class="text-2xl font-bold underline">Ordenes</h1>
  {#await $reqAll}
    <center><LoadingSpiner />Buscando ordenes realizadas...</center>
  {/await}
  {#await $reqAdd}
    <center><LoadingSpiner />Agregando orden...</center>
  {/await}
  {#if $errormsg != null}
    <center>{$errormsg}</center>
  {/if}

  {#if $orders.length <= 0}
    {#if $reqAdd == null}
      Aun ningun producto agregado
    {/if}
  {:else}
    {#each $orders as order}
      <div class="card overflow-x-auto bg-neutral mt-4">
        <div class="card-body">
          <h2 class="card-title text-white">
            Orden ID: {order.id}
          </h2>
          <table class="table w-full table-compact mb-2">
            <thead>
              <th>Name</th>
              <th>Agregado</th>
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
              Esperando ser aceptada
            </p>
          {/if}

          {#if order.accepted_at != null}
            <div class="text-primary-content">
              <p class="text-center mb-8">Orden Aceptada</p>
              {#await $reqPayment}
                <center><LoadingSpiner />Obteniendo informacion de pago</center>
              {/await}
              <div class="payment-info">
                <p class="font-bold text-lg ">Informacion de pago</p>
                <p>Clabe: <span>{InfoPayment.CLABE}</span></p>
                <p>
                  Nombre del beneficiario: <span>{InfoPayment.OWNER}</span>
                </p>
                <p>Banco/Entidad: <span>{InfoPayment.BANK_NAME}</span></p>
                <p>Importe: <span>${order.totalSum()}.00</span></p>
                <p>Referencia: <span>{order.id}</span></p>
                <p>Concepto: <span>{InfoPayment.CONCEPT}</span></p>
              </div>
            </div>
          {/if}
        </div>
      </div>
      <hr />
    {/each}
  {/if}
</div>

<style>
  .payment-info p {
    margin-bottom: 0.5rem;
  }

  .payment-info p span {
    font-style: italic;
  }

  hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>
