const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { join, resolve, relative } = require('path');

const isHidden = /(^|[\\\/])\.[^\\\/\.]/g;
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

let CACHE = {};
const CHARS = { '{': '}', '(': ')', '[': ']' };
const STRICT = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\)|(\\).|([@?!+*]\(.*\)))/;
const RELAXED = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;
const isWin = process.platform === 'win32';
const SEP = isWin ? `\\\\+` : `\\/`;
const SEP_ESC = isWin ? `\\\\` : `/`;
const GLOBSTAR = `((?:[^/]*(?:/|$))*)`;
const WILDCARD = `([^/]*)`;
const GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}]*(?:${SEP_ESC}|$))*)`;
const WILDCARD_SEGMENT = `([^${SEP_ESC}]*)`;

/**
 * Detect if a string cointains glob
 * @param {String} str Input string
 * @param {Object} [options] Configuration object
 * @param {Boolean} [options.strict=true] Use relaxed regex if true
 * @returns {Boolean} true if string contains glob
 */
function isglob(str, { strict = true } = {}) {
  if (str === '') return false;
  let match,
    rgx = strict ? STRICT : RELAXED;

  while ((match = rgx.exec(str))) {
    if (match[2]) return true;
    let idx = match.index + match[0].length;

    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    let open = match[1];
    let close = open ? CHARS[open] : null;
    if (open && close) {
      let n = str.indexOf(close, idx);
      if (n !== -1) idx = n + 1;
    }

    str = str.slice(idx);
  }
  return false;
}

/**
 * Find the static part of a glob-path,
 * split path and return path part
 * @param {String} str Path/glob string
 * @returns {String} static path section of glob
 */
function parent(str, { strict = false } = {}) {
  str = path.normalize(str).replace(/\/|\\/, '/');

  // special case for strings ending in enclosure containing path separator
  if (/[\{\[].*[\/]*.*[\}\]]$/.test(str)) str += '/';

  // preserves full path in case of trailing path separator
  str += 'a';

  do {
    str = path.dirname(str);
  } while (isglob(str, { strict }) || /(^|[^\\])([\{\[]|\([^\)]+$)/.test(str));

  // remove escape chars and return result
  return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, '$1');
}

/**
 * Parse a glob path, and split it by static/glob part
 * @param {String} pattern String path
 * @param {Object} [opts] Options
 * @param {Object} [opts.strict=false] Use strict parsing
 * @returns {Object} object with parsed path
 */
function globalyzer(pattern, opts = {}) {
  let base = parent(pattern, opts);
  let isGlob = isglob(pattern, opts);
  let glob;

  if (base != '.') {
    glob = pattern.substr(base.length);
    if (glob.startsWith('/')) glob = glob.substr(1);
  } else {
    glob = pattern;
  }

  if (!isGlob) {
    base = path.dirname(pattern);
    glob = base !== '.' ? pattern.substr(base.length) : pattern;
  }

  if (glob.startsWith('./')) glob = glob.substr(2);
  if (glob.startsWith('/')) glob = glob.substr(1);

  return { base, glob, isGlob };
}

/**
 * Convert any glob pattern to a JavaScript Regexp object
 * @param {String} glob Glob pattern to convert
 * @param {Object} opts Configuration object
 * @param {Boolean} [opts.extended=false] Support advanced ext globbing
 * @param {Boolean} [opts.globstar=false] Support globstar
 * @param {Boolean} [opts.strict=true] be laissez faire about mutiple slashes
 * @param {Boolean} [opts.filepath=''] Parse as filepath for extra path related features
 * @param {String} [opts.flags=''] RegExp globs
 * @returns {Object} converted object with string, segments and RegExp object
 */
function globrex(
  glob,
  {
    extended = false,
    globstar = false,
    strict = false,
    filepath = false,
    flags = '',
  } = {},
) {
  let regex = '';
  let segment = '';
  let path = { regex: '', segments: [] };

  // If we are doing extended matching, this boolean is true when we are inside
  // a group (eg {*.html,*.js}), and false otherwise.
  let inGroup = false;
  let inRange = false;

  // extglob stack. Keep track of scope
  const ext = [];

  // Helper function to build string and segments
  function add(str, { split, last, only } = {}) {
    if (only !== 'path') regex += str;
    if (filepath && only !== 'regex') {
      path.regex += str === '\\/' ? SEP : str;
      if (split) {
        if (last) segment += str;
        if (segment !== '') {
          if (!flags.includes('g')) segment = `^${segment}$`; // change it 'includes'
          path.segments.push(new RegExp(segment, flags));
        }
        segment = '';
      } else {
        segment += str;
      }
    }
  }

  let c, n;
  for (let i = 0; i < glob.length; i++) {
    c = glob[i];
    n = glob[i + 1];

    if (['\\', '$', '^', '.', '='].includes(c)) {
      add(`\\${c}`);
      continue;
    }

    if (c === '/') {
      add(`\\${c}`, { split: true });
      if (n === '/' && !strict) regex += '?';
      continue;
    }

    if (c === '(') {
      if (ext.length) {
        add(c);
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === ')') {
      if (ext.length) {
        add(c);
        let type = ext.pop();
        if (type === '@') {
          add('{1}');
        } else if (type === '!') {
          add('([^/]*)');
        } else {
          add(type);
        }
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '|') {
      if (ext.length) {
        add(c);
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '+') {
      if (n === '(' && extended) {
        ext.push(c);
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '@' && extended) {
      if (n === '(') {
        ext.push(c);
        continue;
      }
    }

    if (c === '!') {
      if (extended) {
        if (inRange) {
          add('^');
          continue;
        }
        if (n === '(') {
          ext.push(c);
          add('(?!');
          i++;
          continue;
        }
        add(`\\${c}`);
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '?') {
      if (extended) {
        if (n === '(') {
          ext.push(c);
        } else {
          add('.');
        }
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '[') {
      if (inRange && n === ':') {
        i++; // skip [
        let value = '';
        while (glob[++i] !== ':') value += glob[i];
        if (value === 'alnum') add('(\\w|\\d)');
        else if (value === 'space') add('\\s');
        else if (value === 'digit') add('\\d');
        i++; // skip last ]
        continue;
      }
      if (extended) {
        inRange = true;
        add(c);
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === ']') {
      if (extended) {
        inRange = false;
        add(c);
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '{') {
      if (extended) {
        inGroup = true;
        add('(');
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '}') {
      if (extended) {
        inGroup = false;
        add(')');
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === ',') {
      if (inGroup) {
        add('|');
        continue;
      }
      add(`\\${c}`);
      continue;
    }

    if (c === '*') {
      if (n === '(' && extended) {
        ext.push(c);
        continue;
      }
      // Move over all consecutive "*"'s.
      // Also store the previous and next characters
      let prevChar = glob[i - 1];
      let starCount = 1;
      while (glob[i + 1] === '*') {
        starCount++;
        i++;
      }
      let nextChar = glob[i + 1];
      if (!globstar) {
        // globstar is disabled, so treat any number of "*" as one
        add('.*');
      } else {
        // globstar is enabled, so determine if this is a globstar segment
        let isGlobstar =
          starCount > 1 && // multiple "*"'s
          (prevChar === '/' || prevChar === undefined) && // from the start of the segment
          (nextChar === '/' || nextChar === undefined); // to the end of the segment
        if (isGlobstar) {
          // it's a globstar, so match zero or more path segments
          add(GLOBSTAR, { only: 'regex' });
          add(GLOBSTAR_SEGMENT, { only: 'path', last: true, split: true });
          i++; // move over the "/"
        } else {
          // it's not a globstar, so only match one path segment
          add(WILDCARD, { only: 'regex' });
          add(WILDCARD_SEGMENT, { only: 'path' });
        }
      }
      continue;
    }

    add(c);
  }

  // When regexp 'g' flag is specified don't
  // constrain the regular expression with ^ & $
  if (!flags.includes('g')) {
    regex = `^${regex}$`;
    segment = `^${segment}$`;
    if (filepath) path.regex = `^${path.regex}$`;
  }

  const result = { regex: new RegExp(regex, flags) };

  // Push the last segment
  if (filepath) {
    path.segments.push(new RegExp(segment, flags));
    path.regex = new RegExp(path.regex, flags);
    path.globstar = new RegExp(
      !flags.includes('g') ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT,
      flags,
    );
    result.path = path;
  }

  return result;
}

async function walk(output, prefix, lexer, opts, dirname = '', level = 0) {
  const rgx = lexer.segments[level];
  const dir = resolve(opts.cwd, prefix, dirname);
  const files = await readdir(dir);
  const { dot, filesOnly } = opts;

  let i = 0,
    len = files.length,
    file;
  let fullpath, relpath, stats, isMatch;

  for (; i < len; i++) {
    fullpath = join(dir, (file = files[i]));
    relpath = dirname ? join(dirname, file) : file;
    if (!dot && isHidden.test(relpath)) continue;
    isMatch = lexer.regex.test(relpath);

    if ((stats = CACHE[relpath]) === void 0) {
      CACHE[relpath] = stats = fs.lstatSync(fullpath);
    }

    if (!stats.isDirectory()) {
      isMatch && output.push(relative(opts.cwd, fullpath));
      continue;
    }

    if (rgx && !rgx.test(file)) continue;
    !filesOnly && isMatch && output.push(join(prefix, relpath));

    await walk(
      output,
      prefix,
      lexer,
      opts,
      relpath,
      rgx && rgx.toString() !== lexer.globstar && level + 1,
    );
  }
}

/**
 * Find files using bash-like globbing.
 * All paths are normalized compared to node-glob.
 * @param {String} str Glob string
 * @param {String} [options.cwd='.'] Current working directory
 * @param {Boolean} [options.dot=false] Include dotfile matches
 * @param {Boolean} [options.absolute=false] Return absolute paths
 * @param {Boolean} [options.filesOnly=false] Do not include folders if true
 * @param {Boolean} [options.flush=false] Reset cache object
 * @returns {Array} array containing matching files
 */
module.exports = async function (str, opts = {}) {
  if (!str) return [];

  let glob = globalyzer(str);

  opts.cwd = opts.cwd || '.';

  if (!glob.isGlob) {
    try {
      let resolved = resolve(opts.cwd, str);
      let dirent = await stat(resolved);
      if (opts.filesOnly && !dirent.isFile()) return [];

      return opts.absolute ? [resolved] : [str];
    } catch (err) {
      if (err.code != 'ENOENT') throw err;

      return [];
    }
  }

  if (opts.flush) CACHE = {};

  let matches = [];
  const { path } = globrex(glob.glob, {
    filepath: true,
    globstar: true,
    extended: true,
  });

  path.globstar = path.globstar.toString();
  await walk(matches, glob.base, path, opts, '.', 0);

  return opts.absolute ? matches.map((x) => resolve(opts.cwd, x)) : matches;
};
