function* primes() {
  for (let n = 2;; n++) {
    let skip = false;
    for (let d = 2; d < n; d++) {
      if (n % d == 0) {
        skip = true;
        break;
      }
    }
    if (!skip) yield n;
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
