import type ProductImage from "../01_model/ProductImage";
import type ProductModel from "../01_model/ProductModel";
import ProductApiDAO from "../02_data/ProductApiDAO";
import type IProductService from "./IProductService";
import type ICommentService from "../../comments/ICommentService";
import type CommentModel from "../../comments/CommentModel";
import ErrorModel from "../../error/ErrorModel";
import type IAuthService from "../../auth/03_logic/IAuthService";
import AuthService from "../../auth/03_logic/AuthService";

export default class ProductService implements IProductService, ICommentService {

  private readonly _productsApi = new ProductApiDAO();
  private readonly _authServ: IAuthService = new AuthService();

  public async findAll(): Promise<ProductModel[]> {
    const all = await this._productsApi.findAll();
    all.sort((a, b) => (a.id > b.id) ? 1 : -1)
    return all;
  }

  public add(toAdd: ProductModel): Promise<ProductModel> {
    toAdd.files = null;
    return this._productsApi.add(toAdd);
  }

  public edit(p: ProductModel): Promise<ProductModel> {
    return this._productsApi.edit(p);
  }

  public remove(p: ProductModel): Promise<ProductModel> {
    return this._productsApi.remove(p);
  }

  public async addFile(idProduct: number, images: FileList[]): Promise<ProductImage[]> {
    const resp: ProductImage[] = []
    for (let i = 0; i < images.length; i++) {
      let temp = await this._productsApi.addFile(idProduct, images[i]);
      resp.push(temp)
    }
    return resp;
  }

  public removeImage(img: ProductImage): Promise<ProductImage> {
    return this._productsApi.removeIImageById(img.id);
  }

  public async addComment(newComment: CommentModel): Promise<CommentModel> {
    const msgError = newComment.validateToSend();
    if (msgError != null) {
      throw new ErrorModel(400, msgError);
    }

    const commentAdded = await this._productsApi.addComment(newComment);
    return commentAdded;

  }


  public async removeComment(commentToDel: CommentModel): Promise<CommentModel> {
    const userLogged = this._authServ.getUserStored();
    if (userLogged == null || commentToDel.idUser != userLogged.id) {
      throw new ErrorModel(403, "The comment only can be deleted by the owner or by the admin user");
    }

    const commentDeleted: CommentModel = await this._productsApi.removeComment(commentToDel);
    return commentDeleted;
  }

  public async findAllComments(): Promise<CommentModel[]> {
    const allComments: CommentModel[] = await this._productsApi.findAllComments();

    return allComments;
  }

  public async addResponse(toadd: CommentModel): Promise<CommentModel> {
    const commentAdded: CommentModel = await this._productsApi.addCommentResponse(toadd);
    return commentAdded;
  }

}