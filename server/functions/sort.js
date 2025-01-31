function sort(arr) {
  let changed = true;
  while (changed) {
    let noChanges = true;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i + 1].likes.length > arr[i].likes.length) {
        const swaper = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = swaper;
        noChanges = false;
      }
    }
    if (noChanges) {
      changed = false;
    }
  }
  return arr;
}

module.exports = sort;
