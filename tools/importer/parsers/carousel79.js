/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare slides array
  let slides = [];
  let usedDesktop = false;

  // Try to use desktop structure for cleanest pairing
  let desktopContainer = element.querySelector('.case-study--images-container') || element.querySelector('.case-study--images-container.desktop');
  if (desktopContainer) {
    // Get all desktop images and texts in order
    const imageDivs = Array.from(desktopContainer.querySelectorAll('.case-study--image-desktop'));
    const children = Array.from(desktopContainer.children);
    let i = 0;
    while (i < children.length) {
      let img = null;
      let txt = null;
      if (children[i].classList.contains('case-study--image-desktop')) {
        // Get image in this block
        img = children[i].querySelector('img');
        // Look for the following .case-study--txt
        if (children[i + 1] && children[i + 1].classList.contains('case-study--txt')) {
          txt = children[i + 1];
          i += 2;
        } else {
          i++;
        }
        slides.push([img, txt]);
      } else {
        i++;
      }
    }
    usedDesktop = slides.length > 0;
  }

  // Fallback: mobile structure (carousel list)
  if (!usedDesktop) {
    const liEls = Array.from(element.querySelectorAll('ul.glide__slides > li.case-study'));
    const seen = new Set();
    for (const li of liEls) {
      const img = li.querySelector('.case-study--image img');
      const txt = li.querySelector('.case-study--txt');
      // Build a unique key for deduplication
      let key = '';
      if (img && img.src) key += img.src;
      if (txt) {
        const h2 = txt.querySelector('h2');
        if (h2) key += h2.textContent.trim();
      }
      if (!seen.has(key)) {
        slides.push([img, txt]);
        seen.add(key);
      }
    }
  }

  // Build table rows
  const cells = [['Carousel (carousel79)']];
  slides.forEach(([img, txt]) => {
    let textCell = '';
    if (txt && txt instanceof HTMLElement) {
      // Preserve all text content and structure in the .case-study--txt block
      const nodes = Array.from(txt.childNodes).filter(node => {
        // Only elements or non-empty text nodes
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
      textCell = nodes.length === 1 ? nodes[0] : nodes;
    }
    cells.push([
      img || '',
      textCell
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
