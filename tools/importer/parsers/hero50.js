/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container div (should contain image, content)
  let container = element.querySelector(':scope > div.header-subnav--container') || element;

  // Get the background image (img element)
  const img = container.querySelector('img');

  // Get the hero content block
  const content = container.querySelector('.header-subnav--content');
  let heroContent = null;
  if (content) {
    // Usually only one .header-subnav--item
    const item = content.querySelector('.header-subnav--item');
    if (item) {
      heroContent = item.querySelector('.header-subnav--intro') || item;
    }
  }
  if (!heroContent) heroContent = content || container;

  // Extract heading (h1)
  const heading = heroContent.querySelector('h1');

  // Extract subheading (h3 or .text div)
  let subheading = heroContent.querySelector('h3');
  if (!subheading) {
    // Sometimes subheading is just text in .text div
    const textDiv = heroContent.querySelector('.text');
    if (textDiv && textDiv.textContent.trim()) {
      // Use div instead of p to preserve original structure
      subheading = document.createElement('div');
      subheading.textContent = textDiv.textContent.trim();
    }
  }

  // Extract CTA link (anchor inside .link)
  let cta = heroContent.querySelector('.link a');
  if (!cta) {
    // Sometimes .link exists but is empty, try to find any button-like anchor
    cta = heroContent.querySelector('a.btn, a');
  }

  // Compose the content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Table rows
  const headerRow = ['Hero (hero50)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
