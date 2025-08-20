/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards72)'];
  const rows = [headerRow];
  // Get all testimonial items
  const items = element.querySelectorAll(':scope > .testimonial-item-container-internal');
  items.forEach((item) => {
    // Image
    let imgEl = null;
    const imgDiv = item.querySelector('.testimonial-item-image-internal');
    if (imgDiv && imgDiv.style.backgroundImage) {
      const match = imgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1];
        imgEl.alt = '';
      }
    }
    // Text content cell
    const quotationContainer = item.querySelector('.quotation-container');
    let textCellContent = document.createElement('div');
    if (quotationContainer) {
      // Find author (name)
      const authorLink = quotationContainer.querySelector('a.author-link');
      const authorSpan = authorLink ? authorLink.querySelector('.author') : null;
      // Title as bold (semantics: strong)
      if (authorSpan && authorSpan.textContent.trim()) {
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = authorSpan.textContent.trim();
        textCellContent.appendChild(nameStrong);
      }
      // Description
      const authorStatement = quotationContainer.querySelector('.author-statement');
      if (authorStatement && authorStatement.textContent.trim()) {
        const descDiv = document.createElement('div');
        descDiv.textContent = authorStatement.textContent.trim();
        textCellContent.appendChild(descDiv);
      }
      // CTA: add a link to the profile, if available
      if (authorLink && authorLink.href) {
        const ctaDiv = document.createElement('div');
        const profileLink = document.createElement('a');
        profileLink.href = authorLink.href;
        profileLink.textContent = authorSpan ? authorSpan.textContent.trim() : authorLink.textContent.trim();
        ctaDiv.appendChild(profileLink);
        textCellContent.appendChild(ctaDiv);
      }
    }
    rows.push([imgEl, textCellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
