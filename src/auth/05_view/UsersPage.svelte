<script lang="ts">
  import { onMount } from "svelte";
  import FaEdit from "svelte-icons/fa/FaEdit.svelte";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import type IUserViewModel from "../04_viewModel/users/IUserViewModel";
  import UserViewModel from "../04_viewModel/users/UserViewModel";

  const userVM: IUserViewModel = UserViewModel.getInstance();
  const usersRequest = userVM.requestUsers;
  const usersTable = userVM.usersTable;
  const errorMsg = userVM.errorMsg;
  const userToEdit = userVM.getUserToEdit();
  const editRequest = userVM.getUserRequestEdit();

  const userToDelete = userVM.getUserToDelete();
  const deleteRequest = userVM.getUserRequestDelete();

  const allRols = userVM.allRols;

  onMount(() => {
    userVM.onInit();
  });

  function edit(id: number): void {
    console.log("edit: " + 1);
  }

  function remove(id: number): void {
    console.log("remove: " + 1);
  }

  function check(): boolean {
    return true;
  }
</script>

<section>
  <h2 class="text-3xl">Users</h2>

  <div id="user-table-container" class="overflow-x-auto flex justify-center">
    {#await $usersRequest}
      Cargando...
    {:then _}
      {#if $usersTable != null}
        <table class="table w-full table-zebra max-w-lg ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rols</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each $usersTable as u, i (u.id)}
              <tr>
                <th>{i}</th>
                <td>{u.email}</td>
                <td>
                  {#each u.rols as r}
                    {r.name},&nbsp;&nbsp;
                  {/each}
                </td>
                <td class="flex justify-center">
                  <div class="icon" on:click={() => userVM.onClickEdit(i)}>
                    <FaEdit />
                  </div>
                  <div
                    class="icon icon-del"
                    on:click={() => userVM.onClickRemove(i)}
                  >
                    <FaRegTrashAlt />
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {/await}
    {#if $errorMsg != null}
      {$errorMsg}
    {/if}
  </div>

  {#if $userToEdit != null}
    <div class="modal modal-open">
      <div class="modal-box">
        <div class="form-control bg-base-200 p-4 pt-1">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <input
            bind:value={$userToEdit.email}
            type="text"
            placeholder="example@mail.com"
            class="input"
            id="email"
          />
        </div>

        <div class="form-control max-w-xs">
          {#each $allRols as rol}
            <label class="cursor-pointer label">
              <span class="label-text">{rol.name}</span>
              <input
                type="checkbox"
                checked={$userToEdit.rols.some(
                  (r) => r.name.toLowerCase() == rol.name.toLowerCase()
                )}
                on:click={() => {
                  userVM.switchRole(rol);
                }}
                class="checkbox checkbox-primary"
              />
            </label>
          {/each}
        </div>

        <div class="modal-action">
          {#await $editRequest}
            Loading...
          {:then editStatus}
            {#if editStatus == null}
              <button
                on:click={() => userVM.onSubmitEdit()}
                class="btn btn-primary">Accept</button
              >
            {/if}
          {/await}
          <button on:click={() => userVM.onClickEdit(-1)} class="btn"
            >Close</button
          >
        </div>
      </div>
    </div>
  {/if}

  {#if $userToDelete != null}
    <div class="modal modal-open">
      <div class="modal-box">
        Are you sure you want to delete de user {$userToDelete.email}?
        <div class="modal-action">
          {#await $deleteRequest}
            Loading...
          {:then deleteStatus}
            {#if deleteStatus == null}
              <button
                on:click={() => userVM.onConfirmRemove()}
                class="btn btn-error">Delete</button
              >
            {/if}
          {/await}
          <button on:click={() => userVM.onClickRemove(-1)} class="btn"
            >Close</button
          >
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  .icon {
    cursor: pointer;
    width: 22px;
    height: 22px;
    margin: 10px;
  }
  .icon:hover {
    color: rgb(85, 85, 248);
  }

  .icon-del:hover {
    color: rgb(248, 85, 85);
  }
</style>
