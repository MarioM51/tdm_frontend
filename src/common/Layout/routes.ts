import wrap from "svelte-spa-router/wrap";
import Constants from "../Constants";
import Orders from "../../orders/Orders.svelte";
import LoginCostumer from "../../orders/Orders.svelte";

function csrMode(is:boolean): void {
  const addToCardEvent = new CustomEvent(Constants.CSR_MODE, {
    detail: is,
  });
  window.dispatchEvent(addToCardEvent);
}

const routes = {
  //"/": Home,

  "/orders": wrap({
    component: Orders,
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