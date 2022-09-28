import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import ErrorModel from "../error/ErrorModel";
import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import type IBlogService from "./BlogService";
import { BlogService } from "./BlogService";
import type { BlogModel } from "./blog_models";
import type AlertMessage from "../common/AlertMessage";


export default interface IBlogAdminViewModel {

  onInit(): void;

  showMessage(msg: AlertMessage): void
  hiddeMessage(): void

  getBlogs(): Readable<BlogModel[]>;
  getBlogsReq(): Readable<Promise<BlogModel[]>>;
  getErrorBlogsMsg(): Readable<string>;
  getMsg(): Readable<AlertMessage>
}


export class BlogAdminViewModel implements IBlogAdminViewModel {

  private static instance: IBlogAdminViewModel = null;

  private _blogServ: IBlogService = BlogService.getInstance();
  private _authMV: IAuthViewModel = AuthViewModel.getInstance();


  private _blogs: Writable<BlogModel[]> = writable([]);
  private _blogsReq: Writable<Promise<BlogModel[]>> = writable(null);

  private _errorBlogsMsg: Writable<string> = writable(null);
  private _msg: Writable<AlertMessage> = writable(null);

  private constructor() { }

  public static getInstance(): IBlogAdminViewModel {
    if (BlogAdminViewModel.instance == null) {
      BlogAdminViewModel.instance = new BlogAdminViewModel();
    }

    return BlogAdminViewModel.instance;
  }


  public onInit(): void {
    this._blogs.set([]);
    const allProdRequest = this._blogServ.findAll();
    this._blogsReq.set(allProdRequest);

    allProdRequest
      .then(allblogs => this._blogs.set(allblogs))
      .catch(err => ErrorModel.handleRequestErrors(err, this._errorBlogsMsg, this._authMV))
      ;
  }

  public showMessage(msg: AlertMessage): void {
    setTimeout(() => {
      this._msg.set(msg)

      setTimeout(() => {
        this._msg.set(null)
      }, 10000);

    }, 500);
  }

  public hiddeMessage(): void {
    this._msg.set(null)
  }


  public getBlogs(): Readable<BlogModel[]> {
    return this._blogs;
  }
  public getBlogsReq(): Readable<Promise<BlogModel[]>> {
    return this._blogsReq;
  }
  public getErrorBlogsMsg(): Readable<string> {
    return this._errorBlogsMsg;
  }
  public getMsg(): Readable<AlertMessage> {
    return this._msg
  }


}