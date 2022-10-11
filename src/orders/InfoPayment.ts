import RequestHelper from "../helpers/RequestHelper";

export default class InfoPayment {
  public Clabe: string = null;
  public Owner: string = null;
  public BankName: string = null;
  public Concept: string = null;

  public static async fromAPIResponse(resp: Response): Promise<InfoPayment> {
    const rawInfo = await resp.json();
    const info = new InfoPayment();
    Object.assign(info, rawInfo);
    return info;
  }

}
