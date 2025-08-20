/* global WebImporter */
export default function parse(element, { document }) {
  // Gather slides
  let slides = [];
  if (element.matches('a.entry-point__item')) {
    slides = [element];
  } else {
    slides = Array.from(element.querySelectorAll('a.entry-point__item'));
    if (slides.length === 0) {
      // Fallback: handle direct child anchor
      const a = element.querySelector('a');
      if (a) slides = [a];
    }
  }

  // Build table rows. The header row is a single column; each slide row is two columns.
  const cells = [];
  // Header row: single column only
  cells.push(['Carousel (carousel43)']);

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let img = null;
    let imgDiv = slide.querySelector('.entry-point__item--img');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    } else {
      img = slide.querySelector('img');
    }
    // --- TEXT CELL ---
    const textNodes = [];
    let bodyDiv = slide.querySelector('.entry-point__item--body');
    if (bodyDiv) {
      Array.from(bodyDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textNodes.push(span);
        }
      });
    } else {
      // Fallback: gather all h1-h6, p directly in slide
      ['h1','h2','h3','h4','h5','h6','p'].forEach(tag => {
        slide.querySelectorAll(tag).forEach(e => textNodes.push(e));
      });
    }
    // Add CTA (link) if slide is a link with a title and not already present
    if (slide.href && slide.title && slide.title.trim() && !textNodes.some(node => node.tagName === 'A')) {
      const cta = document.createElement('a');
      cta.href = slide.href;
      cta.textContent = slide.title;
      textNodes.push(cta);
    }
    if (!img) img = '';
    if (!textNodes.length) textNodes.push('');
    cells.push([img, textNodes]);
  });

  // Create the table using the correct row structure
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
