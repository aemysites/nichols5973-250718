/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as specified
  const headerRow = ['Cards (cards112)'];
  // Find the container holding the card items
  const cardsContainer = element.querySelector('.latest-insights-podcasts__insights');
  if (!cardsContainer) return;
  // Each direct child .insight is a card
  const cardEls = Array.from(cardsContainer.querySelectorAll(':scope > .insight'));
  const rows = [headerRow];
  cardEls.forEach(card => {
    // --- IMAGE CELL ---
    let imgCell = '';
    const imageWrap = card.querySelector('.insight__image');
    if (imageWrap) {
      // Only the <img> element is used in the image cell for the cards block
      const img = imageWrap.querySelector('img');
      if (img) imgCell = img;
    }
    // --- TEXT CELL ---
    const textCellParts = [];
    // Title (as heading)
    const titleLink = card.querySelector('.insight__title a');
    if (titleLink) {
      // Use <strong> to visually distinguish the title, matching the example look
      const strong = document.createElement('strong');
      strong.appendChild(titleLink);
      textCellParts.push(strong);
    }
    // Author/Meta info (date, duration)
    const meta = card.querySelector('.insight__date-read');
    if (meta) {
      // meta contains a <p> with two <span>s: date and duration
      const metaSpans = meta.querySelectorAll('span');
      let metaContent = '';
      if (metaSpans.length) {
        metaContent = Array.from(metaSpans).map(s => s.textContent).join(' | ');
      } else {
        metaContent = meta.textContent.trim();
      }
      if (metaContent) {
        const p = document.createElement('p');
        p.textContent = metaContent;
        textCellParts.push(p);
      }
    }
    // Tags (optional)
    const tags = card.querySelector('.insight__tags');
    if (tags && tags.children.length > 0) {
      // We'll put all tags as inline links (as in the HTML)
      const tagLinks = Array.from(tags.querySelectorAll('a'));
      if (tagLinks.length > 0) {
        const tagSpan = document.createElement('div');
        tagLinks.forEach((link, idx) => {
          tagSpan.appendChild(link);
          if (idx < tagLinks.length - 1) tagSpan.appendChild(document.createTextNode(' '));
        });
        textCellParts.push(tagSpan);
      }
    }
    // Compose description body: get the main text content (the title is in a heading, meta and tags above)
    // The main description in these cards is the title itself, so if more descriptive text exists, include it
    // For these podcast cards, there is not a separate descriptive paragraph, so nothing extra is needed.
    // Compose cell
    const textCell = document.createElement('div');
    textCellParts.forEach((part, idx) => {
      textCell.appendChild(part);
      if (idx !== textCellParts.length - 1) textCell.appendChild(document.createElement('br'));
    });
    // If no title, tags, or meta, ensure at least some content in cell
    if (!textCell.textContent.trim()) {
      textCell.textContent = card.textContent.trim();
    }
    rows.push([imgCell, textCell]);
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
