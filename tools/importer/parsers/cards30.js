/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block parser
  // Find all card containers
  const cardRows = Array.from(
    element.querySelectorAll(
      '.teaser-collection__items > .row.rich-text'
    )
  );

  // Header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  cardRows.forEach(cardRow => {
    // Card content is inside .rich-text__body
    const body = cardRow.querySelector('.rich-text__body');
    if (!body) return;

    // 1. Image/Icon (first <img> inside body)
    const img = body.querySelector('img');
    // 2. Text content (title, description, CTA)
    const frag = document.createElement('div');

    // Title: <h2> or <strong> inside <h2>
    let title = body.querySelector('h2');
    if (!title) {
      title = body.querySelector('strong');
    }
    if (title) frag.appendChild(title.cloneNode(true));

    // Description: all <p> except those containing only the image or CTA
    const ps = Array.from(body.querySelectorAll('p'));
    ps.forEach(p => {
      // Skip if contains only the image
      if (p.contains(img)) return;
      // Skip if contains CTA link/button
      if (p.querySelector('a') && p.textContent.trim().toLowerCase().includes('email us')) return;
      // For the Call Us card, skip <p> if it contains the phone link and we've already added it
      if (body.querySelector('a[href^="tel:"]')) {
        // If this <p> contains the phone link, mark that we've added it
        if (p.querySelector('a[href^="tel:"]')) {
          frag.appendChild(p.cloneNode(true));
          frag._phoneAdded = true;
          return;
        }
      }
      frag.appendChild(p.cloneNode(true));
    });

    // CTA: button or link (either <a> or <button> inside body)
    let cta = body.querySelector('a.cta-link, a[href^="#"], button');
    if (cta) {
      frag.appendChild(cta.cloneNode(true));
    } else {
      // Only add phone link if not already added in a <p>
      const phoneLink = body.querySelector('a[href^="tel:"]');
      if (phoneLink && !frag._phoneAdded) {
        frag.appendChild(phoneLink.cloneNode(true));
      }
    }
    delete frag._phoneAdded;

    // Add the card row: [image/icon, text content]
    rows.push([
      img || '',
      frag
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
