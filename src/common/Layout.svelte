<script lang="ts">
  import Navbar from "./Navbar.svelte";
  import Footer from "./Footer.svelte";
  import { onMount } from "svelte";

  let drawerContent: HTMLElement;
  let navbar: HTMLElement;
  let isDrawerSideOpen: boolean = false;
  /*
  let prevScrollpos: number;

  onMount(() => {
    prevScrollpos = drawerContent.scrollTop;
    drawerContent.addEventListener("scroll", hideShowTopNavBar, {
      passive: true,
    });
  });

  const hideShowTopNavBar = (event) => {
    var currentScrollPos = drawerContent.scrollTop;
    if (prevScrollpos > currentScrollPos) {
      navbar.style.top = "0";
    } else {
      navbar.style.top = "-75px";
    }
    prevScrollpos = currentScrollPos;
  };
*/

  function switchDS() {}
</script>

<div class="drawer">
  <input
    id="my-drawer"
    type="checkbox"
    checked={isDrawerSideOpen}
    on:change={() => (isDrawerSideOpen = !isDrawerSideOpen)}
    class="drawer-toggle"
  />
  <div class="drawer-content" bind:this={drawerContent}>
    <div id="navbar" class="z-20" bind:this={navbar}>
      <Navbar />
    </div>
    <div class="page-container">
      <div id="layout-content-page">Default content</div>
    </div>
    <Footer />
  </div>
  <div class="drawer-side">
    <label for="my-drawer" class="drawer-overlay" />
    <ul
      class="menu p-4 overflow-y-auto w-11/12 sm:w-80 bg-neutral text-neutral-content"
    >
      <!-- Sidebar content here -->
      <li>
        <div
          class="flex justify-end"
          on:click={() => (isDrawerSideOpen = !isDrawerSideOpen)}
        >
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
            ><polygon
              points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
            /></svg
          >
        </div>
      </li>
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>

<style>
  @import "/static/tailwin.css";

  .page-container {
    padding: 2rem;
    padding-top: 5rem;
    max-width: 1250px;
    min-height: calc(100% - 226px);
  }

  .drawer {
    height: 100%;
  }

  .navbar {
    transition: top 0.3s; /* Transition effect when sliding down (and up) */
  }

  #navbar {
    background-color: #333;
    position: fixed;
    top: 0;
    width: 100%;
    transition: top 0.3s;
    max-width: var(--max-screen);
  }

  /* Style the navbar links */
  #navbar a {
    float: left;
    display: block;
    color: white;
    text-align: center;
    padding: 15px;
    text-decoration: none;
  }

  #navbar a:hover {
    background-color: #ddd;
    color: black;
  }
</style>
