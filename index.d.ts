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

type GoogleApiQuery = {
  select?: string;
  where?: string;
  groupBy?: string;
  pivot?: string;
  orderBy?: string;
  limit: number;
  offset: number;
  label?: string;
  format?: string;
  options?: string;
};

type SheetrockOptions = {
  debug?: boolean;
  url: string;
};

type SheetrockHeader = {
  id: string;
  label: string;
};

type SheetrockCellValue = boolean | Date | number | string | null;

type SheetrockCell = SheetrockHeader & {
  formattedValue: string;
  styles: { [key: string]: string };
  value: SheetrockCellValue;
};

type SheetrockRow = {
  [key: string]: SheetrockCell;
};

type SheetrockResponse = {
  headers: SheetrockHeader[];
  meta: {
    done: boolean;
    offset: number;
    version: string;
  };
  rows: SheetrockRow[];
};
