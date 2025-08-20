/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slider mask that contains the slides
  const sliderMask = element.querySelector('.w-slider-mask');
  if (!sliderMask) return;

  // Get all slides
  const slides = Array.from(sliderMask.children).filter(
    (child) => child.classList && child.classList.contains('fe-slider')
  );

  // Table header row matches example
  const rows = [['Carousel (carousel101)']];

  slides.forEach((slide) => {
    // IMAGE CELL
    const imgWrap = slide.querySelector('.fe-slide-image-wrap');
    let img = '';
    if (imgWrap) {
      const imgEl = imgWrap.querySelector('img');
      if (imgEl) img = imgEl;
    }

    // TEXT CELL
    let textCell = '';
    const textDiv = slide.querySelector('.slider-text-fe');
    if (textDiv) {
      // Use the text element directly, keeping HTML formatting
      textCell = textDiv;
    }

    rows.push([img, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
