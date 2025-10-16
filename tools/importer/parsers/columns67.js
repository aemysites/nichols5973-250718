/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns67)'];

  // Find the three stat columns
  // Defensive: find all direct children with class 'stat' under the '.stats' container
  const statsContainer = element.querySelector('.stats');
  const statDivs = statsContainer ? Array.from(statsContainer.querySelectorAll(':scope > .stat')) : [];

  // For each stat, gather the headline and body as a single cell
  const cells = statDivs.map((stat) => {
    // Find the headline and body
    const headline = stat.querySelector('.stat__headline');
    const body = stat.querySelector('.stat__body');
    // Create a fragment to hold both
    const frag = document.createElement('div');
    if (headline) frag.appendChild(headline);
    if (body) frag.appendChild(body);
    return frag;
  });

  // Build the table rows
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
