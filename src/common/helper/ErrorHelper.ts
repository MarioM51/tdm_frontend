import ErrorModel from "../../error/ErrorModel";

export default class ErrorHelper {

  public static getMessageError(error: any): string {
    if (typeof error === 'string') {
      return error.toString();
    } else if (error instanceof Error) {
      return error.message;
    } else if (error instanceof ErrorModel) {
      return error.cause;
    } else {
      console.error(error);
      return "Error inesperado";
    }
  }

}