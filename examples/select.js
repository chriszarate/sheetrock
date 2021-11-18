const Sheetrock = require('../dist/sheetrock.min');

const query = new Sheetrock({
  debug: true,
  url: 'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0',
});

async function fetch(pageSize = 10) {
  const { rows, ...rest } = await query.select('A,B,I').where('I > 20').limit(pageSize).get();
  console.log(rows[0], rows.length, rest.headers);
}

async function main() {
  await fetch(10);
  await fetch(10);
  await fetch(10);
  await fetch(10);
}

main();

