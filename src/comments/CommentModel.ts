import type { BlogComment } from "../blog/blog_models";
import Model from "../helpers/AbstractModel"

export default class CommentModel extends Model {

  public static readonly INITIAL_SCORE = 1;
  public static readonly MAX_LENGTH = 250;
  public static readonly MIN_LENGTH = 10;

  constructor(
    public id:number = 0,
    public idUser:number = 0,
    public idTarget:number = 0,
    public content:string = '',
    public stars:number = CommentModel.INITIAL_SCORE,
    public created_at:Date = null,
  ){
    super();
  }

  public validateToSend():string {
    if(this.idTarget <= 0) {
      return "id target defined";
    }

    if(this.content == null || this.content == "") {
      return "comment content defined";
    }

    if(this.stars <= 0 || this.stars > 5) {
      return "stars not defined or aout of range"
    }

    if(this.created_at == null) {
      return "comment created at not defined"
    }

    return null;
  }

  public validateInForm():string {
    let errorMsg:string = ``;
    if (this.content.length <= CommentModel.MIN_LENGTH || this.content.length > CommentModel.MAX_LENGTH) {
      errorMsg = `The comment must be between ${CommentModel.MIN_LENGTH} and ${CommentModel.MAX_LENGTH}`;
    }
    return errorMsg;
  }

  public static fromBlogComment(blogComment:BlogComment):CommentModel {
    const comment = new CommentModel();
    comment.content = blogComment.text;
    comment.created_at = blogComment.datePublished;
    comment.id = blogComment.identifier;
    comment.idTarget = blogComment.idBlog;
    comment.idUser = blogComment.idUser;
    comment.stars = blogComment.rating;
    return comment;
  }
}