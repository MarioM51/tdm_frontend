<script lang="ts">
  import Router from "svelte-spa-router";
  import TopNavbar from "./TopNavbar.svelte";
  import Footer from "./Footer.svelte";
  import { location } from "svelte-spa-router";
  import SideNavbar from "./SideNavbar.svelte";
  import routes from "./routes";
  import Constants from "../Constants";
  import AppViewModel from "../../AppViewModel";
  import { ConfirmationState } from "../../AppViewModel";
  import type { Writable } from "svelte/store";
  import { writable } from "svelte/store";

  const navUrls = [
    { label: "Products", url: "/products" },
    { label: "Blogs", url: "/blogs" },
    { label: "Orders", url: "#/orders" },
  ];

  for (let i = 0; i < navUrls.length; i++) {
    if (navUrls[i].url == window.location.pathname) {
      navUrls[i].url = "#/";
    }
  }

  let drawerContent: HTMLElement;
  let navbar: HTMLElement;
  let isDrawerSideOpen: Writable<boolean> = writable(false);

  const appVM = AppViewModel.getInstance();
  const deleteConfirmation = appVM.getDeleteConfirmation();

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

  let hideSSR: boolean = false;

  window.addEventListener(Constants.CSR_MODE, (e: any) => {
    console.log("detected:", e.detail);
    hideSSR = e.detail === true;
  });
</script>

<div class="drawer">
  <input
    id="my-drawer"
    type="checkbox"
    checked={$isDrawerSideOpen}
    on:change={() => {
      isDrawerSideOpen.set(!$isDrawerSideOpen);
    }}
    class="drawer-toggle"
  />
  <div class="drawer-content" bind:this={drawerContent}>
    <div id="navbar" class="z-20" bind:this={navbar}>
      <TopNavbar {navUrls} />
    </div>
    <div class="page-container">
      <Router {routes} />
      <div style={hideSSR ? "display: none;" : ""}>
        <div id="layout-content-page">Default content</div>
      </div>
    </div>
    <Footer />
  </div>
  <SideNavbar isOpen={isDrawerSideOpen} {navUrls} />

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
      <h3 class="font-bold text-lg">Remove</h3>
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
</div>

<style>
  @import "/static/tailwin.css";

  .page-container {
    padding: 2rem;
    /* padding-top: 5rem; */
    max-width: 1250px;
    min-height: calc(100% - 226px);
  }

  .drawer {
    height: 100%;
  }

  /*
  .navbar {
    transition: top 0.3s;
  }

  #navbar {
    background-color: #333;
    position: fixed;
    top: 0;
    width: 100%;
    transition: top 0.3s;
    max-width: var(--max-screen);
  }
  */
</style>
