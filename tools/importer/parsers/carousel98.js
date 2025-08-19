/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row with exact block name
  const headerRow = ['Carousel (carousel98)'];

  // 2. Find the slider mask (container for slides)
  const sliderMask = element.querySelector('.w-slider-mask');
  const slides = sliderMask ? sliderMask.querySelectorAll('.fe-slider.w-slide') : [];

  // 3. Build table rows for each slide
  const rows = [];
  slides.forEach((slide) => {
    // Each slide should have a container with image and text
    const container = slide.querySelector('.slider-container') || slide;

    // a. Image cell (first cell)
    let imageCell = '';
    const imgWrap = container.querySelector('.fe-slide-image-wrap');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imageCell = img;
    } else {
      // fallback if wrapper missing
      const img = container.querySelector('img');
      if (img) imageCell = img;
    }

    // b. Text cell (second cell)
    let textCell = '';
    const textDiv = container.querySelector('.slider-text-fe');
    if (textDiv) textCell = textDiv;

    rows.push([imageCell, textCell]);
  });

  // 4. Compose the table as per example: header + slide rows
  const cells = [headerRow, ...rows];

  // 5. Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
