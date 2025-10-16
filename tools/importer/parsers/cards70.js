/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards70)'];

  // Extract the main heading (e.g., 'Family Enterprise Insights')
  const headingEl = element.querySelector('.related-reading__header h2');
  let heading = '';
  if (headingEl) heading = headingEl.textContent.trim();

  // Find the main cards container
  const readings = element.querySelectorAll('.related-reading__readings > .reading');

  // Helper to build the text cell for each card
  function buildTextCell(card) {
    const content = card.querySelector('.reading__content');
    const meta = content.querySelector('.reading__meta');
    const authors = meta?.querySelector('.reading__authors');
    const dateRead = meta?.querySelector('.reading__date-read');
    const title = content.querySelector('.reading__title');
    const tags = content.querySelector('.reading__tags');

    // Compose a fragment for the text cell
    const frag = document.createElement('div');
    if (authors) {
      frag.appendChild(authors.cloneNode(true));
    }
    if (dateRead) {
      frag.appendChild(dateRead.cloneNode(true));
    }
    if (title) {
      frag.appendChild(title.cloneNode(true));
    }
    if (tags) {
      frag.appendChild(tags.cloneNode(true));
    }
    return frag;
  }

  // Helper to build the image cell for each card (with type label)
  function buildImageCell(card) {
    const imageAnchor = card.querySelector('.reading__image a');
    let imageEl = null;
    if (imageAnchor) {
      // Only take the first img child that is not an SVG (type icon)
      const imgs = imageAnchor.querySelectorAll('img');
      for (const img of imgs) {
        if (!img.src.startsWith('data:image/svg+xml')) {
          imageEl = img.cloneNode(true);
          break;
        }
      }
    }
    if (!imageEl) {
      const fallbackImg = card.querySelector('.reading__image img');
      if (fallbackImg && !fallbackImg.src.startsWith('data:image/svg+xml')) {
        imageEl = fallbackImg.cloneNode(true);
      }
    }
    // Add the type label (e.g., 'ARTICLE', 'REPORT') with icon if present
    const typeLabel = card.querySelector('.reading__type');
    let cellFrag = document.createElement('div');
    if (imageEl) cellFrag.appendChild(imageEl);
    if (typeLabel) cellFrag.appendChild(typeLabel.cloneNode(true));
    return cellFrag;
  }

  // Build rows for each card
  const rows = Array.from(readings).map((card) => {
    const imageCell = buildImageCell(card);
    const textCell = buildTextCell(card);
    return [imageCell, textCell];
  });

  // Add the 'View All' button if present as a final row in the table
  const viewAll = element.querySelector('.related-reading__button-wrapper--bottom a');
  if (viewAll) {
    // Add as a final row with empty image cell and button in text cell
    rows.push([document.createTextNode(''), viewAll.cloneNode(true)]);
  }

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Add heading above the table if present
  if (heading) {
    const headingElem = document.createElement('h2');
    headingElem.textContent = heading;
    element.parentNode.insertBefore(headingElem, element);
  }

  // Replace the original element
  element.replaceWith(table);
}
