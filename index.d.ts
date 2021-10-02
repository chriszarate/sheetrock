type GoogleDataTableCellValue = boolean | number | number[] | string | null;

type GoogleDataTableCellValueType =
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'number'
  | 'string'
  | 'timeofday';

type GoogleDataTableCustomValues = { [key]: string };

type GoogleDataTableCell = {
  f?: string;
  p?: GoogleDataTableCustomValues;
  v: GoogleDataTableCellValue;
} | null;

type GoogleDataTableColumn = {
  id: string;
  label: string;
  p?: GoogleDataTableCustomValues;
  pattern?: string;
  type: GoogleDataTableCellValueType;
};

type GoogleDataTableRow = {
  c: GoogleDataTableCell[];
};

type GoogleDataTableResponse = {
  reqId: string;
  sig: string;
  status: string;
  table: {
    cols: GoogleDataTableColumn[];
    rows: GoogleDataTableRow[];
    parsedNumHeaders: number;
  };
  version: string;
};

type SheetrockOptions = {
  debug?: boolean;
  query?: string;
  url: string;
};

type SheetrockHeader = {
  id: string;
  label: string;
};

type SheetrockCell = SheetrockHeader & {
  formattedValue: string;
  styles: { [key: string]: string };
  value: boolean | Date | number | string | null;
};

type SheetrockRow = {
  [key: string]: SheetrockCell;
};

type SheetrockResponse = {
  done: boolean;
  meta: {
    elapsedTime: number;
    offset: number;
    totalRows: number;
    version: string;
  };
  rows: SheetrockRow[];
  table: {
    headerRows: string;
    bodyRows: string;
  };
};
