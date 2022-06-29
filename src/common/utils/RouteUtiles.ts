
export default class RouteUtiles {

  public static getParams(paramsString:string): Map<string, string> {
    const myArray = paramsString.split(",");
    const myMap: Map<string, string> = new Map();
    myArray.forEach((paramsString) => {
      const temp = paramsString.split("=");
      myMap.set(temp[0], temp[1]);
    });
    return myMap;
  }

}