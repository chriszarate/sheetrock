import Sheetrock from '../../dist/src/index.js';

const debug = true;
const url =
  'https://docs.google.com/spreadsheets/d/1OwVM0wzsyuuntDkqFveQhYOwC8u_NFwdPGX60aZxr_Q/edit?usp=sharing';

function wrapTag(str, tagName, attrs = '') {
  const openTag = `${tagName} ${attrs}`.trim();
  return `<${openTag}>${str}</${tagName}>`;
}

function formatAsTable(headers, rows) {
  const headerRow = headers
    .map((header) => wrapTag(header.label, 'th', 'scope="col"'))
    .join('');
  const header = wrapTag(wrapTag(headerRow, 'tr'), 'thead');

  const bodyRows = rows
    .map((row) =>
      Object.values(row)
        .map((cell) => wrapTag(cell.formattedValue, 'td'))
        .join('')
    )
    .join('');
  const body = wrapTag(bodyRows, 'tbody');

  return wrapTag(header + body, 'table');
}

async function main() {
  const query = new Sheetrock({ debug, url });

  const { rows, headers } = await query.get();

  console.log(formatAsTable(headers, rows));
}

main();
