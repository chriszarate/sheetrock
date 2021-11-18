const Sheetrock = require('../dist/sheetrock.min');

const query = new Sheetrock({
  debug: true,
  url: 'https://docs.google.com/spreadsheets/d/1OwVM0wzsyuuntDkqFveQhYOwC8u_NFwdPGX60aZxr_Q/edit?usp=sharing',
  // url: 'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0',
});

async function fetch(pageSize = 10) {
  const { rows, ...rest } = await query.limit(pageSize).get();
  console.log(rest);
  rows.map((row) => console.log(row));
}

async function fetchRaw(pageSize = 10) {
  const { table, ...rest } = await query.limit(pageSize).getRaw();
  console.log(rest);
  const { cols, rows, ...other } = table;
  console.log(other);
  cols.map((col) => console.log(col));
  rows.map(({ c }) => console.log(c));
}

async function main() {
  await fetch();
  await fetch();
}

main();
