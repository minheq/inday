# Inday

## Todo

- Add active prop
- Fix opacity
- Replace scale animation with shadow

```js
$('[playsinline]').style = 'position:relative; z-index:99999';
// Try to trick the site into thinking it's never hidden
Object.defineProperty(document, 'hidden', { value: false, writable: false });
Object.defineProperty(document, 'visibilityState', {
  value: 'visible',
  writable: false,
});
Object.defineProperty(document, 'webkitVisibilityState', {
  value: 'visible',
  writable: false,
});
document.dispatchEvent(new Event('visibilitychange'));
document.hasFocus = function () {
  return true;
};

// visibilitychange events are captured and stopped
document.addEventListener(
  'visibilitychange',
  function (e) {
    e.stopImmediatePropagation();
  },
  true,
  true,
);
```
