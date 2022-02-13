import ErrorModel from "../01_model/error/ErrorModel";

export enum HttpMethod {
  POST="POST",
  GET="GET",
  PUT="PUT",
  DELETE="DELETE",
}

interface ICast<E> {
  (resp: Response): Promise<E>;
}

export default class RequestHelper<E> {
  public method:HttpMethod;
  public url:string;
  public token:string = null;
  public data:any = null;
  public cast:ICast<E>;

  public static readonly LOGIN_REQUIRED = new ErrorModel(401, "Login required");
  public static readonly USR_UNAUTH = new ErrorModel(403, "User Unauthorized");

  public async doRequest():Promise<E> {
    const myHeaders = new Headers();
    if (this.token != null) {
      myHeaders.append('Token', this.token);
    }

    const options:RequestInit = {
      method: this.method,
      headers: myHeaders,
      body: (this.data != null) ? JSON.stringify(this.data) : null
    };

    let resp:Response = null
    try {
      resp = await fetch(this.url, options)
    } catch(err) {
      console.warn(err);
      throw new ErrorModel(500, "Connection error")
    }

    if(!resp.ok) {
      if(resp.status == 401) {
        throw new ErrorModel(401, "Login required")
      }
      
      if(resp.status == 403) {
        throw new ErrorModel(403, "User Unauthorized")
      }

      const errorData = await resp.json()

      const causeOk = errorData.cause == null && !(errorData.cause instanceof String);
      const statusOk = errorData.status == null && !(errorData.status instanceof Number);

      if( causeOk || statusOk) {
        throw new ErrorModel(500, "Error in error response")
      }

      throw new ErrorModel(errorData.status, errorData.cause)
    }

    let dataFormatted:E;
    try {
      dataFormatted = await this.cast(resp)
    } catch(err) {
      throw new ErrorModel(500, "Error casting body response")
    }

    return dataFormatted
  }

}