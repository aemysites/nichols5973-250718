/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel1)'];

  // Select all slides (include hidden ones, as content is needed)
  const slideSelector = '._6q-slide-cont, ._6q-slide-cont-last';
  const slides = Array.from(element.querySelectorAll(slideSelector));

  // Helper: Get poster image from video background (for all slides)
  let posterUrl = '';
  const bgVideo = element.querySelector('._6q-back-video');
  if (bgVideo && bgVideo.dataset.posterUrl) {
    posterUrl = bgVideo.dataset.posterUrl;
  }

  const rows = slides.map(slide => {
    // Left cell: always use the poster image as the slide image
    let leftCell = '';
    if (posterUrl) {
      const img = document.createElement('img');
      img.src = posterUrl;
      img.setAttribute('loading', 'lazy');
      leftCell = img;
    }

    // Right cell: collect all text content
    let rightCell = [];
    // Title/heading
    const heading = slide.querySelector('._6q-slider-title, ._6q-slider-heading, h1');
    if (heading) rightCell.push(heading);
    // Data value
    const dataVal = slide.querySelector('._6q-slider-data');
    if (dataVal) rightCell.push(dataVal);
    // Main text
    const mainText = slide.querySelector('._6q-right-text, ._6q-sub-text');
    if (mainText) rightCell.push(mainText);
    // Source
    const source = slide.querySelector('._6q-sub-source');
    if (source) rightCell.push(source);
    // CTA buttons
    const buttons = slide.querySelector('._6q-buttons-container');
    if (buttons) rightCell.push(buttons);
    // Defensive: if rightCell is empty, push an empty string
    if (rightCell.length === 0) rightCell = [''];

    return [leftCell, rightCell];
  });

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
