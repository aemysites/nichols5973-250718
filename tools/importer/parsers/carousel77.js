/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to robustly gather all slide pairs from the HTML
  function getSlides(elem) {
    let slides = [];
    // Main carousel track
    const track = elem.querySelector('.glide__track .glide__slides');
    if (track) {
      // Get all .case-study slides that are not clones
      const liSlides = Array.from(track.children).filter((li) => li.classList.contains('case-study') && !li.classList.contains('glide__slide--clone'));
      // If no non-clone, fallback to all .case-study slides
      if (liSlides.length > 0) {
        slides = liSlides;
      } else {
        slides = Array.from(track.querySelectorAll('.case-study'));
      }
      if (slides.length > 0) return slides;
    }
    // Fallback for images-container structure
    const imgContainer = elem.querySelector('.case-study--images-container');
    if (imgContainer) {
      // Find all images and all text blocks
      const imageDivs = Array.from(imgContainer.querySelectorAll('.case-study--image'));
      const txtDivs = Array.from(imgContainer.querySelectorAll('.case-study--txt'));
      // Pair by order: each image with its following txt
      for (let i = 0; i < Math.min(imageDivs.length, txtDivs.length); i++) {
        const wrapper = document.createElement('div');
        wrapper.append(imageDivs[i]);
        wrapper.append(txtDivs[i]);
        slides.push(wrapper);
      }
      if (slides.length > 0) return slides;
    }
    // Fallback for images-container desktop
    const imgDesktop = elem.querySelector('.case-study--images-container.desktop');
    if (imgDesktop) {
      const imageDivs = Array.from(imgDesktop.querySelectorAll('.case-study--image'));
      const txtDivs = Array.from(imgDesktop.querySelectorAll('.case-study--txt'));
      for (let i = 0; i < Math.min(imageDivs.length, txtDivs.length); i++) {
        const wrapper = document.createElement('div');
        wrapper.append(imageDivs[i]);
        wrapper.append(txtDivs[i]);
        slides.push(wrapper);
      }
      if (slides.length > 0) return slides;
    }
    return slides;
  }

  const headerRow = ['Carousel (carousel77)']; // EXACT match to example
  const rows = [headerRow];
  const slides = getSlides(element);

  slides.forEach((slide) => {
    // Find the image: first <img> in the slide
    let img = slide.querySelector('img');
    let imgCell = img ? img : '';

    // Find text: prefer .case-study--txt, else collect heading/description/link
    let txtBlock = slide.querySelector('.case-study--txt');
    let txtCell;
    if (txtBlock) {
      txtCell = txtBlock;
    } else {
      // If no txt block, collect all text elements except images
      const textContainer = document.createElement('div');
      // Add headings, paragraphs, and links from direct children (preserving semantic meaning)
      Array.from(slide.children).forEach((child) => {
        if (
          child.nodeType === 1 && // Element
          child.tagName !== 'IMG' &&
          !child.classList.contains('case-study--image')
        ) {
          textContainer.append(child);
        }
      });
      txtCell = textContainer.childNodes.length ? textContainer : '';
    }
    rows.push([imgCell, txtCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
