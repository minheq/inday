export const Pathname = {
  match: <T extends Record<string, string>>(
    pathname: string,
    str: string,
  ): T | false => {
    pathname = trimTrailingSlash(pathname);
    pathname = pathname.toLowerCase();
    str = trimTrailingSlash(str);
    str = str.toLowerCase();

    // From /p/p2/:id/:id2 to ['p', 'p2', ':id', 'id2']
    const paths = pathname.split('/');
    // From /p/p2/1/2 to ['p', 'p2', '1', '2']
    const strs = str.split('/');

    const params: Record<string, string> = {};

    for (let i = 0; i < paths.length; i++) {
      const s = strs[i];
      const p = paths[i];

      if (s === undefined) {
        return false;
      }

      if (p.includes(':') === false) {
        if (p === s) {
          continue;
        }

        return false;
      }

      const param = p.substr(1);
      params[param] = s;
    }

    return params as T;
  },
  compile: <T extends Record<string, string>>(
    pathname: string,
    params: T,
  ): string => {
    pathname = trimTrailingSlash(pathname);
    pathname = pathname.toLowerCase();

    const paths = pathname.split('/');
    const s: string[] = [];

    for (let i = 0; i < paths.length; i++) {
      const p = paths[i];

      if (p.includes(':') === false) {
        s.push(p);
        continue;
      }

      const param = p.substr(1);

      if (params[param] === undefined) {
        break;
      }

      s.push(params[param]);
    }

    console.log(s.join('/'));

    return '/' + s.join('/');
  },
};

function trimTrailingSlash(str: string) {
  str = str.endsWith('/') ? str.slice(0, -1) : str;
  str = str.startsWith('/') ? str.slice(1) : str;

  return str;
}
