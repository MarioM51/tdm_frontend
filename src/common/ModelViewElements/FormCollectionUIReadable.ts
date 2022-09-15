import type { Readable } from "svelte/store";

export default interface FormCollectionUIReadable<E> {
  open(itemToShow: E)
  add(): Promise<E>
  update(): Promise<E>
  remove(): Promise<E>
  close(): void;

  get isOpen(): Readable<boolean>
  get requestOne(): Readable<Promise<E>>
  get value(): Readable<E>
}