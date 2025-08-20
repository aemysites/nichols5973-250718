/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main text container
  const textContainer = element.querySelector('.rich-text-basic__text') || element;
  const allNodes = Array.from(textContainer.childNodes);
  
  // Find the columns table
  const columnsTable = textContainer.querySelector('table');
  let columnCells = [];
  if (columnsTable) {
    const row = columnsTable.querySelector('tr');
    if (row) {
      // For each <td> in the row, grab the contents so we avoid nested <td>
      columnCells = Array.from(row.children).map(td => Array.from(td.childNodes));
    }
  }

  // Collect introductory nodes (all before columnsTable)
  const introNodes = [];
  for (const node of allNodes) {
    if (node === columnsTable) break;
    // Skip empty paragraphs and whitespace
    if (
      (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && !node.textContent.trim()) ||
      (node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    ) continue;
    introNodes.push(node);
  }
  // Only keep if there is real content
  const hasIntro = introNodes.length > 0 && introNodes.some(n => n.textContent && n.textContent.trim().length > 0);

  // Compose table: single header row, then one row with multiple columns
  const rows = [];
  rows.push(['Columns (columns109)']); // header row: single column

  // Second row: intro cell (if applicable), followed by each column cell
  const contentRow = [];
  if (hasIntro) {
    contentRow.push(introNodes);
  }
  if (columnCells.length > 0) {
    contentRow.push(...columnCells);
  } else {
    // fallback: all main nodes as one cell
    contentRow.push(allNodes);
  }
  rows.push(contentRow);

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
