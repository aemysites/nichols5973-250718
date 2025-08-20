/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slides list
  const slidesUl = element.querySelector('.glide__slides');
  if (!slidesUl) return;
  // Only feature slides (ignore clones with duplicate images)
  const lis = Array.from(slidesUl.children).filter(li => li.classList.contains('feature-carousel'));
  // Deduplicate by background image URL
  const seen = new Set();
  const slides = [];
  lis.forEach(li => {
    const bgImg = li.style.backgroundImage;
    const urlMatch = bgImg && bgImg.match(/url\(["']?(.*?)["']?\)/);
    const url = urlMatch ? urlMatch[1] : '';
    if (!url || seen.has(url)) return;
    seen.add(url);
    slides.push({ li, url });
  });
  // Build table rows
  const headerRow = ['Carousel (carousel6)']; // Exact header from example
  const rows = [headerRow];
  slides.forEach(({ li, url }) => {
    // Image cell: always present
    let img = null;
    for (const node of li.childNodes) {
      // background image only, never an actual <img>
      // create <img> for table
      break;
    }
    img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.setAttribute('loading', 'lazy');
    // Text cell: gather all text content from .feature-carousel--content (preserves all markup)
    let textCell = '';
    const contentDiv = li.querySelector('.feature-carousel--content');
    if (contentDiv) {
      // Move all children from .feature-carousel--txt if present, else from contentDiv itself
      let txt = contentDiv.querySelector('.feature-carousel--txt');
      const wrapper = document.createElement('div');
      if (txt) {
        // Move all children (reference, not clone)
        while (txt.childNodes.length) {
          wrapper.appendChild(txt.childNodes[0]);
        }
      } else {
        // If no .feature-carousel--txt, move all children from contentDiv
        while (contentDiv.childNodes.length) {
          wrapper.appendChild(contentDiv.childNodes[0]);
        }
      }
      // Only add if wrapper has actual content
      if (wrapper.textContent.trim()) textCell = wrapper;
    }
    rows.push([img, textCell]);
  });
  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
