import { get, type Readable, type Writable } from "svelte/store";
import { writable } from "svelte/store";
import type NotifierViewModel from "../notifications/NotifierViewModel";
import type Model from "../types/Model";
import type FormCollectionUIReadable from "./FormCollectionUIReadable";
import type ServiceForUI from "./ServiceForUI";
import type CollectionUIWritable from "./CollectionUIWritable";
import UIWritable from "./UIWritable";


export default class FormCollectionUIWritable<E extends Model> extends UIWritable<E> implements FormCollectionUIReadable<E> {

  public readonly isOpen: Writable<boolean> = writable(false);
  public readonly value: Writable<E> = writable(null);
  public readonly message: Writable<string> = writable(null);

  private readonly _ItemsUI: CollectionUIWritable<E> = null;
  private readonly _entityName: string;

  constructor(collection: CollectionUIWritable<E>, service: ServiceForUI<E>, entityName: string) {
    super(service);
    this._ItemsUI = collection;
    this._entityName = entityName;
  }

  public add(): Promise<any> {
    const itemToAdd = get(this.value);
    const req = this._service.add(itemToAdd);
    this.requestOne.set(req);
    this._middelwareActionAsync(req)
    req
      .then(added => {
        this._ItemsUI.addAtStart(added);
        //this._notifier.addNotification(`${this._entityName} agreado`, "success");
        this.isOpen.set(false);
      })
      ;
    return req
  }

  public update(): Promise<E> {
    const newInfo = get(this.value);
    if (newInfo.id <= 0) {
      throw Error("item id to update not found");
    }
    const oldInfo = get(this._ItemsUI.collection).find(i => i.id == newInfo.id);

    const updateReq = this._service.update(oldInfo, newInfo);
    this._middelwareActionAsync(updateReq);
    this.requestOne.set(updateReq);
    updateReq
      .then(updateResult => {
        this._ItemsUI.updateItem(updateResult);
        //this._notifier.addNotification(`${this._entityName} editado`, "success");
        this.isOpen.set(false);
      })
      ;
    return updateReq;
  }

  public remove(): Promise<E> {
    const toDelete = get(this.value);
    const deleteReq = this._service.remove(toDelete);
    this._middelwareActionAsync(deleteReq);
    this.requestOne.set(deleteReq)
    deleteReq
      .then(deleted => {
        this._ItemsUI.removeItem(deleted);
        //this._notifier.addNotification(`${this._entityName} eliminado`, "success");
        this.isOpen.set(false);
      })
    return deleteReq;
  }

  public close(): void {
    this.isOpen.set(false);
  }

  public open(itemToShow: E) {
    this.isOpen.set(true);
    this.value.set(itemToShow);
  }

}