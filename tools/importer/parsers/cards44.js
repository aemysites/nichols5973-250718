/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as required
  const cells = [['Cards (cards44)']];

  const slides = element.querySelector('ul.glide__slides');
  if (!slides) return;

  // Use a Set to deduplicate cards based on title+desc
  const seen = new Set();

  Array.from(slides.children).forEach(card => {
    if (!card.classList.contains('event')) return;
    // Compose key from heading and description for deduplication
    const heading = card.querySelector('.heading4');
    const headingText = heading ? heading.textContent.trim() : '';
    const desc = card.querySelector('p');
    const descText = desc ? desc.textContent.trim() : '';
    const dedupKey = `${headingText}||${descText}`;
    if (!headingText && !descText) return;
    if (seen.has(dedupKey)) return;
    seen.add(dedupKey);

    // FIRST CELL: Speaker images if available, else event date block (reference only, do not clone)
    let leftCell = '';
    const speakerImgs = Array.from(card.querySelectorAll('.speakers .speaker img'));
    if (speakerImgs.length) {
      leftCell = speakerImgs;
    } else {
      const dateBlock = card.querySelector('.event--date');
      if (dateBlock) leftCell = dateBlock;
    }

    // SECOND CELL: All text content (title as strong, description, speakers info), referencing existing nodes
    const texts = [];
    if (heading) {
      // Use heading4's link text or heading text as <strong>
      const headingLink = heading.querySelector('a');
      const strong = document.createElement('strong');
      strong.textContent = headingLink ? headingLink.textContent.trim() : heading.textContent.trim();
      texts.push(strong);
    }
    if (desc && desc.textContent.trim()) {
      // Use the original description paragraph
      texts.push(desc);
    }
    // Add all visible speaker info (span or text)
    const speakers = card.querySelector('.speakers');
    if (speakers) {
      Array.from(speakers.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN' && node.textContent.trim()) {
          texts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const div = document.createElement('div');
          div.textContent = node.textContent.trim();
          texts.push(div);
        }
      });
    }
    // Only push card if it contains some content for either cell
    if (leftCell || texts.length) {
      cells.push([
        leftCell,
        texts.length === 1 ? texts[0] : texts // If only one node, use directly, else array
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
