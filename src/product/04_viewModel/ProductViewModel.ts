import { get, writable } from "svelte/store";
import type { Writable, Readable } from "svelte/store";
import type IProductViewModel from "./IProductViewModel";
import type IProductService from "../03_logic/IProductService";
import ProductService from "../03_logic/ProductService";
import ProductModel from "../01_model/ProductModel";
import ErrorModel from "../../error/ErrorModel";
import AuthViewModel from "../../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../../auth/04_viewModel/auth/IAuthViewModel";

export default class ProductViewModel implements IProductViewModel {

  //utils
  private static _instance:IProductViewModel = null;
  private readonly _productServ:IProductService = new ProductService();
  private _authMV: IAuthViewModel = AuthViewModel.getInstance();

  //Data UI
  private _products:Writable<ProductModel[]> = writable([]);
  private _productsRequest:Writable<Promise<ProductModel[]>> = writable(null);

  private _productOnForm:Writable<ProductModel> = writable(null);
  private _productOnFormRequest:Writable<Promise<ProductModel>> = writable(null);

  private _productToDelete:Writable<ProductModel> = writable(null);
  private _productToDeleteRequest:Writable<Promise<ProductModel>> = writable(null);

  private _errorMsg:Writable<string> = writable(null);

  private constructor(){}

  public static getInstance():IProductViewModel {
    if(ProductViewModel._instance == null) {
      ProductViewModel._instance = new ProductViewModel();
    }
    return ProductViewModel._instance;
  }
  
  public onInit(): void {
    const allProdRequest = this._productServ.findAll();
    this._productsRequest.set(allProdRequest);
    allProdRequest
      .then(allProductsFinded => this._products.set(allProductsFinded))
      .catch(err => ErrorModel.handleRequestErrors(err, this._errorMsg, this._authMV))
    ;
  }

  public onClickAdd():void {
    this._productOnForm.set(new ProductModel())
  }
  public onSubmitAdd(): void {
    const addRequest = this._productServ.add(get(this._productOnForm))
    this._productOnFormRequest.set(addRequest);

    addRequest
      .then(added => {
        this._products.update(table => {
          table.push(added);
          this.closeProductForm()
          return table
        });
      })
      .catch(error => {
        ErrorModel.handleRequestErrors(error, this._errorMsg, this._authMV)
      })
    ;
    
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
        ErrorModel.handleRequestErrors(err, this._errorMsg, this._authMV)
      })
    ;

    
  }

  public onClickEdit(rowNum: number): void {
    if(rowNum < 0) {
      this.closeProductForm()
    }
    this._productOnForm.set(get(this._products)[rowNum]);
  }
  public onConfirmEdit(): void {
    //send request
    const editReq = this._productServ.edit(get(this._productOnForm));
    this._productOnFormRequest.set(editReq);

    //react to edit response
    editReq
      .then(pEdited => {
        this._products.update((table) => {
          const index = table.findIndex(p => p.id == get(this._productOnForm).id)
          table[index] = pEdited;
          return table;
        });
        this.closeProductForm()

      //react to error edit response
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this._errorMsg, this._authMV)
      })
    ;
  }

  public closeProductForm(): void {
    this._productOnForm.set(null);
  }

  public getProducts():Readable<ProductModel[]> { return this._products; }
  public getProductsRequest():Readable<Promise<ProductModel[]>> { return this._productsRequest; }
  
  public getProductOnForm():Readable<ProductModel> { return this._productOnForm; }
  public getProductOnFormRequest():Readable<Promise<ProductModel>> { return this._productOnFormRequest; }

  public getProductToDelete():Readable<ProductModel> { return this._productToDelete; }
  public getProductToDeleteRequest():Readable<Promise<ProductModel>> { return this._productToDeleteRequest; }

  public getErrorMsg():Readable<string> { return this._errorMsg }

}