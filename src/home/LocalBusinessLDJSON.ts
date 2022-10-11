// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export class LocalBusinessLDJSON {
  image: string[];
  name: string;
  founder: string;
  keywords: string;
  description: string;
  url: string;
  telephone: string;
  address: Address;
  email: string;
  geo: Geo;
  openingHoursSpecification: OpeningHoursSpecification[];

  private static getJSONLDFromHTML(): any {
    const elm = document.querySelector("#localbus_jsonld") as any;
    const elmText = elm.innerText;
    const elmJson = JSON.parse(elmText);
    return elmJson;
  }

  public static fromLDJson(): LocalBusinessLDJSON {
    const infoRaw = LocalBusinessLDJSON.getJSONLDFromHTML();
    const info = new LocalBusinessLDJSON();
    Object.assign(info, infoRaw);
    return info;
  }

}

export class Address {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export class Geo {
  latitude: number;
  longitude: number;
}

export class OpeningHoursSpecification {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}
