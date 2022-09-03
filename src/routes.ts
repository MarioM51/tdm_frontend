import Router, { replace } from "svelte-spa-router";
import wrap from "svelte-spa-router/wrap";


import { get } from "svelte/store";

import type IAuthViewModel from "./auth/04_viewModel/auth/IAuthViewModel";
import AuthViewModel from "./auth/04_viewModel/auth/AuthViewModel";

import HomeAdmin from "./home/05_view/HomeAdmin.svelte";
import AuthPage from "./auth/05_view/AuthPage.svelte"
import NotFound from "./error/05_view/NotFound.svelte"

const auth: IAuthViewModel = AuthViewModel.getInstance();

const routes = {
  // Exact path
  "/": HomeAdmin,

  // Using named parameters, with last being optional
  "/login": AuthPage,

  // Wildcard parameter
  "/users": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./auth/05_view/UsersPage.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (detail) => {
        const session = get(auth.getSession());
        
        const isAuth = session != null;
        if (!isAuth) {
          console.log("Permise denied /users");
          replace("/auth");
        }
        return isAuth;
      },
    ],
  }),

  "/products": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./product/05_view/ProductsAdminPage.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (_) => {
        const session = get(auth.getSession());
        const isAuth = session != null && session.hasRols(["admin", "products"]);
        if (!isAuth) {
          console.log("Denied /products");
          replace("/");
        }
        return isAuth;
      },
    ],
  }),

  "/blogs": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./blog/BlogAdminPage.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (_) => {
        const session = get(auth.getSession());
        const isAuth = session != null && session.hasRols(["admin", "blogs"]);
        if (!isAuth) {
          console.log("Permision denied /blogs");
          replace("/");
        }
        return isAuth;
      },
    ],
  }),
  
  "/blog-form/:id": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./blog/BlogFormPage.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (_) => {
        const session = get(auth.getSession());
        const isAuth = session != null && session.hasRols(["admin", "blogs"]);
        if (!isAuth) {
          console.log("Permision denied /blog-form");
          replace("/");
        }
        return isAuth;
      },
    ],
  }),

  "/orders": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./orders/OrdersAdmin.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (_) => {
        const session = get(auth.getSession());
        const isAuth = session != null && session.hasRols(["admin"]);
        if (!isAuth) {
          console.warn("Permision denied /orders");
          replace("/");
        }
        return isAuth;
      },
    ],
  }),

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};

export default routes;