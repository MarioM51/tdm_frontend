import { push, pop, replace } from 'svelte-spa-router'
import { location, querystring } from 'svelte-spa-router'
import { get } from 'svelte/store';

export default class Router {


  public goToHome(): void {
    replace("/")
  }

  public goToLogin(): void {
    replace("/login");
  }

  public getParam(nameParam: string): string {
    const myArray = get(querystring).split(",");

    const myMap: Map<string, string> = new Map();
    myArray.forEach((paramsString) => {
      const temp = paramsString.split("=");
      myMap.set(temp[0], temp[1]);
    });

    return myMap.get(nameParam);
  }

}