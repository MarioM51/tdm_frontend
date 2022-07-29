import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "src/auth/04_viewModel/auth/IAuthViewModel";
import ErrorModel from "../error/ErrorModel";
import type Model from "./AbstractModel";
import { Readable, writable, Writable } from "svelte/store";

/*
interface FResolve<E> {
  (resp: E): void;
}
*/

abstract class UIAsyncInfo {

  protected readonly _remplaceReq:Writable<Promise<any>> = writable(null);
  protected readonly _addReq:Writable<Promise<any>> = writable(null);
  protected readonly _updateReq:Writable<Promise<any>> = writable(null);
  protected readonly _deleteReq:Writable<Promise<any>> = writable(null);
  
  protected readonly _errorMsg:Writable<string> = null;
  private _authVM:IAuthViewModel = null;

  public constructor(errorMsg:Writable<string>) {
    this._errorMsg = errorMsg;
  }

  protected middlewareUIRequest(req:Promise<any>):void {
    this._errorMsg.set(null);
    req
      .catch(err => {
        this.handleGenericError(err)
      })
      .finally(() => {
        this.nullRequests();
      })
    ;
  }

  private nullRequests() {
    this._remplaceReq.set(null);
    this._addReq.set(null);
    this._updateReq.set(null);
    this._deleteReq.set(null)
  }

  protected handleGenericError(err:any):void {
    if(err instanceof ErrorModel) {
      if(this._authVM == null) {
        this._authVM = AuthViewModel.getInstance();
      }
      if(err.status == 401) {
        if(err.cause.includes("expired")) {
          this._authVM.logout('session_expired');
          return;
        }
        this._authVM.logout('session_required');
        return;
      }
      this._errorMsg.set(err.cause);
    } else {
      console.error("Error no controlado");
      console.error(err);
      this._errorMsg.set("Error, try later");
    }
  }
  
}

export default class UIAsyncCollection<E extends Model> extends UIAsyncInfo {
  protected readonly _allItemsInUI:Writable<E[]> = writable(null);
  
  public constructor(value:E[], errorMsg:Writable<string>) {
    super(errorMsg);
    this._allItemsInUI.set(value);
  }

  public showCollectionRequest(req:Promise<E[]>, updateType:UIUpdateTypeCollection) {
    this.middlewareUIRequest(req);
    this.setRequestCollection(req, updateType);
    req.then((resp => {
      this.onResolveColletion(resp, updateType);
    }))
  }

  public showItemOfCollectionRequest(req:Promise<E>, updateType:UIUpdateTypeItem) {
    this.middlewareUIRequest(req);
    this.setRequestItemOfCollection(req, updateType)
    req.then((resp => {
      this.onResolveItem(resp, updateType);
    }))
  }

  private onResolveColletion(valuesResived:E[], updateType:UIUpdateTypeCollection): boolean {
    let resolved = false;
      switch (updateType) {
        case UIUpdateTypeCollection.COLLECTION_ADD:
          this._allItemsInUI.update(onUI => {
            onUI.push(...valuesResived)
            return onUI;
          });
          resolved = true;
        break;
  
        case UIUpdateTypeCollection.COLLECTION_REMPLACE:
          this._allItemsInUI.set(valuesResived);
          resolved = true;
        break;
  
        default:
          throw new Error("case not defined");
      }

      return resolved;
  }

  private onResolveItem(itemResived:E, updateType:UIUpdateTypeItem): boolean {
    let resolved = false;
    switch (updateType) {
      case UIUpdateTypeItem.ADD_TO_START:
        this._allItemsInUI.update(onUI => {
          onUI.unshift(itemResived)
          return onUI;
        });
        resolved = true;
      break;

      case UIUpdateTypeItem.DELETE:
        this._allItemsInUI.update(onUI => {
          onUI = onUI.filter(i => i.id != itemResived.id);
          return onUI;
        });
        resolved = true;
      break;

      default:
        throw new Error("case not defined");
    }

    return resolved;
  }

  private setRequestItemOfCollection(req:Promise<any>, updateType:UIUpdateTypeItem): boolean {
    let resolved = false;
      switch (updateType) {
        case UIUpdateTypeItem.ADD_TO_START:
          this._addReq.set(req);
        break;
  
        case UIUpdateTypeItem.DELETE:
          this._deleteReq.set(req);
        break;
  
        default:
          throw new Error("case not defined");
      }
      return resolved;
  }

  private setRequestCollection(req:Promise<any>, updateType:UIUpdateTypeCollection): boolean {
    let resolved = false;
      switch (updateType) {
        case UIUpdateTypeCollection.COLLECTION_ADD:
          this._addReq.set(req);
        break;
  
        case UIUpdateTypeCollection.COLLECTION_REMPLACE:
          this._remplaceReq.set(req);
        break;
  
        default:
          throw new Error("case not defined");
      }
      return resolved;
  }

  public getObsValue():Readable<Array<E>> {
    return this._allItemsInUI;
  }

  public getRemplaceReq():Readable<Promise<Array<E>>> {
    return this._remplaceReq;
  }

  public getAddReq():Readable<Promise<Array<E>>> {
    return this._addReq;
  }

  public getUpdateReq():Readable<Promise<Array<E>>> {
    return this._updateReq;
  }

  public getDeleteReq():Readable<Promise<Array<E>>> {
    return this._deleteReq;
  }

}

export enum UIUpdateTypeItem {
  ADD_TO_START,
  DELETE,
}

export enum UIUpdateTypeCollection {
  COLLECTION_ADD,
  COLLECTION_REMPLACE,
}
