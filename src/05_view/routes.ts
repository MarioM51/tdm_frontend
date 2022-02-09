import Router, { replace } from "svelte-spa-router";
import wrap from "svelte-spa-router/wrap";

import AuthPage from "./pages/AuthPage.svelte";
import NotFound from "./pages/NotFound.svelte";
import Home from "./pages/Home.svelte";
import { get } from "svelte/store";

import type IAuthViewModel from "../04_viewModel/auth/IAuthViewModel";
import AuthViewModel from "../04_viewModel/auth/AuthViewModel";

const auth: IAuthViewModel = AuthViewModel.getInstance();

const routes = {
  // Exact path
  "/": Home,

  // Using named parameters, with last being optional
  "/auth": AuthPage,

  // Wildcard parameter
  "/users": wrap({
    // Use a dynamically-loaded component for this
    asyncComponent: () => import("./pages/UsersPage.svelte"),
    // Adding one pre-condition that's an async function
    conditions: [
      async (detail) => {
        const session = get(auth.getSession());
        const isAuth = session != null;
        if (!isAuth) {
          console.log("Denied /users");
          replace("/auth");
        }
        console.log("Open /users");
        return isAuth;
      },
    ],
  }),

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};

export default routes;