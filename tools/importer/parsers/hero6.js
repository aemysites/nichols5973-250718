/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero6) block expects 1 column, 3 rows:
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: headline, subheading, CTA (optional)

  // Helper to find the hero image
  function findHeroImage(el) {
    // Look for an img inside v-image__image--cover
    const img = el.querySelector('.v-image__image--cover img');
    if (img) return img;
    // Fallback: any img
    return el.querySelector('img');
  }

  // Helper to find hero text content (heading/subheading/CTA)
  function findHeroTextContent(el) {
    // In this source, there is no text content in the hero block
    // But if present, look for headings, paragraphs, and links
    // Try to find heading (h1/h2/h3), subheading (h2/h3), CTA (a/button)
    const textElements = [];
    // Headings
    const heading = el.querySelector('h1, h2, h3');
    if (heading) textElements.push(heading);
    // Subheading
    const subheading = el.querySelector('h2, h3');
    if (subheading && subheading !== heading) textElements.push(subheading);
    // Paragraphs
    const paragraphs = el.querySelectorAll('p');
    paragraphs.forEach(p => textElements.push(p));
    // CTA (link/button)
    const cta = el.querySelector('a, button');
    if (cta) textElements.push(cta);
    // If nothing found, return null
    return textElements.length ? textElements : '';
  }

  // Build the table rows
  const headerRow = ['Hero (hero6)'];

  // Find the hero image
  const heroImg = findHeroImage(element);
  const imageRow = [heroImg ? heroImg : ''];

  // Find hero text content (if any)
  const heroTextContent = findHeroTextContent(element);
  const textRow = [heroTextContent ? heroTextContent : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
