<script lang="ts">
  import AuthViewModel from "../../04_viewModel/auth/AuthViewModel";
  import type IAuthViewModel from "../../04_viewModel/auth/IAuthViewModel";

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  let session = authMV.getSession();
</script>

<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
  <div class="flex-1 px-2 mx-2">
    <span class="text-lg font-bold">USER ADMIN</span>
  </div>
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
  <div class="flex-none">
    <button class="btn btn-square btn-ghost">
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
    </button>
  </div>
</div>
