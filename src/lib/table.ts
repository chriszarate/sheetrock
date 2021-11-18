import Debug from './debug';
import Response from './response';
import { throwInvalidTableElement } from './error';

export default class Table {
  debug: Debug;

  element: HTMLTableElement | null;

  constructor(table: HTMLTableElement | null, debug: boolean) {
    if (table && !(table instanceof HTMLTableElement)) {
      throwInvalidTableElement();
    }

    this.debug = new Debug(debug);
    this.element = table;

    this.debug.logTable(table);
  }

  updateBody(response: Response): void {
    // No table.
    if (!this.element) {
      return;
    }

    const tbody = document.createDocumentFragment();

    response.rows.forEach((row) => {
      const tr = document.createElement('tr');
      Object.values(row).forEach((cell) => {
        const td = document.createElement('td');
        td.textContent = cell.formattedValue;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    this.debug.logTableBodyUpdate(response.rows.length);

    // Append to existing tbody, if present.
    const existingTbody = this.element.querySelector('tbody');
    if (existingTbody) {
      existingTbody.appendChild(tbody);
      return;
    }

    // Create tbody.
    this.debug.logTableBodyCreation();
    const newTbody = document.createElement('tbody');
    newTbody.appendChild(tbody);
    this.element.appendChild(newTbody);
  }

  updateHeader(response: Response): void {
    // No table.
    if (!this.element) {
      return;
    }

    // Header already exists.
    if (this.element.querySelector('thead')) {
      return;
    }

    // Create thead.
    this.debug.logTableHeaderCreation();

    const thead: HTMLTableElement['tHead'] = document.createElement('thead');

    response.headers.forEach((header) => {
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = header.label || header.id;

      thead.appendChild(th);
    });

    this.debug.logTableHeaderUpdate(response.headers.length);
    this.element.appendChild(thead);
  }
}
