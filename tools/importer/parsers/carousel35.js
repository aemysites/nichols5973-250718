/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const rows = [['Carousel (carousel35)']];

  // Find the <ul> containing the slides
  const ul = element.querySelector('.glide__slides');
  if (!ul) return;

  // Get all direct li children (slides)
  const slides = Array.from(ul.children).filter(li => li.classList.contains('podcast-carousel'));

  slides.forEach(slide => {
    // --- IMAGE CELL ---
    // Get the background image from style
    let imgUrl = '';
    const style = slide.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      imgUrl = match[1];
    }
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = '';
    }

    // --- TEXT CELL ---
    // Reference the .podcast-carousel--content block for all text content
    const content = slide.querySelector('.podcast-carousel--content');
    let textCellContent = '';
    if (content) {
      textCellContent = content;
    }

    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
