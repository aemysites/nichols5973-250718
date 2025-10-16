/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards61) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards61)'];

  // Find all card items within the parent container
  const cardNodes = element.querySelectorAll('.testimonial-item-container-internal');

  const rows = [];
  cardNodes.forEach((card) => {
    // --- Image cell ---
    // The image is inside .testimonial-item-image-internal > img
    const imgContainer = card.querySelector('.testimonial-item-image-internal');
    let imgEl = imgContainer ? imgContainer.querySelector('img') : null;
    // Defensive: only push image if found
    let imageCell = imgEl || '';

    // --- Text cell ---
    // The text is inside .quotation-container
    const quoteContainer = card.querySelector('.quotation-container');
    let textCellContent = [];
    if (quoteContainer) {
      // Author name (heading, sometimes a link)
      const authorLink = quoteContainer.querySelector('.author-link');
      if (authorLink) {
        // Use the anchor as the heading (preserves link)
        // Add strong styling for heading effect
        const heading = document.createElement('strong');
        heading.appendChild(authorLink);
        textCellContent.push(heading);
      }
      // Author statement (description)
      const statement = quoteContainer.querySelector('.author-statement');
      if (statement) {
        textCellContent.push(statement);
      }
    }
    // Defensive: if no content, push empty string
    if (textCellContent.length === 0) {
      textCellContent = [''];
    }
    rows.push([imageCell, textCellContent]);
  });

  // Compose table data
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
