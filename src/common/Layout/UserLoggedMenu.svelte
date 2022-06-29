<script lang="ts">
  import AuthViewModel from "../../auth/04_viewModel/auth/AuthViewModel";
  import type IAuthViewModel from "../../auth/04_viewModel/auth/IAuthViewModel";

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  let session = authMV.getSession();
</script>

{#if $session == null}
  <a class="btn btn-ghost" href="#/login">Sing in</a>
{:else}
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle avatar" for="user-menu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
          fill-rule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
      </svg>
    </label>
    <ul
      id="user-menu"
      tabindex="0"
      class="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-300 text-base-content"
    >
      <!--
        <li>
          <span class="justify-between">
            Profile
            <span class="badge">New</span>
          </span>
        </li>
        -->
      <li><a href="#/user-info">User info</a></li>
      <li><a href="#/login" on:click={() => authMV.logout()}>Log out</a></li>
    </ul>
  </div>
{/if}
