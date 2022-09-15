import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import ErrorModel from "../error/ErrorModel";
import type Model from "./AbstractModel";
import { get, Readable, writable, Writable } from "svelte/store";

/*
interface FResolve<E> {
  (resp: E): void;
}
*/

abstract class UIAsyncInfo {

  //Requests
  protected readonly _remplaceAllReq:Writable<Promise<any>> = writable(null);
  protected readonly _addReq:Writable<Promise<any>> = writable(null);
  protected readonly _updateReq:Writable<Promise<any>> = writable(null);
  protected readonly _deleteReq:Writable<Array<Promise<any>>> = writable([]);
  
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
        this.cleanRequests();
      })
    ;
  }

  public cleanRequests() {
    this._remplaceAllReq.set(null);
    this._addReq.set(null);
    this._updateReq.set(null);
    this._deleteReq.set([])
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
  protected readonly _itemOnForm:Writable<E> = writable(null);
  protected readonly _itemToDelete:Writable<E> = writable(null);
  
  public constructor(value:E[], errorMsg:Writable<string>) {
    super(errorMsg);
    this._allItemsInUI.set(value);
    this._deleteReq.update(deleteRequestList => {
      for (let i = 0; i < value.length; i++) {
        deleteRequestList.push(null);
      }
      return deleteRequestList;
    })
  }

  public setItemOnForm(item:E):void {
    this._itemOnForm.set(item);
  }
  public getItemOnForm():E {
    return get(this._itemOnForm);
  }

  public updateCollectionAsync(req:Promise<E[]>, updateType:UIUpdateTypeCollection) {
    this.middlewareUIRequest(req);
    this.setRequestCollection(req, updateType);
    req.then((resp => {
      this.onResolveColletion(resp, updateType);
    }))
  }

  public updateItemAsync(item: E, req:Promise<E>, updateType:UIUpdateTypeItem):Promise<E> {
    this.middlewareUIRequest(req);
    this.setRequestItemOfCollection(item, req, updateType)
    req.then((resp => {
      this.onResolveItem(resp, updateType);
      this.cleanRequests();
    }))
    return req;
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
        this.setItemOnForm(itemResived);
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

      case UIUpdateTypeItem.UPDATE:
        this._allItemsInUI.update((items) => {
          const index = items.findIndex(p => p.id == this.getItemOnForm().id)
          items[index] = itemResived;
          return items;
        });
      break;

      default:
        throw new Error("case not defined");
    }

    return resolved;
  }

  private setRequestItemOfCollection(item: E, req:Promise<any>, updateType:UIUpdateTypeItem): boolean {
    let resolved = false;
    const index = (item != null) ? this.getIndexOfItem(item) : -1;
    
    switch (updateType) {
      case UIUpdateTypeItem.ADD_TO_START:
        this._addReq.set(req);
      break;

      case UIUpdateTypeItem.DELETE:
        this._deleteReq.update(deleteRequestList => {
          deleteRequestList[index] = req;
          return deleteRequestList;
        });
      break;

      case UIUpdateTypeItem.UPDATE:
        this._updateReq.set(req);
      break;
      

      default:
        throw new Error("case not defined");
    }
    return resolved;
  }

  private getIndexOfItem(item: Model) : number {
    return get(this._allItemsInUI).findIndex(c => c.id == item.id);
  }

  private setRequestCollection(req:Promise<any>, updateType:UIUpdateTypeCollection): boolean {
    let resolved = false;
      switch (updateType) {
        case UIUpdateTypeCollection.COLLECTION_ADD:
          this._addReq.set(req);
        break;
  
        case UIUpdateTypeCollection.COLLECTION_REMPLACE:
          this._remplaceAllReq.set(req);
        break;
  
        default:
          throw new Error("case not defined");
      }
      return resolved;
  }

  public getItemOnIndex(rowNum: number): E {
    return get(this._allItemsInUI)[rowNum]
  }

  public setCollection(newCollection: E[]):void {
    this._allItemsInUI.set(newCollection);
  }

  public setItemToDelete(toDel: E):void {
    this._itemToDelete.set(toDel);
  }
  public getItemToDelete():E {
    return get(this._itemToDelete);
  }

  public getItemsObserver():Readable<Array<E>> {
    return this._allItemsInUI;
  }

  public getRemplaceAllReq():Readable<Promise<Array<E>>> {
    return this._remplaceAllReq;
  }

  public getAddReq():Readable<Promise<Array<E>>> {
    return this._addReq;
  }

  public getUpdateReq():Readable<Promise<Array<E>>> {
    return this._updateReq;
  }

  public getDeleteReq():Readable<Array<Promise<E>>> {
    return this._deleteReq;
  }

}

export enum UIUpdateTypeItem {
  ADD_TO_START,
  DELETE,
  UPDATE,
}

export enum UIUpdateTypeCollection {
  COLLECTION_ADD,
  COLLECTION_REMPLACE,
}
