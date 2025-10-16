/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all unique, non-clone carousel slides
  const slideSelector = '.feature-carousel--carousel ul.glide__slides > li.feature-carousel';
  const slides = Array.from(element.querySelectorAll(slideSelector))
    .filter((li, idx, arr) => {
      // Only keep the first occurrence of each slide by class (deduplicate clones)
      const slideClass = Array.from(li.classList).find(c => c.startsWith('slide__'));
      return arr.findIndex(other => other.classList.contains(slideClass)) === idx;
    });

  if (!slides.length) return;

  // Table header row
  const headerRow = ['Carousel (carousel5)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Image: always first img in slide
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // Text content: feature-carousel--txt
    const txt = slide.querySelector('.feature-carousel--txt');
    let textCellContent = [];
    if (txt) {
      // Get all text content in order, including links
      // Small (featured article)
      const small = txt.querySelector('small');
      if (small) {
        textCellContent.push(small.textContent.trim());
      }
      // Heading (h2)
      const h2 = txt.querySelector('h2, h2.heading1');
      if (h2) {
        textCellContent.push(h2.textContent.trim());
      }
      // Subheading (h3)
      const h3 = txt.querySelector('h3');
      if (h3) {
        textCellContent.push(h3.textContent.trim());
      }
    }
    // If nothing found, fallback to empty string
    if (!textCellContent.length) textCellContent = [''];

    // Join all text parts into a single block (preserving line breaks)
    const textCell = document.createElement('div');
    textCellContent.forEach((txt, i) => {
      if (txt) {
        const p = document.createElement(i === 1 ? 'h2' : 'p');
        p.textContent = txt;
        textCell.appendChild(p);
      }
    });

    rows.push([
      imageCell,
      textCell
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
