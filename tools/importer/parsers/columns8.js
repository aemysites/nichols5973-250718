/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns8)
  const headerRow = ['Columns (columns8)'];

  // Get all direct children with class '_1-3-flex' (each is a column)
  const columns = Array.from(element.querySelectorAll(':scope > ._1-3-flex'));

  // For each column, extract only the relevant text and inline elements
  const cells = columns.map(col => {
    // Find the number and percent
    const number = col.querySelector('.counter5')?.textContent.trim() || '';
    const percent = col.querySelector('.sl-big-data')?.textContent.trim() || '';
    // Find the description
    const descEl = col.querySelector('.sl-paragraph-center');
    let desc = '';
    if (descEl) {
      // Get all text, replace <br> with space
      desc = Array.from(descEl.childNodes).map(node => {
        if (node.nodeType === 3) return node.textContent;
        if (node.nodeName === 'BR') return ' ';
        return '';
      }).join('').replace(/ +/g, ' ').trim();
    }
    // Compose cell content: number + percent (as inline), then description below
    const cell = document.createElement('div');
    const numSpan = document.createElement('span');
    numSpan.textContent = number;
    const percentSpan = document.createElement('span');
    percentSpan.textContent = percent;
    numSpan.style.fontWeight = 'bold';
    numSpan.style.fontSize = '2em';
    percentSpan.style.fontSize = '1em';
    percentSpan.style.marginLeft = '0.1em';
    cell.appendChild(numSpan);
    cell.appendChild(percentSpan);
    cell.appendChild(document.createElement('br'));
    const descP = document.createElement('p');
    descP.textContent = desc;
    cell.appendChild(descP);
    return cell;
  });

  // Table rows: header, then one row with all columns
  const tableRows = [headerRow, cells];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
