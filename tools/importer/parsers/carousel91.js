/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Carousel (carousel91)'];

  // Find all slide links (robust for future multiple slides)
  const items = element.querySelectorAll('a.entry-point__item');
  const slides = [];

  items.forEach((item) => {
    // First cell: image element from .entry-point__item--img
    let image = '';
    const imgContainer = item.querySelector('.entry-point__item--img');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) image = img;
    }
    
    // Second cell: Title (heading) and any description (paragraph)
    let textCell = '';
    const body = item.querySelector('.entry-point__item--body');
    if (body) {
      const textParts = [];
      // Heading (any level)
      const heading = body.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) textParts.push(heading);
      // Paragraph (if non-empty)
      const para = body.querySelector('p');
      if (para && para.textContent.trim()) textParts.push(para);
      if (textParts.length > 0) textCell = textParts;
    }
    slides.push([image, textCell]);
  });

  // Fallback: single slide block (robustness)
  if (slides.length === 0) {
    let image = '';
    const img = element.querySelector('img');
    if (img) image = img;
    let textCell = '';
    const heading = element.querySelector('h1,h2,h3,h4,h5,h6');
    const para = element.querySelector('p');
    const textParts = [];
    if (heading) textParts.push(heading);
    if (para && para.textContent.trim()) textParts.push(para);
    if (textParts.length > 0) textCell = textParts;
    slides.push([image, textCell]);
  }

  // Build the table
  const cells = [headerRow, ...slides];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
