import wrap from "svelte-spa-router/wrap";
import { Consts } from "../../Constants";
import OrdersClient from "../../orders/OrdersClient.svelte";
import AuthPage from "../../auth/05_view/AuthPage.svelte";
import UserInfo from "../../auth/05_view/UserInfo.svelte";


function csrMode(isIt: boolean): void {
  const addToCardEvent = new CustomEvent(Consts.CSR_MODE, {
    detail: isIt,
  });
  window.dispatchEvent(addToCardEvent);
}

const routes = {
  "/": wrap({
    component: OrdersClient,
    conditions: [
      async (p) => {
        csrMode(false)
        return false;
      },
    ],
  }),

  "/orders": wrap({
    component: OrdersClient,
    conditions: [
      async (p) => {
        csrMode(true)
        return true;
      },
    ],
  }),

  "/login": wrap({
    component: AuthPage,
    conditions: [
      async (p) => {
        csrMode(true)
        return true;
      },
    ],
  }),

  "/user-info": wrap({
    component: UserInfo,
    conditions: [
      async (p) => {
        csrMode(true)
        return true;
      },
    ],
  }),

  /*
   "*": NotFound,
   */
};

export default routes;