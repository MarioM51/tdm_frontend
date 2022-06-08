<script lang="ts">
  import Router from "svelte-spa-router";
  import TopNavbar from "./TopNavbar.svelte";
  import Footer from "./Footer.svelte";
  import { onMount } from "svelte";
  import SideNavbar from "./SideNavbar.svelte";
  import routes from "./routes";
  import Constants from "../Constants";

  const navUrls = [
    { label: "Products", url: "/products" },
    { label: "Blogs", url: "/blogs" },
    { label: "Orders", url: "#/orders" },
  ];

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
    checked={isDrawerSideOpen}
    on:change={() => (isDrawerSideOpen = !isDrawerSideOpen)}
    class="drawer-toggle"
  />
  <div class="drawer-content" bind:this={drawerContent}>
    <div id="navbar" class="z-20" bind:this={navbar}>
      <TopNavbar {navUrls} />
    </div>
    <div class="page-container">
      <Router {routes} />

      {#if !hideSSR}
        <div>
          <div id="layout-content-page">Default content</div>
        </div>
      {/if}
    </div>
    <Footer />
  </div>
  <SideNavbar {isDrawerSideOpen} {navUrls} />
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
