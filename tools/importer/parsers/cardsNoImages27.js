/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches the example exactly
  const headerRow = ['Cards (cardsNoImages27)'];

  // Find the .link-items container, which contains all cards
  const linkItems = element.querySelector('.link-items');
  const cardRows = [];

  if (linkItems) {
    // Each card is a .link-item direct child
    const items = Array.from(linkItems.children);
    items.forEach(item => {
      // Heading (h3, may contain a link)
      const heading = item.querySelector('h3');
      // Description (p)
      const description = item.querySelector('p');
      // CTA link: always the <a> after the <p>, but in this HTML it's just the arrow icon
      // Example does NOT use arrow CTA links, so we do NOT include them if no text content
      // Compose cell content, only include non-empty elements
      const content = [];
      if (heading && heading.textContent.trim()) content.push(heading);
      if (description && description.textContent.trim()) content.push(description);
      cardRows.push([content]);
    });
  }
  // If linkItems is missing or has no items, don't add any card rows

  // Assemble table
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}