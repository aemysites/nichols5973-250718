/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main slider element
  const slider = element.querySelector('.w-slider');
  if (!slider) return;
  const mask = slider.querySelector('.w-slider-mask');
  if (!mask) return;
  const slides = Array.from(mask.children);

  // Table header
  const rows = [['Carousel (carousel69)']];

  slides.forEach((slide) => {
    // Try to find left and right columns
    let leftCol = slide.querySelector('._60-flex-rai');
    let rightCol = slide.querySelector('._40-flex-rai');
    // Fallback for intro slide
    if (!leftCol && !rightCol) {
      leftCol = slide.querySelector('.cover-flex-rai, .slider-container-rai');
    }

    // IMAGE CELL
    let imageCell = '';
    if (rightCol) {
      // Prefer <img> if present
      const img = rightCol.querySelector('img');
      if (img) imageCell = img;
      else {
        // Lottie animation: reference the parent div (not clone)
        const lottie = rightCol.querySelector('[data-src]');
        if (lottie) imageCell = lottie;
      }
    }
    // If not found, check for video background
    if (!imageCell) {
      const videoBg = slide.querySelector('.w-background-video');
      if (videoBg) imageCell = videoBg;
    }

    // TEXT CELL
    let textCell = '';
    if (leftCol) {
      const fragments = [];
      // For the first slide (intro), include heading if present
      const heading = leftCol.querySelector('.slider-heading-rai, h1.slider-heading-rai');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent;
        fragments.push(h2);
      }
      // Percentage headline
      const percent = leftCol.querySelector('.big-percentage-rai');
      if (percent) {
        const h2 = document.createElement('h2');
        h2.textContent = percent.textContent;
        fragments.push(h2);
      }
      // Description
      const desc = leftCol.querySelector('.text-rai');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        fragments.push(p);
      }
      // Source link
      const source = leftCol.querySelector('.source-rai a');
      if (source) fragments.push(source);
      // If nothing found, fallback to all text content
      if (fragments.length === 0) {
        const txt = leftCol.textContent.trim();
        if (txt) fragments.push(txt);
      }
      textCell = fragments;
    } else {
      // Fallback: all slide text
      const txt = slide.textContent.trim();
      if (txt) textCell = txt;
    }

    // Only add row if at least one cell has content
    if (imageCell || (Array.isArray(textCell) ? textCell.length : textCell)) {
      rows.push([imageCell, textCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
