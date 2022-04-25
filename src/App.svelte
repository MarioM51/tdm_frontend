<script lang="ts">
  import Router from "svelte-spa-router";
  import AuthViewModel from "./auth/04_viewModel/auth/AuthViewModel";
  import type IAuthViewModel from "./auth/04_viewModel/auth/IAuthViewModel";
  import routes from "./routes";

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  let session = authMV.getSession();
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
          <span class="text-lg font-bold">USER ADMIN</span>
        </div>

        <!-- Top menu in top bar -->
        <div class="flex-none hidden px-2 mx-2 sm:flex">
          <div class="flex items-stretch">
            {#if $session != null}
              {#if $session.hasRols(["admin"])}
                <a class="btn btn-ghost btn-sm" href="#/users">Users</a>
              {/if}

              {#if $session.hasRols(["admin", "products"])}
                <a class="btn btn-ghost btn-sm" href="#/products">Products</a>
              {/if}

              {#if $session.hasRols(["admin", "blogs"])}
                <a class="btn btn-ghost btn-sm" href="#/blogs">Blogs</a>
              {/if}

              <a
                class="btn btn-ghost btn-sm"
                on:click={() => {
                  authMV.logout();
                }}
                href="#/">Logout</a
              >
            {:else}
              <a class="btn btn-ghost btn-sm" href="#/auth">Auth</a>
            {/if}
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
        {#if $session != null}
          {#if $session.hasRols(["admin"])}
            <li><a href="#/users">Users</a></li>
          {/if}

          {#if $session.hasRols(["admin", "products"])}
            <li>
              <a href="#/products">Products</a>
            </li>
          {/if}

          {#if $session.hasRols(["admin", "blogs"])}
            <li><a href="#/blogs">Blogs</a></li>
          {/if}

          <li>
            <a
              on:click={() => {
                authMV.logout();
              }}
              href="#/">Logout</a
            >
          </li>
        {:else}
          <li><a href="#/auth">Auth</a></li>
        {/if}
      </ul>
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
