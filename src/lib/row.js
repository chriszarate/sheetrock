import { getCellValue } from './util';

class Row {
  constructor(number, cellsArray, labels) {
    this.num = number;
    this.cellsArray = cellsArray.map(getCellValue);
    this.labels = labels;
  }

  // Get an object with labels as keys.
  get cells() {
    const cellsObj = {};
    this.labels.forEach((label, index) => {
      cellsObj[label] = this.cellsArray[index];
    });
    return cellsObj;
  }
}

export default Row;
