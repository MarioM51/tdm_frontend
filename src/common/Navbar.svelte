<script lang="ts">
  import ShoppingCar from "../shopping_car/ShoppingCarIcon.svelte";
</script>

<div class="navbar bg-neutral text-neutral-content">
  <label tabindex="0" for="my-drawer" class="btn btn-ghost btn-circle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h7"
      /></svg
    >
  </label>

  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">daisyUI</a>
  </div>
  <div class="flex-none">
    <ShoppingCar />
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img
            src="https://cdn.lorem.space/images/face/.cache/500x0/behrouz-sasani-khMxnuosSV4-unsplash.jpg"
          />
        </div>
      </label>
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-300 text-base-content"
      >
        <li>
          <a class="justify-between">
            Profile
            <span class="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
