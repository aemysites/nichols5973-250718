/* global WebImporter */
export default function parse(element, { document }) {
  // Extract carousel slides from the track
  const track = element.querySelector('.glide__track ul.glide__slides');
  if (!track) return;
  const slides = Array.from(track.children).filter(li => li.classList.contains('feature-carousel'));

  // Deduplicate slides by image URL
  const seen = new Set();
  const rows = [];
  for (const slide of slides) {
    const style = slide.getAttribute('style') || '';
    // Extract background-image url
    const urlMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (!urlMatch) continue;
    const imgUrl = urlMatch[1];
    if (seen.has(imgUrl)) continue;
    seen.add(imgUrl);
    // Create image element
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = '';
    img.loading = 'lazy';
    // Extract the most inclusive text content block
    let textElement = slide.querySelector('.feature-carousel--txt');
    if (!textElement) {
      // fallback: select the .feature-carousel--content if --txt is missing
      textElement = slide.querySelector('.feature-carousel--content');
    }
    // Place all children (including text nodes) into a fragment
    let textCell = '';
    if (textElement) {
      const fragment = document.createDocumentFragment();
      // We want to reference existing elements, so we move them
      while (textElement.childNodes.length > 0) {
        fragment.appendChild(textElement.childNodes[0]);
      }
      // If fragment is not empty, use its children as array for table cell
      textCell = fragment.childNodes.length ? Array.from(fragment.childNodes) : '';
    }
    rows.push([img, textCell]);
  }
  // Build table: header and rows
  const cells = [['Carousel (carousel6)']];
  rows.forEach(r => cells.push(r));
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
