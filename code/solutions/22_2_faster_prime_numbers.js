function* primes() {
  let found = [];
  for (let n = 2;; n++) {
    let skip = false, root = Math.sqrt(n);
    for (let prev of found) {
      if (prev > root) {
        break;
      } else if (n % prev == 0) {
        skip = true;
        break;
      }
    }
    if (!skip) {
      found.push(n);
      yield n;
    }
  }
}

function measurePrimes() {
  let iter = primes(), t0 = Date.now();
  for (let i = 0; i < 10000; i++) {
    iter.next();
  }
  console.log(`Took ${Date.now() - t0}ms`);
}

measurePrimes();
