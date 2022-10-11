export interface VoidAction {
  (): void;
}

export interface AsyncAction {
  (): Promise<any>;
}

export interface ResultAction<E> {
  (result: E): void;
}
