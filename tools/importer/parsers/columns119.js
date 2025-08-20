/* global WebImporter */
export default function parse(element, { document }) {
  // The header must match the example exactly
  const headerRow = ['Columns (columns119)'];

  // Get all columns (each ._1-3-flex may or may not have .last-sl-1-3)
  const columns = element.querySelectorAll(':scope > div._1-3-flex');

  // Prepare the content for each column
  const columnCells = [];
  columns.forEach((col) => {
    // Find the pie chart SVG (inside .pie-block-i-tt > .lottie-tt > svg)
    let svg = null;
    const pieBlock = col.querySelector('.pie-block-i-tt');
    if (pieBlock) {
      const lottieDiv = pieBlock.querySelector('.lottie-tt');
      if (lottieDiv) {
        svg = lottieDiv.querySelector('svg');
      }
    }
    // Find the description text (div.tt-para)
    const desc = col.querySelector('.tt-para');
    // Compose cell content, omitting missing items
    const cellContent = [];
    if (svg) cellContent.push(svg);
    if (desc) cellContent.push(desc);
    // If both SVG and desc are missing, put an empty string (edge case)
    if (!svg && !desc) {
      cellContent.push('');
    }
    columnCells.push(cellContent);
  });

  // Ensure that the number of columns matches the number found
  // and that the table matches the Columns block structure as in the markdown
  const tableData = [headerRow, columnCells];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
