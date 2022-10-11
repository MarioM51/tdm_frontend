import type { Readable, Writable } from "svelte/store";
import { get, writable } from "svelte/store";
import type Model from "../types/Model";
import type ServiceForUI from "./ServiceForUI";
import type CollectionUIReadable from "./CollectionUIReadable";
import UIWritable from "./UIWritable";


/**
 * Use _middelwareActionAsync from "UIWritable" that do common tasks like
 * show/hide loading, and show/hide error
 */

export default class CollectionUIWritable<E extends Model> extends UIWritable<E> implements CollectionUIReadable<E> {
  public readonly collection: Writable<Array<E>> = writable([]);

  constructor(serv: ServiceForUI<E>) {
    super(serv)
  }

  public getCollection(): Readable<E[]> {
    return this.collection;
  }

  public findAllAsync(): Promise<E[]> {
    const allReq = this._service.findAll();
    this.requestMany.set(allReq);
    this._middelwareActionAsync(allReq);
    allReq
      .then(all => {
        this.remplace(all);
      })
    return allReq;
  }

  public async updateAsync(newInfo: E): Promise<E> {
    const oldInfo = get(this.collection).find(i => i.id == newInfo.id);
    const updateReq = this._service.update(oldInfo, newInfo);
    this._middelwareActionAsync(updateReq);
    updateReq
      .then((updateResult) => {
        this.updateItem(updateResult);
      })
    return updateReq;
  }

  public removeAsync(toDel: E): Promise<E> {
    const deleteReq = this._service.remove(toDel);
    this._middelwareActionAsync(deleteReq);
    deleteReq.then(deleted => {
      this.removeItem(deleted);
    })
    return deleteReq;

  }

  public addAtStart(toAdd: E) {
    this.collection.update((items) => {
      items.unshift(toAdd);
      return items;
    });
  }

  public updateItem(toUpdate: E) {
    this.collection.update((items) => {
      const index = items.findIndex((i) => i.id == toUpdate.id);
      items[index] = toUpdate;
      return items;
    });
  }

  public removeItem(toDelete: E): void {
    this.collection.update((items) => {
      const filtered = items.filter((i) => i.id != toDelete.id);
      return filtered;
    });
  }

  public remplace(all: E[]): void {
    this.collection.set(all);
  }

}
