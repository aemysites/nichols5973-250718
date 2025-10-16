/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for block name
  const headerRow = ['Hero (hero110)'];

  // 2. Find the background image (img element)
  // Defensive: look for the first img inside the block
  const img = element.querySelector('img');
  const imgRow = [img ? img : ''];

  // 3. Find content: heading, subheading, CTA
  // Defensive: find the content container
  const contentContainer = element.querySelector('.multipurpose-cta__content');
  let contentElements = [];
  if (contentContainer) {
    // Heading (h2)
    const heading = contentContainer.querySelector('h2');
    if (heading) contentElements.push(heading);
    // Subheading (p)
    const subheading = contentContainer.querySelector('p');
    if (subheading) contentElements.push(subheading);
  }
  // Find CTA (anchor)
  const ctaContainer = element.querySelector('.multipurpose-cta__actions');
  let cta;
  if (ctaContainer) {
    cta = ctaContainer.querySelector('a');
    if (cta) contentElements.push(cta);
  }

  // 4. Compose the content row
  const contentRow = [contentElements.length ? contentElements : ''];

  // 5. Build the table
  const rows = [headerRow, imgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
