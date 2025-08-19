/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards109)'];
  const tableRows = [headerRow];
  // Each card is a .insight
  const cardElements = element.querySelectorAll('.insight');
  cardElements.forEach(card => {
    // First cell: Image (use img from .insight__image)
    let imageCell = null;
    const img = card.querySelector('.insight__image img');
    if (img) imageCell = img;
    // Second cell: Title (heading), plus description and tags as text/links
    const contentParts = [];
    // Title
    const titleLink = card.querySelector('.insight__title .heading3 a');
    if (titleLink) {
      const heading = document.createElement('strong');
      heading.textContent = titleLink.textContent.trim();
      contentParts.push(heading);
    }
    // Meta (date, duration)
    const meta = card.querySelector('.insight__meta .insight__date-read');
    if (meta) {
      // Add each span as a separate line
      meta.querySelectorAll('span').forEach(span => {
        const p = document.createElement('div');
        p.textContent = span.textContent.trim();
        contentParts.push(p);
      });
    }
    // Authors (names only, skip avatars)
    const authors = card.querySelector('.insight__meta .insight__authors');
    if (authors) {
      // Try to extract author name(s) text, not images
      const names = Array.from(authors.querySelectorAll('span')).map(span => span.textContent.trim()).filter(Boolean);
      names.forEach(name => {
        const authorDiv = document.createElement('div');
        authorDiv.textContent = name;
        contentParts.push(authorDiv);
      });
    }
    // Tags (as links)
    const tagsDiv = card.querySelector('.insight__tags');
    if (tagsDiv) {
      const tags = Array.from(tagsDiv.querySelectorAll('a')).map(a => {
        const tagLink = document.createElement('a');
        tagLink.href = a.href;
        tagLink.textContent = a.textContent.trim();
        return tagLink;
      });
      if (tags.length) {
        const tagsContainer = document.createElement('div');
        tags.forEach(tag => tagsContainer.appendChild(tag));
        contentParts.push(tagsContainer);
      }
    }
    tableRows.push([imageCell, contentParts]);
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
