import { get, writable } from "svelte/store";
import type { Writable, Readable } from "svelte/store";
import type IProductViewModel from "./IProductAdminViewModel";
import type IProductService from "../03_logic/IProductService";
import ProductService from "../03_logic/ProductService";
import ProductModel from "../01_model/ProductModel";
import ErrorModel from "../../error/ErrorModel";
import AuthViewModel from "../../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../../auth/04_viewModel/auth/IAuthViewModel";
import type ProductImage from "../01_model/ProductImage";

export default class ProductAdminViewModel implements IProductViewModel {

  //utils
  private static _instance:IProductViewModel = null;
  private readonly _productServ:IProductService = new ProductService();
  private _authMV: IAuthViewModel = AuthViewModel.getInstance();

  //Data UI
  private _products:Writable<ProductModel[]> = writable([]);
  private _productsRequest:Writable<Promise<ProductModel[]>> = writable(null);

  private _productOnForm:Writable<ProductModel> = writable(null);
  private _productOnFormRequest:Writable<Promise<ProductModel>> = writable(null);
  private _uploadImageReq:Writable<Promise<ProductImage>> = writable(null);
  private _oldInfoOnForm:ProductModel = null;

  private _productToDelete:Writable<ProductModel> = writable(null);
  private _productToDeleteRequest:Writable<Promise<ProductModel>> = writable(null);

  private _errorProductsMsg:Writable<string> = writable(null);
  private _errorFormMsg:Writable<string> = writable(null);
  private _errorUploadImage:Writable<string> = writable(null);

  private constructor(){}

  public static getInstance():IProductViewModel {
    if(ProductAdminViewModel._instance == null) {
      ProductAdminViewModel._instance = new ProductAdminViewModel();
    }
    return ProductAdminViewModel._instance;
  }
  
  public onInit(): void {
    this._productOnFormRequest.set(null)
    this._productToDeleteRequest.set(null)

    const allProdRequest = this._productServ.findAll();
    this._productsRequest.set(allProdRequest);
    allProdRequest
      .then(allProductsFinded => this._products.set(allProductsFinded))
      .catch(err => ErrorModel.handleRequestErrors(err, this._errorProductsMsg, this._authMV))
    ;
  }

  public onClickAdd():void {
    this._productOnForm.set(new ProductModel())
  }
  public onSubmitAdd(image: FileList): void {
    //Add product request
    const addRequest = this._productServ.add(get(this._productOnForm))
    this._productOnFormRequest.set(addRequest);

    addRequest
      .then(productAdded => {
        //Update UI when product is saved
        this._productOnFormRequest.set(null);
        this._productOnForm.set(productAdded);

        //Add image request
        if (image != null || image?.length >= 1) {
          const uploadImageReq = this._productServ.addFile(productAdded.id, image);
          this._uploadImageReq.set(uploadImageReq);
          uploadImageReq
            .then(imageAdded => {
              productAdded.image = imageAdded
              //Update UI when image product is uploaded
              this.productAddedSucces(productAdded);

            })
            .catch(saveImageError => {
              ErrorModel.handleRequestErrors(saveImageError, this._errorUploadImage, this._authMV)
              this._uploadImageReq.set(null);
            })
          ;
        } else {
          this.productAddedSucces(productAdded);
        }
      })
      .catch(saveProductError => {
        ErrorModel.handleRequestErrors(saveProductError, this._errorFormMsg, this._authMV)
      })
    ;
  }

  private productAddedSucces(added:ProductModel):void {
    this._uploadImageReq.set(null);
    this._products.update(table => {
      table.push(added);
      this.closeProductForm()
      return table
    });
  }




  public onClickRemove(rowNum: number): void {
    if(rowNum < 0) {
      this._productToDelete.set(null);
    }

    this._productToDelete.set(get(this._products)[rowNum]);
  }
  public onConfirmRemove(): void {
    const delReq = this._productServ.remove(get(this._productToDelete));
    this._productToDeleteRequest.set(delReq);

    delReq
      .then(_ => {
        this._products.update((table) => {
          return table.filter(p => p.id != get(this._productToDelete).id);
        });
        this._productToDelete.set(null);
        this._productToDeleteRequest.set(null);
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorProductsMsg, this._authMV)
      })
    ; 
  }

  

  public onClickEdit(rowNum: number): void {
    if(rowNum < 0) {
      this.closeProductForm()
    }
    this._productOnForm.set(get(this._products)[rowNum]);
    this._oldInfoOnForm = get(this._products)[rowNum]
  }
  public onConfirmEdit(image:FileList): void {
    //send request
    const editReq = this._productServ.edit(get(this._productOnForm));
    this._productOnFormRequest.set(editReq);

    //react to edit response
    editReq
      .then(pEdited => {
        if (image != null || image?.length >= 1) {
          const uploadImageReq = this._productServ.addFile(pEdited.id, image);
          this._uploadImageReq.set(uploadImageReq);

          uploadImageReq
            .then(imageAdded => {
              pEdited.image = imageAdded
              //Update UI when image product is uploaded
              this.productUpdateSuccess(pEdited);
            })
            .catch(updateImageError => {
              ErrorModel.handleRequestErrors(updateImageError, this._errorUploadImage, this._authMV)
              this._uploadImageReq.set(null);
            })
          ;
        } else {
          //letting the image like it was
          pEdited.image = get(this._productOnForm).image
          pEdited.files = get(this._productOnForm).files
          this.productUpdateSuccess(pEdited);
        }
      //react to error edit response
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorProductsMsg, this._authMV)
      })
    ;
  }

  private productUpdateSuccess(pEdited:ProductModel) {
    this._products.update((table) => {
      const index = table.findIndex(p => p.id == get(this._productOnForm).id)
      table[index] = pEdited;
      return table;
    });
    this.closeProductForm()
  }

  public closeProductForm(): void {
    this._productOnForm.set(null);
    this._errorFormMsg.set(null);
    this._errorUploadImage.set(null);
    this._uploadImageReq.set(null);
  }

  public getProducts():Readable<ProductModel[]> { return this._products; }
  public getProductsRequest():Readable<Promise<ProductModel[]>> { return this._productsRequest; }
  
  public getProductOnForm():Readable<ProductModel> { return this._productOnForm; }
  public getProductOnFormRequest():Readable<Promise<ProductModel>> { return this._productOnFormRequest; }
  public getUploadImageReq():Readable<Promise<ProductImage>> { return this._uploadImageReq; }

  public getProductToDelete():Readable<ProductModel> { return this._productToDelete; }
  public getProductToDeleteRequest():Readable<Promise<ProductModel>> { return this._productToDeleteRequest; }

  public getErrorMsg():Readable<string> { return this._errorProductsMsg }
  public getErrorFormMsg():Readable<string> { return this._errorFormMsg }
  public getErrorUploadImage():Readable<string> { return this._errorUploadImage }


}