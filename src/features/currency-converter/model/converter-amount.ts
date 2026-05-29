export function sanitizeConverterAmount(value: string) {
  const normalizedValue = value.replace(/\s/g, '').replace(',', '.');
  const [integerPart = '', ...decimalParts] = normalizedValue.split('.');
  const integer = integerPart.replace(/\D/g, '');
  const decimal = decimalParts.join('').replace(/\D/g, '').slice(0, 2);
  const hasDecimalSeparator = normalizedValue.includes('.');

  if (!integer && !hasDecimalSeparator) {
    return '';
  }

  if (!hasDecimalSeparator) {
    return integer;
  }

  return `${integer}.${decimal}`;
}

export function formatConverterAmount(value: string) {
  if (!value) {
    return '';
  }

  const [integer = '', decimal] = value.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (value.endsWith('.')) {
    return `${formattedInteger}.`;
  }

  if (decimal !== undefined) {
    return `${formattedInteger}.${decimal}`;
  }

  return formattedInteger;
}

export function parseConverterAmount(value: string) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}
