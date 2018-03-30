function range(start, end, step) {
  if (step == null) step = 1;
  var array = [];

  if (step > 0) {
    for (var i = start; i <= end; i += step)
      array.push(i);
  } else {
    for (var i = start; i >= end; i += step)
      array.push(i);
  }
  return array;
}

function sum(array) {
  var total = 0;
  for (var i = 0; i < array.length; i++)
    total += array[i];
  return total;
}
