/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel85)'];

  // Find the carousel slides container
  let slides = [];
  const slidesContainer = element.querySelector('.glide__slides');
  if (slidesContainer) {
    // Only select unique slides (exclude clones)
    slides = Array.from(slidesContainer.querySelectorAll('.case-study.glide__slide:not(.glide__slide--clone)'));
  } else {
    // Fallback: desktop images container
    const imagesContainer = element.querySelector('.case-study--images-container');
    if (imagesContainer) {
      // Pair images and texts by order
      const images = Array.from(imagesContainer.querySelectorAll('.case-study--image-desktop'));
      const texts = Array.from(imagesContainer.querySelectorAll('.case-study--txt'));
      slides = images.map((img, i) => ({ img, txt: texts[i] }));
    }
  }

  // Helper to extract image and text for each slide
  function extractSlideContent(slide) {
    let imageCell = null;
    let textCell = '';
    if (slide.img && slide.txt) {
      // Desktop pairing
      const imgTag = slide.img.querySelector('img');
      if (imgTag) imageCell = imgTag;
      if (slide.txt) {
        // Use all text content, including headings and paragraphs
        const div = document.createElement('div');
        Array.from(slide.txt.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
        textCell = div.childNodes.length ? div : '';
      }
    } else {
      // Standard mobile/slide structure
      const imgWrap = slide.querySelector('.case-study--image');
      if (imgWrap) {
        const imgTag = imgWrap.querySelector('img');
        if (imgTag) imageCell = imgTag;
      }
      const txtWrap = slide.querySelector('.case-study--txt');
      if (txtWrap) {
        const div = document.createElement('div');
        Array.from(txtWrap.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
        textCell = div.childNodes.length ? div : '';
      }
    }
    // Defensive: ensure image is present
    if (!imageCell) {
      imageCell = (slide.img || slide).querySelector && (slide.img || slide).querySelector('img');
    }
    return [imageCell, textCell];
  }

  // Build rows: each slide = [image, text]
  let rows = [];
  if (slides.length && slides[0].img && slides[0].txt) {
    rows = slides.map(extractSlideContent);
  } else {
    rows = slides.map(extractSlideContent);
  }

  // Only include slides with an image
  rows = rows.filter(([img]) => img);

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
