/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns26)'];

  // Helper to extract icon, heading, and list from a section
  function extractColumnContent(section) {
    const frag = document.createDocumentFragment();
    // Icon
    const icon = section.querySelector('.icon-rich-text-block__icon');
    if (icon) frag.appendChild(icon.cloneNode(true));
    // Heading
    const heading = section.querySelector('h2');
    if (heading) frag.appendChild(heading.cloneNode(true));
    // List
    const list = section.querySelector('ul');
    if (list) frag.appendChild(list.cloneNode(true));
    return frag;
  }

  // Get all immediate child sections (columns)
  const sections = Array.from(element.querySelectorAll(':scope > section'));
  // Fallback: try immediate child divs with expected class
  if (sections.length === 0) {
    const divs = Array.from(element.querySelectorAll(':scope > div.icon-rich-text-block'));
    if (divs.length > 0) {
      sections.push(...divs);
    }
  }

  // Each section is a column: extract only relevant content
  const contentRow = sections.map(extractColumnContent);

  // Table: header row, then content row
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
