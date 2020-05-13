export interface ElementProps<T = any> {
  children: React.ReactNode;
  attributes: unknown;
  element: T;
}
