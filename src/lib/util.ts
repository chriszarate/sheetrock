import { throwInvalidUrl } from './error';

function wrapTag(value: string, tag: string): string {
  return `<${tag}>${value}</${tag}>`;
}

function formatTableCell(cell: SheetrockCell): string {
  const value = cell.formattedValue || `${cell.value || ''}`;
  return wrapTag(value, 'td');
}

export function formatTableRow(row: SheetrockRow): string {
  const rowHtml = Object.values(row).map(formatTableCell).join('');
  return wrapTag(rowHtml, 'tr');
}

function getMatch(input: string, pattern: string): string | null {
  const regExp = new RegExp(pattern, 'i');
  const match = input.match(regExp);
  if (match) {
    return match[1];
  }

  return null;
}

export function getEndpoint(url: string): string {
  const key2010 = getMatch(url, 'key=([^&#]+)');
  const gid = getMatch(url, 'gid=([^/&#]+)') || 0;

  if (key2010) {
    return [
      'https://spreadsheets.google.com/tq',
      `?key=${encodeURIComponent(key2010)}`,
      `&gid=${encodeURIComponent(gid)}`,
    ].join('');
  }

  const key2014 = getMatch(url, 'spreadsheets/d/([^/#]+)');

  if (key2014) {
    return [
      `https://docs.google.com/spreadsheets/d/${key2014}/gviz/tq`,
      `?gid=${encodeURIComponent(gid)}`,
    ].join('');
  }

  return throwInvalidUrl();
}
