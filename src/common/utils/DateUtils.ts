export default class DateUtils {

  public static castDateFromServer(rawDate: any): Date {
    if (typeof rawDate == 'string') {
      const dateResumed = rawDate.slice(0, 19);
      const dateCasted = new Date(dateResumed);
      if (dateCasted.getFullYear() == 0 || dateCasted.getFullYear() < 5) {
        return null;
      }
      return dateCasted;
    } else if (rawDate instanceof Date) {
      return rawDate;
    }
    return null;
  }

  public static isResently(d: Date): boolean {
    const diferenceInMiliSeconds = Math.abs(d.getTime() - new Date().getTime())
    const isIt = diferenceInMiliSeconds < 5000;
    return isIt;
  }

  public static format(d: Date) {
    const resp = d.toISOString().substring(0, 10);
    return resp;
  }

}