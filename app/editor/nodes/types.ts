export interface ElementProps<T = any> {
  children: React.ReactNode;
  attributes: {
    'data-slate-node': 'element';
    'data-slate-inline'?: true;
    'data-slate-void'?: true;
    dir?: 'rtl';
    ref: any;
  };
  element: T;
}
