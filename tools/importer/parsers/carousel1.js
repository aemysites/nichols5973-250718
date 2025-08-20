/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a poster <img> from a URL
  function createPosterImg(url) {
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    img.alt = '';
    return img;
  }

  // Try to find the poster image for the carousel (from video bg)
  let posterUrl = '';
  const videoBg = element.querySelector('._6q-back-video');
  if (videoBg) {
    posterUrl = videoBg.getAttribute('data-poster-url') || '';
    if (!posterUrl) {
      const video = videoBg.querySelector('video');
      if (video && video.style && video.style.backgroundImage) {
        const urlMatch = video.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch) posterUrl = urlMatch[1];
      }
    }
  }

  // Prepare rows: header first
  const rows = [['Carousel (carousel1)']];

  // All slides (ignore the first intro slide, which only has _6q-fixed-text-block-first)
  const slides = Array.from(element.querySelectorAll('._6q-slide-cont, ._6q-slide-cont-last'))
    .filter(slide => !slide.querySelector('._6q-fixed-text-block-first'));

  slides.forEach(slide => {
    // Left column: always the poster image
    let imgCell;
    if (posterUrl) {
      imgCell = createPosterImg(posterUrl);
    } else {
      // fallback: empty element
      imgCell = document.createElement('div');
      imgCell.textContent = '';
    }

    // Right column: content
    let contentCell = document.createElement('div');
    // Stat slide
    const statBlock = slide.querySelector('._6q-fixed-text-block');
    // Last slide (CTA, headline, subtext)
    const statBlockLast = slide.querySelector('._6q-fixed-text-block-last');

    if (statBlock) {
      // Stat number
      const statNum = statBlock.querySelector('._6q-slider-data');
      if (statNum) {
        const h = document.createElement('h2');
        h.textContent = statNum.textContent.trim();
        contentCell.appendChild(h);
      }
      // Main text
      const mainText = statBlock.querySelector('._6q-right-text');
      if (mainText) {
        const p = document.createElement('p');
        p.textContent = mainText.textContent.trim();
        contentCell.appendChild(p);
      }
      // Source (may contain a link)
      const source = statBlock.querySelector('._6q-sub-source');
      if (source) {
        contentCell.appendChild(source);
      }
    } else if (statBlockLast) {
      // Heading
      const heading = statBlockLast.querySelector('._6q-slider-heading');
      if (heading) {
        const h1 = document.createElement('h1');
        h1.textContent = heading.textContent.trim();
        contentCell.appendChild(h1);
      }
      // Subtext
      const subText = statBlockLast.querySelector('._6q-sub-text');
      if (subText) {
        const p = document.createElement('p');
        p.textContent = subText.textContent.trim();
        contentCell.appendChild(p);
      }
      // CTAs/buttons
      const btns = Array.from(slide.querySelectorAll('._6q-cta-button, ._6q-replay-button'));
      btns.forEach(btn => {
        contentCell.appendChild(btn);
      });
    }
    rows.push([imgCell, contentCell]);
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
