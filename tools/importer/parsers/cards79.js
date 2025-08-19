/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block name
  const headerRow = ['Cards (cards79)'];

  // Each card is a direct child with class 'reading'
  const cards = Array.from(element.querySelectorAll(':scope > .reading'));
  const rows = cards.map((card) => {
    // Image/Icon cell: use the <img> inside .reading__image > a
    let imageEl = null;
    const imgLink = card.querySelector('.reading__image a');
    if (imgLink) {
      const img = imgLink.querySelector('img');
      if (img) imageEl = img;
    }

    // Text cell: build with meta, title, tags in correct order
    const contentParts = [];
    // Meta (Featured, read time)
    const meta = card.querySelector('.reading__date-read');
    if (meta) {
      // Get all text from meta's <span>s, joined by ' | ', as plain text
      const spans = meta.querySelectorAll('span');
      const text = Array.from(spans).map(s => s.textContent.trim()).filter(Boolean).join(' | ');
      if (text) {
        const metaP = document.createElement('p');
        metaP.textContent = text;
        contentParts.push(metaP);
      }
    }
    // Title as heading
    const titleDiv = card.querySelector('.reading__title');
    if (titleDiv) {
      const titleHeading = titleDiv.querySelector('h3, h2, h4, h1, h5, h6');
      if (titleHeading) {
        // Reference the heading directly
        contentParts.push(titleHeading);
      }
    }
    // Tags block
    const tagsDiv = card.querySelector('.reading__tags');
    if (tagsDiv) {
      // Take all tag <a> elements and put them in a div
      const tagLinks = Array.from(tagsDiv.querySelectorAll('a.tag'));
      if (tagLinks.length > 0) {
        const tagsContainer = document.createElement('div');
        tagLinks.forEach(tag => tagsContainer.appendChild(tag));
        contentParts.push(tagsContainer);
      }
    }
    // Compose the row with image/icon cell and content cell
    return [imageEl, contentParts.length === 1 ? contentParts[0] : contentParts];
  });

  // Build table and replace element
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
