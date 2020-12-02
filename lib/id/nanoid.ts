// This alphabet uses `A-Za-z0-9` symbols.
export const defaultAlphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate URL-friendly unique ID. This method uses the non-secure
 * predictable random generator with bigger collision probability.
 *
 * @param size Size of the ID. The default size is 18.
 * @returns A random string.
 */
export function nanoid(alphabet = defaultAlphabet, size = 18): string {
  let id = '';
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size;
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += alphabet[(Math.random() * alphabet.length) | 0];
  }
  return id;
}
