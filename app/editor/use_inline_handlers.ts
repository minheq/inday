import { InlineType } from './element';

const INLINES: { [key: string]: true } = {
  link: true,
};

export function isInline(format: string): format is InlineType {
  if (INLINES[format]) {
    return true;
  }

  return false;
}
