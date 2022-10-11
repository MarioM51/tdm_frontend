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
</script>

<div>
  <h1 class="text-2xl font-bold">Pedidos</h1>
  {#await $reqAll}
    <center><LoadingSpiner />Buscando ordenes...</center>
  {/await}
  {#await $reqAdd}
    <center><LoadingSpiner />Guardando pedido...</center>
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
            Pedido ID: {order.id}
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
                  label="Iniciar pedido"
                  onAct={() => orderVM.confirm(order.id)}
                  clases="btn btn-success mr-3 leading-relaxed"
                />
              {/if}

              {#if order.accepted_at == null}
                <ButtonAsyncAction
                  obs={order.deletePromise}
                  label="Cancelar"
                  onAct={() => orderVM.delete(order.id)}
                  clases="btn btn-error"
                />
              {/if}
            </div>
          </div>
          {#if order.confirmed_at != null && order.accepted_at == null}
            <p class="text-primary-content text-center">
              Se revizara su pedido para ver si puede ser realizado.
            </p>
          {/if}

          {#if order.accepted_at != null}
            <div class="text-primary-content">
              <p class="text-center mb-8">Pedido Aceptada</p>
              {#await orderVM.getPaymnetInfo()}
                <center><LoadingSpiner />Obteniendo informacion de pago</center>
              {:then paymentInfo}
                <div class="payment-info">
                  <p class="font-bold text-lg ">Informacion de pago</p>
                  <p>Clabe: <span>{paymentInfo.Clabe}</span></p>
                  <p>
                    Nombre del beneficiario: <span>{paymentInfo.Owner}</span>
                  </p>
                  <p>Banco/Entidad: <span>{paymentInfo.BankName}</span></p>
                  <p>Importe: <span>${order.totalSum()}.00</span></p>
                  <p>Referencia: <span>{order.id}</span></p>
                  <p>Concepto: <span>{paymentInfo.Concept}</span></p>
                </div>
              {:catch err}
                <p class="text-error">{err}</p>
              {/await}
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
