export class BlogModel {
  constructor(
    public id:number=null,
    public title:string=null,
    public body:string=null,
    public thumbnail:string=null,
    public autor:string=null,
    public createdAt:Date=null,
    public updateAt:Date=null,
  ){}

}

export class AlertMessage {
  constructor(
    public msg:string,
    public type:string
  ){}

}