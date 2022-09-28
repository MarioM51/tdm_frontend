import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import { BlogService } from "../blog/BlogService";
import ProductService from "../product/03_logic/ProductService";
import type CommentModel from "./CommentModel";

export default class CommentsAdminViewModel {

  private readonly _isProductPanelVisible = writable(true);
  private readonly _productService = new ProductService();
  private readonly _productComments: Writable<CommentModel[]> = writable([]);
  private readonly _productCommentsReq: Writable<Promise<CommentModel[]>> = writable(null);

  private readonly _isBlogPanelVisible = writable(false);
  private readonly _blogService = BlogService.getInstance();
  private readonly _errorMessage: Writable<string> = writable("");


  public onInit(): void {
    this.getAllProductComments();
  }

  public getAllProductComments(): void {
    const productReq: Promise<CommentModel[]> = this._productService.findAllComments();
    this._productCommentsReq.set(productReq);

    productReq
      .then(productCommentsFinded => {
        this._productComments.set(productCommentsFinded);
      })
      .catch(error => {
        this._handleError(error);
      })
      .finally(() => {
        this._productCommentsReq.set(null);
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

  public showBlogPanel() {
    this._isBlogPanelVisible.set(true);
    this._isProductPanelVisible.set(false);
  }

  public showProductPanel() {
    this._isBlogPanelVisible.set(false);
    this._isProductPanelVisible.set(true);
  }

  public getIsBlogPanelVisible(): Readable<boolean> {
    return this._isBlogPanelVisible;
  }
  public getIsProductPanelVisible(): Readable<boolean> {
    return this._isProductPanelVisible;
  }
  public getErrorMessage(): Readable<string> {
    return this._errorMessage;
  }
  public getProductCommentsReq(): Readable<Promise<CommentModel[]>> {
    return this._productCommentsReq;
  }
  public getProductComments(): Readable<CommentModel[]> {
    return this._productComments;
  }

}