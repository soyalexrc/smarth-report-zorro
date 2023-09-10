export function handleCustomCurrencyFormat(amount: string | number, numberType = '') {
  let amountNumber;
  let amountString= typeof amount === 'number' ? amount.toString() : amount
  if (!numberType) {
    return amountString.replace('.', ',');
  }
  if (numberType === 'double' ) {
    return parseFloat(amountString);
  } else {
    return ''
  }
}

export function groupBy(list: any[], keyGetter: any) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
