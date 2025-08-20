/* global WebImporter */
export default function parse(element, { document }) {
  // Find the readings block
  const readingsSection = element.querySelector('.related-reading__readings');
  if (!readingsSection) return;
  const cards = Array.from(readingsSection.querySelectorAll(':scope > .reading'));

  // Header row (single cell, exact name)
  const headerRow = ['Cards (cards65)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // Left cell: just the <img>, not the <a>
    let imageCell = null;
    const img = card.querySelector('.reading__image img');
    if (img) imageCell = img;
    
    // Right cell: all relevant content, preserving semantic structure
    const rightCell = document.createElement('div');

    // Meta: authors, date/read time
    const meta = card.querySelector('.reading__meta');
    if (meta) {
      // Authors: show +N author text if present
      const authors = meta.querySelector('.reading__authors');
      if (authors) {
        const authorSpan = authors.querySelector('span');
        if (authorSpan && authorSpan.textContent.trim()) {
          const authorDiv = document.createElement('div');
          authorDiv.textContent = authorSpan.textContent.trim();
          rightCell.appendChild(authorDiv);
        }
      }
      // Date and read time
      const dateRead = meta.querySelector('.reading__date-read');
      if (dateRead) {
        // Join all span texts with a space
        const spans = dateRead.querySelectorAll('span');
        if (spans.length) {
          const dateText = Array.from(spans)
            .map(s => s.textContent.trim())
            .join(' ');
          const dateDiv = document.createElement('div');
          dateDiv.textContent = dateText;
          rightCell.appendChild(dateDiv);
        }
      }
    }
    // Title (as heading)
    const title = card.querySelector('.reading__title');
    if (title) {
      const h3 = title.querySelector('h3');
      if (h3) {
        rightCell.appendChild(h3);
      }
    }
    // Tags: list of topics as text
    const tags = card.querySelector('.reading__tags');
    if (tags) {
      const tagLinks = tags.querySelectorAll('a.tag');
      if (tagLinks.length) {
        const tagDiv = document.createElement('div');
        tagDiv.textContent = Array.from(tagLinks).map(a => a.textContent.trim()).join(', ');
        rightCell.appendChild(tagDiv);
      }
    }
    // Add row (reference original elements where possible)
    rows.push([
      imageCell,
      rightCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
