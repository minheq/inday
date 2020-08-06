export interface Option<TValue = any> {
  value: TValue;
  label: string;
  disabled?: boolean;
}
