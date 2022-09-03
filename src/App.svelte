<script lang="ts">
  import Router from "svelte-spa-router";
  import AuthViewModel from "./auth/04_viewModel/auth/AuthViewModel";
  import type IAuthViewModel from "./auth/04_viewModel/auth/IAuthViewModel";
  import AppViewModel from "./AppViewModel";
  import { ConfirmationState } from "./AppViewModel";
  import routes from "./routes";
  import { get } from "svelte/store";
  import UrlInfo from "./common/UrlInfo";

  const appVM = AppViewModel.getInstance();
  const deleteConfirmation = appVM.getDeleteConfirmation();

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  let session = authMV.getSession();

  let urls: UrlInfo[] = UrlInfo.getAdminUrls(get(session), authMV);
  session.subscribe((s) => {
    urls = UrlInfo.getAdminUrls(get(session), authMV);
  });
</script>

<main>
  <!-- Hide-Left-Drawer-Menu -->
  <div class="h-screen drawer w-full rounded">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />

    <!-- Content page -->
    <div class="drawer-content">
      <!-- Top bar -->
      <div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
        <!--Top button to open the Hide-Left-Drawer-Menu -->
        <div class="flex sm:hidden">
          <label for="my-drawer" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-6 h-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        <!-- Top Title-logo Page -->
        <div class="flex-1 px-2 mx-2">
          <a href="/admin" class="text-lg font-bold">Tienda de Mario</a>
        </div>

        <!-- Top menu in top bar -->
        <div class="flex-none hidden px-2 mx-2 sm:flex">
          <div class="flex items-stretch">
            {#each urls as u}
              <a class="btn btn-ghost btn-sm" href={u.url} on:click={u.onClick}
                >{u.label}</a
              >
            {/each}
          </div>
        </div>
      </div>
      <!-- Content page -->
      <div class="p-4">
        <Router {routes} />
      </div>
    </div>

    <div class="drawer-side">
      <label for="my-drawer" class="drawer-overlay" />
      <ul
        class="menu p-4 overflow-y-auto w-4/5 sm:w-80 bg-base-100 text-base-content"
      >
        <!-- Sidebar content here -->
        {#each urls as u}
          <a
            class="btn btn-ghost btn-sm pt-3 pb-6"
            style="display: -webkit-box;"
            href={u.url}
            on:click={() => {
              u.onClick();
              document.getElementById("my-drawer").click();
            }}>{u.label}</a
          >
        {/each}
      </ul>
    </div>
  </div>

  <div
    class="modal modal-bottom sm:modal-middle"
    class:modal-open={$deleteConfirmation.state == ConfirmationState.WAITING}
  >
    <div class="modal-box">
      <button
        class="btn btn-sm btn-circle absolute right-2 top-2"
        on:click={() => {
          appVM.confirmModalDelete(false);
        }}>✕</button
      >
      <h3 class="font-bold text-lg">Eliminar</h3>
      <p class="py-4">
        {$deleteConfirmation.message}
      </p>
      <div class="modal-action">
        <button
          class="btn btn-error"
          on:click={() => {
            appVM.confirmModalDelete(true);
          }}>Delete</button
        >
        <button
          class="btn"
          on:click={() => {
            appVM.confirmModalDelete(false);
          }}>Cancel</button
        >
      </div>
    </div>
  </div>
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .icon {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }

  .btn.loading:before {
    animation: spin 1s linear infinite !important;
  }

  .ql-toolbar {
    width: 100%;
  }
</style>
