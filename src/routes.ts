import Router, { replace } from "svelte-spa-router";
import wrap from "svelte-spa-router/wrap";


import { get } from "svelte/store";

import type IAuthViewModel from "./auth/04_viewModel/auth/IAuthViewModel";
import AuthViewModel from "./auth/04_viewModel/auth/AuthViewModel";

import Home from "./home/05_view/Home.svelte";
import AuthPage from "./auth/05_view/AuthPage.svelte"
import NotFound from "./error/05_view/NotFound.svelte"
import AddBlogPage from "./blog/BlogFormPage.svelte"
import BlogAdminPage from "./blog/BlogAdminPage.svelte"

const auth: IAuthViewModel = AuthViewModel.getInstance();

const routes = {
  // Exact path
  "/": Home,

  // Using named parameters, with last being optional
  "/auth": AuthPage,

  // Wildcard parameter
  "/users": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./auth/05_view/UsersPage.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (detail) => {
        const session = get(auth.getSession());
        
        const isAuth = session != null;
        if (isAuth) {
          console.log("Open /users");
        } else {
          console.log("Denied /users");
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
        console.log("Open /products");
        return isAuth;
      },
    ],
  }),

  "/blogs": BlogAdminPage,
  "/blog-form/:id": AddBlogPage,

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};

export default routes;