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
