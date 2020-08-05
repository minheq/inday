export const css = (
  ...styles: { [key: string]: React.CSSProperties }[]
): React.CSSProperties => {
  return Object.assign({}, ...styles);
};

css.create = <P extends StyleObject>(styleObject: P) => {
  return (
    ...keys: (keyof P | false | undefined | null)[]
  ): React.CSSProperties => {
    let style = {};

    for (const key of keys) {
      if (key === false || key === undefined || key === null) {
        continue;
      }
      Object.assign(style, styleObject[key]);
    }

    return style;
  };
};

interface StyleObject {
  [key: string]: React.CSSProperties;
}
