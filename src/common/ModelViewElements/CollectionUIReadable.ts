import type { Readable } from "svelte/store";

export default interface UICollectionReadable<E> {
  findAllAsync(): Promise<E[]>
  updateAsync(to: E): Promise<E>;
  removeAsync(toDel: E): Promise<E>;

  get collection(): Readable<E[]>
  get requestMany(): Readable<Promise<E[]>>
  get errorMessage(): Readable<string>
}
