/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header (exact match)
  const headerRow = ['Carousel (carousel1)'];

  // Get video poster URL -- for main image
  const videoDiv = element.querySelector('._6q-back-video');
  let posterImg = null;
  if (videoDiv && videoDiv.dataset.posterUrl) {
    posterImg = document.createElement('img');
    posterImg.src = videoDiv.dataset.posterUrl;
    posterImg.alt = '';
    posterImg.loading = 'lazy';
    posterImg.width = 750;
    posterImg.height = 584;
  }

  // Gather slide containers (order preserved)
  const slideSelectors = '._6q-slider > ._6q-slide-cont, ._6q-slider > ._6q-slide-cont-last';
  const slideDivs = Array.from(element.querySelectorAll(slideSelectors));

  const rows = [];
  // Track first slide (use poster image)
  let isFirstSlide = true;
  for (const slide of slideDivs) {
    let imgCell = '';
    if (isFirstSlide && posterImg) {
      imgCell = posterImg;
    } // For other slides, no image (per provided HTML)
    // Build text cell content
    const content = [];
    // First slide: heading
    const titleFirst = slide.querySelector('._6q-slider-title');
    if (titleFirst) {
      const heading = document.createElement('h2');
      heading.innerHTML = titleFirst.innerHTML;
      content.push(heading);
    }
    // Data slide: left value and right text
    const leftData = slide.querySelector('._6q-slider-data');
    if (leftData) {
      const leftVal = document.createElement('h2');
      leftVal.innerHTML = leftData.innerHTML;
      content.push(leftVal);
    }
    const rightText = slide.querySelector('._6q-right-text');
    if (rightText) {
      const desc = document.createElement('p');
      desc.innerHTML = rightText.innerHTML;
      content.push(desc);
    }
    // Source link (e.g. "Source: ...")
    const subSource = slide.querySelector('._6q-sub-source');
    if (subSource) {
      content.push(subSource);
    }
    // Last slide CTA: heading, subtext, buttons
    const lastHeading = slide.querySelector('._6q-slider-heading');
    if (lastHeading) {
      const heading = document.createElement('h2');
      heading.innerHTML = lastHeading.innerHTML;
      content.push(heading);
    }
    const lastSubText = slide.querySelector('._6q-sub-text');
    if (lastSubText) {
      const subtext = document.createElement('p');
      subtext.innerHTML = lastSubText.innerHTML;
      content.push(subtext);
    }
    const ctaButtons = slide.querySelector('._6q-buttons-container');
    if (ctaButtons) {
      content.push(ctaButtons);
    }
    // Compose cell: if only one element, use it; else use array
    const textCell = content.length === 1 ? content[0] : (content.length ? content : '');
    rows.push([imgCell, textCell]);
    isFirstSlide = false;
  }

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
