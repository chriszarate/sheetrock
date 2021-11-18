export function ensureInteger(maybeInt: any): number {
  if (Number.isInteger(maybeInt)) {
    return maybeInt;
  }

  return parseInt(maybeInt, 10) || 0;
}

export function getCellValue(
  value: GoogleDataTableCellValue
): SheetrockCellValue {
  const dateRegExp = /^Date\(((\d+,){2,}\d+)\)$/;

  if (typeof value === 'string' && dateRegExp.test(value)) {
    const [, stringArgs] = value.match(dateRegExp) || [];
    const numArgs: number[] = stringArgs.split(',').map(Number);
    const [Y, M, D, h = 12, m = 0, s = 0] = numArgs;

    return new Date(Date.UTC(Y, M, D, h, m, s));
  }

  if (Array.isArray(value)) {
    if (value.length >= 2) {
      const [h, m, s = 0, ms = 0] = value;

      return new Date(Date.UTC(1970, 0, 1, h, m, s, ms));
    }

    return value.join(',');
  }

  return value;
}

export function wrapTag(
  str: string,
  tagName: string,
  attrs: string = ''
): string {
  const openTag = `${tagName} ${attrs}`.trim();
  return `<${openTag}>${str}</${tagName}>`;
}
