
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

  public static toSlug(str: string): string {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  }

}