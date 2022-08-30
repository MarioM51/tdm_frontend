import type { IBlogRepository } from "./BlogRepository";
import { BlogComment, BlogModel } from "./blog_models";

import ErrorModel from "../error/ErrorModel";
import { BlogRepository } from "./BlogRepository";
import type ICommentService from "../comments/ICommentService";
import CommentModel from "../comments/CommentModel";
import type IAuthService from "../auth/03_logic/IAuthService";
import AuthService from "../auth/03_logic/AuthService";

export default interface IBlogService {

  findAll():Promise<BlogModel[]>

  findById(id: number): Promise<BlogModel>;

  save(newBlog: BlogModel): Promise<BlogModel>;

  edit(newInfo: BlogModel): Promise<BlogModel>;

  deletePost(toDel: BlogModel): Promise<BlogModel>;

}

export class BlogService implements IBlogService, ICommentService {

  private static instance:BlogService = null;

  private readonly _blogRepo:IBlogRepository = BlogRepository.getInstance();
  private readonly _authServ:IAuthService = new AuthService();

  private constructor() { }

  public static getInstance():BlogService {
    if(BlogService.instance == null) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }


  public async findAll():Promise<BlogModel[]> {
    const blogs = await this._blogRepo.findAll();
    blogs.sort((a, b) => (a.id > b.id) ? 1 : -1);

    return blogs;
  }

  public async findById(id: number): Promise<BlogModel> {
    const finded = await this._blogRepo.findById(id);

    return finded;
  }

  public async save(newBlog: BlogModel): Promise<BlogModel> {
    const saved = await this._blogRepo.save(newBlog);

    return saved;
  }

  public async edit(newInfo: BlogModel): Promise<BlogModel> {
    const edited = await this._blogRepo.edit(newInfo);

    return edited;
  }

  public async deletePost(toDel: BlogModel): Promise<BlogModel> {
    const deleted = await this._blogRepo.deletePost(toDel);

    return deleted;
  }

//Comments Implementation

 public async addComment(newComment:CommentModel):Promise<CommentModel> {
    const msgError = newComment.validateToSend();
    if(msgError != null) {
      throw new ErrorModel(400, msgError);
    }

    const newBlogComment:BlogComment = BlogComment.fromComment(newComment)
    const blogCommentadded = await this._blogRepo.addComment(newBlogComment);
    const added = CommentModel.fromBlogComment(blogCommentadded);

    return added;
  }

  public async removeComment(commentToDel:CommentModel):Promise<CommentModel> {
    const userLogged = this._authServ.getUserStored();
    if(userLogged == null || commentToDel.idUser != userLogged.id) {
      throw new ErrorModel(403, "The comment only can be deleted by the owner or by the admin user");
    }
    
    const blogCommentToDel:BlogComment = BlogComment.fromComment(commentToDel)
    const blogCommentDeleted = await this._blogRepo.removeComment(blogCommentToDel);
    const deleted = CommentModel.fromBlogComment(blogCommentDeleted);
    return deleted;
  }

}
