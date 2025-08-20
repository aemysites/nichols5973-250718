/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per spec
  const headerRow = ['Cards (cards17)'];
  // Get all card containers
  const cards = Array.from(element.querySelectorAll('.insight'));
  const rows = [headerRow];

  cards.forEach(card => {
    // 1. Image cell: get the main image only (not author avatars)
    let imageCell = null;
    const imageAnchor = card.querySelector('.insight__image a');
    if (imageAnchor) {
      const img = imageAnchor.querySelector('img');
      if (img) imageCell = img;
    }

    // 2. Content cell (title, meta, tags, type)
    const contentParts = [];
    // Title (use heading3 if present; preserve link)
    const heading = card.querySelector('.insight__title .heading3, .insight__title');
    if (heading) {
      // If there's a link, keep it, otherwise just text
      const a = heading.querySelector('a');
      if (a) {
        // Use <strong><a>...</a></strong> for title
        const strong = document.createElement('strong');
        strong.appendChild(a);
        contentParts.push(strong);
      } else {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        contentParts.push(strong);
      }
    }

    // Meta: date + read time
    const dateRead = card.querySelector('.insight__date-read');
    if (dateRead) {
      // Use as a single line if both are present
      const spans = dateRead.querySelectorAll('span');
      if (spans.length > 0) {
        const metaSpan = document.createElement('span');
        // Join date and read time with separator
        const metaArr = Array.from(spans).map(s => s.textContent.trim()).filter(Boolean);
        metaSpan.textContent = metaArr.join(' | ');
        contentParts.push(metaSpan);
      }
    }

    // Authors: comma join all speakers visible
    const authorSpans = card.querySelectorAll('.insight__authors span');
    const authorNames = Array.from(authorSpans).map(s => s.textContent.trim()).filter(Boolean);
    if (authorNames.length > 0) {
      const authorSpan = document.createElement('span');
      authorSpan.textContent = authorNames.join(', ');
      contentParts.push(authorSpan);
    }

    // Tags: as chips at the bottom
    const tagsDiv = card.querySelector('.insight__tags');
    if (tagsDiv) {
      const tagLinks = Array.from(tagsDiv.querySelectorAll('a'));
      if (tagLinks.length > 0) {
        const tagWrapper = document.createElement('div');
        tagLinks.forEach(link => {
          const chip = document.createElement('span');
          chip.textContent = link.textContent.trim();
          chip.style.marginRight = '8px';
          tagWrapper.appendChild(chip);
        });
        contentParts.push(tagWrapper);
      }
    }

    // Type (Article/Report)
    const typeSpan = card.querySelector('.insight__type span');
    if (typeSpan) {
      const typeEl = document.createElement('span');
      typeEl.textContent = typeSpan.textContent.trim();
      contentParts.push(typeEl);
    }

    rows.push([
      imageCell || '',
      contentParts.length > 1 ? contentParts : (contentParts[0] || '')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
