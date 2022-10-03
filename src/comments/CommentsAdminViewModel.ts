import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import { BlogService } from "../blog/BlogService";
import ProductService from "../product/03_logic/ProductService";
import type CommentModel from "./CommentModel";


export enum CommentType {
  BLOG,
  PRODUCT,
}

export default class CommentsAdminViewModel {

  private readonly _productService = new ProductService();
  private readonly _commentsOnTable: Writable<CommentModel[]> = writable([]);
  private readonly _commentsOnTableReq: Writable<Promise<CommentModel[]>> = writable(null);

  private readonly _blogService = BlogService.getInstance();
  private readonly _errorMessage: Writable<string> = writable("");

  public readonly commentTypeShowing = writable(CommentType.PRODUCT);

  public onInit(): void {
    this.getAllProductComments();
  }

  public getAllProductComments(): void {
    this.commentTypeShowing.set(CommentType.PRODUCT);
    const productReq: Promise<CommentModel[]> = this._productService.findAllComments();
    this._commentsOnTableReq.set(productReq);

    productReq
      .then(productCommentsFinded => {
        this._commentsOnTable.set(productCommentsFinded);
      })
      .catch(error => {
        this._handleError(error);
      })
      .finally(() => {
        this._commentsOnTableReq.set(null);
      })
      ;
  }

  public getAllBlogComments(): void {
    this.commentTypeShowing.set(CommentType.BLOG);
    const blogCommentsReq: Promise<CommentModel[]> = this._blogService.findAllComments();
    this._commentsOnTableReq.set(blogCommentsReq);
    this._commentsOnTable.set([]);

    blogCommentsReq
      .then(blogCommentsFinded => {
        this._commentsOnTable.set(blogCommentsFinded);
      })
      .catch(error => {
        this._handleError(error);
      })
      .finally(() => {
        this._commentsOnTableReq.set(null);
      })
      ;
  }

  private _handleError(error: any) {
    if (error instanceof Error) {
      this._errorMessage.set(error.message);
    } else if (typeof error == 'string') {
      this._errorMessage.set(error);
    } else {
      console.error("unhandled error: ", error);
      this._errorMessage.set("Error inesperado, intente mas tarde");
    }
  }

  public getErrorMessage(): Readable<string> {
    return this._errorMessage;
  }
  public getTableReq(): Readable<Promise<CommentModel[]>> {
    return this._commentsOnTableReq;
  }
  public getCommentsOnTable(): Readable<CommentModel[]> {
    return this._commentsOnTable;
  }

}