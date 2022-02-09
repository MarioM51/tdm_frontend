export default class RolModel {
  constructor(
    public id:number = null,
    public name:string = null
  ) {}

  public static fromJson(rawRol: any):RolModel {
    const rol = new RolModel();
    rol.id = rawRol.ID
    rol.name = rawRol.Name
    return rol
  }

}