function mergeSortedArrays(arr1: Song[], arr2: Song[]) {
  let mergedArray = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i].first_letter <= arr2[j].first_letter) {
      mergedArray.push(arr1[i]);
      i++;
    } else {
      mergedArray.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    mergedArray.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    mergedArray.push(arr2[j]);
    j++;
  }

  return mergedArray;
}

export function sortMultiSongLists(arrays: Song[][]) {
  if (arrays.length === 0) {
    return [];
  }
  let mergedResult = arrays[0];
  for (let i = 1; i < arrays.length; i++) {
    mergedResult = mergeSortedArrays(mergedResult, arrays[i]);
  }
  return mergedResult;
}
