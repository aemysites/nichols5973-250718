/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns115)'];

  // Find the main content container
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // Find the rich text content
  const richText = layoutContainer.querySelector('.rich-text-basic__text');
  if (!richText) return;

  // Find the <table> with the three columns
  const table = richText.querySelector('table');
  let columnsRow = [];
  if (table) {
    const tr = table.querySelector('tr');
    if (tr) {
      columnsRow = Array.from(tr.children).map(td => Array.from(td.childNodes));
    }
  }

  // Gather all intro content (navigation links, colored h3, intro p, analytics lab p)
  const navLinksP = Array.from(richText.querySelectorAll('p')).find(p => p.querySelector('a.link--button'));
  const coloredH3 = richText.querySelector('h3 span[style*="color"]')?.closest('h3');
  let introP = null;
  if (coloredH3) {
    let sibling = coloredH3.nextElementSibling;
    while (sibling) {
      if (sibling.tagName === 'P' && sibling.textContent.trim()) {
        introP = sibling;
        break;
      }
      sibling = sibling.nextElementSibling;
    }
  }
  const analyticsLabP = Array.from(richText.querySelectorAll('p')).find(p => p.textContent.includes('Leadership Analytics Lab'));

  // Compose a single intro cell with all intro content in order
  const introContent = [];
  if (navLinksP) introContent.push(navLinksP);
  if (coloredH3) introContent.push(coloredH3);
  if (introP) introContent.push(introP);
  if (analyticsLabP) introContent.push(analyticsLabP);

  // Compose the table rows
  // Row 1: header
  // Row 2: intro content (single cell)
  // Row 3: three columns (from the table)
  const rows = [
    headerRow,
  ];

  if (introContent.length) {
    rows.push([introContent]);
  }

  if (columnsRow.length) {
    rows.push(columnsRow);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
