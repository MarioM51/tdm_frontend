import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import ErrorModel from "../error/ErrorModel";
import { get, writable } from "svelte/store";
import type { Readable } from "svelte/store";
import type { Writable } from "svelte/store";
import { BlogService } from "./BlogService";
import type IBlogService from "./BlogService";
import { BlogModel } from "./blog_models";
import { replace } from "svelte-spa-router";
import type IBlogAdminViewModel from "./BlogAdminViewModel";
import { BlogAdminViewModel } from "./BlogAdminViewModel";
import AlertMessage from "../common/AlertMessage";

export default interface IBlogFormViewModel {

  onInit(): void
  onDestroy(): void

  findBlogById(id: number): void;
  save(): void
  edit(): void
  deletePost(): void

  getBlogOnForm(): Readable<BlogModel>;
  getBlogOnFormReq(): Readable<Promise<BlogModel>>;
  getBlogDeleteReq(): Readable<Promise<BlogModel>>;
  getErrorBlogMsg(): Readable<string>;
}


export class BlogFormViewModel implements IBlogFormViewModel {

  private static instance: IBlogFormViewModel = null;

  private _blogServ: IBlogService = BlogService.getInstance();
  private _authMV: IAuthViewModel = AuthViewModel.getInstance();
  private _blogAdminVM: IBlogAdminViewModel = BlogAdminViewModel.getInstance();


  private _blogOnForm: Writable<BlogModel> = writable(new BlogModel(0, "", "", null, "", null, null));
  private _blogOnFormReq: Writable<Promise<BlogModel>> = writable(null);
  private _blogDeleteReq: Writable<Promise<BlogModel>> = writable(null);

  private _errorBlogMsg: Writable<string> = writable(null);

  private constructor() { }

  public static getInstance(): IBlogFormViewModel {
    if (BlogFormViewModel.instance == null) {
      BlogFormViewModel.instance = new BlogFormViewModel();
    }

    return BlogFormViewModel.instance;
  }

  public onInit(): void {
    this._errorBlogMsg.set(null);
  }

  public onDestroy(): void {
    this._blogOnFormReq.set(null);
    this._blogOnForm.set(new BlogModel(0, "", "", null, "", null, null));
    this._errorBlogMsg.set(null);
  }

  public findBlogById(id: number): void {
    if (id == 0) {
      return;
    }

    const req: Promise<BlogModel> = this._blogServ.findById(id);
    this._blogOnFormReq.set(req);

    req
      .then(blog => {
        this._blogOnForm.set(blog);
        setTimeout(() => {
          this._blogOnForm.set(blog);
        }, 500);

        this._errorBlogMsg.set(null);
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorBlogMsg, this._authMV)
      })
      .finally(() => {
        setTimeout(() => {
          this._blogOnFormReq.set(null);
        }, 100);
      })
      ;
  }

  public save(): void {
    const addReq: Promise<BlogModel> = this._blogServ.save(get(this._blogOnForm));
    this._blogOnFormReq.set(addReq);

    addReq
      .then(b => {
        console.log("saved", b);
        replace("/blogs")
        this._blogAdminVM.showMessage(new AlertMessage("Blog '" + b.title + "' added", "success"))
        this.onDestroy()
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorBlogMsg, this._authMV);
      })
      .finally(() => {
        this._blogOnFormReq.set(null);
      })
      ;
  }


  public edit(): void {
    const editReq: Promise<BlogModel> = this._blogServ.edit(get(this._blogOnForm));
    this._blogOnFormReq.set(editReq);

    editReq
      .then(b => {
        console.log("Edited", b);
        replace("/blogs")
        this._blogAdminVM.showMessage(new AlertMessage("Blog '" + b.title + "' edited", "success"))
        this.onDestroy()
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorBlogMsg, this._authMV);
      })
      .finally(() => {
        this._blogOnFormReq.set(null);
      })
      ;
  }

  public deletePost(): void {
    const delReq: Promise<BlogModel> = this._blogServ.deletePost(get(this._blogOnForm));
    this._blogOnFormReq.set(delReq);

    delReq
      .then(b => {
        console.log("deleted", b);
        replace("/blogs")
        this._blogAdminVM.showMessage(new AlertMessage("Blog '" + b.title + "' deleted", "success"))
        this.onDestroy()
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorBlogMsg, this._authMV);
      })
      .finally(() => {
        this._blogOnFormReq.set(null);
      })
      ;

  }



  public getBlogOnForm(): Readable<BlogModel> {
    return this._blogOnForm;
  }

  public getBlogOnFormReq(): Readable<Promise<BlogModel>> {
    return this._blogOnFormReq;
  }

  public getBlogDeleteReq(): Readable<Promise<BlogModel>> {
    return this._blogDeleteReq;
  }

  public getErrorBlogMsg(): Readable<string> {
    return this._errorBlogMsg;
  }

}