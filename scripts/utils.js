// takes an array of items and a function that returns a promise
// runs no more than concurrency requests at once
function mapConcurrent(items, fn, options = {}) {
  const { concurrency = 2, bail = false } = options;
  let index = 0;
  let counter = 0;
  let done = 0;
  let results = new Array(items.length);
  let stop = false;

  return new Promise((resolve, reject) => {
    function runNext() {
      let i = index;
      ++counter;
      const item = items[index++];

      fn(item)
        .then((val) => {
          results[i] = val;
        })
        .catch((err) => {
          results[i] = err;
          if (bail === true) {
            stop = true;
            reject(err);
          }
        })
        .finally(() => {
          ++done;
          --counter;
          run();
        });
    }

    function run() {
      // launch as many as we're allowed to
      while (!stop && counter < concurrency && index < items.length) {
        runNext();
      }

      // if all are done, then resolve parent promise with results
      if (done === items.length) {
        resolve(results);
      }
    }

    run();
  });
}

module.exports.mapConcurrent = mapConcurrent;
