/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header
  const headerRow = ['Columns (columns63)'];

  // Defensive: Get the main content container
  const container = element.querySelector('.landing-subnav--container');
  if (!container) return;

  // Find the content and CTA wrappers
  const content = container.querySelector('.landing-subnav--content');
  if (!content) return;

  // Left column: heading and description
  const intro = content.querySelector('.landing-subnav--intro');
  let leftColumnContent = [];
  if (intro) {
    // Grab heading and text
    const heading = intro.querySelector('h1');
    if (heading) leftColumnContent.push(heading);
    const text = intro.querySelector('.text');
    if (text) leftColumnContent.push(text);
  }

  // Right column: CTA button (with icon)
  const navWrapper = content.querySelector('.landing-subnav--nav-wrapper');
  let rightColumnContent = [];
  if (navWrapper) {
    // The CTA is inside .simple-cta.has-icon
    const cta = navWrapper.querySelector('.simple-cta.has-icon');
    if (cta) rightColumnContent.push(cta);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
