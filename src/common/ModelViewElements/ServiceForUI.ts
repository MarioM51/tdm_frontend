export default interface ServiceForUI<E> {
  add(toAdd: E): Promise<E>

  update(_: E, newInfo: E): Promise<E>

  remove(toRemove: E): Promise<E>

  findAll(): Promise<E[]>
}