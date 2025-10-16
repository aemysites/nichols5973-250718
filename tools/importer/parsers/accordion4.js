/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion4) block: 2 columns, first row is header, each subsequent row is [title, content]
  const headerRow = ['Accordion (accordion4)'];
  const rows = [headerRow];

  // Defensive: find the main content container
  const layout = element.querySelector('.layout-container');
  if (!layout) return;

  // Get the heading (h2) and intro paragraphs before the <ul>
  const h2 = layout.querySelector('h2');
  const introParas = [];
  let node = h2 && h2.nextElementSibling;
  while (node && node.tagName !== 'UL') {
    if (node.tagName === 'P' && node.textContent.trim()) {
      introParas.push(node.cloneNode(true));
    }
    node = node.nextElementSibling;
  }
  // Get the <ul> of questions (accordion items)
  const ul = layout.querySelector('ul');
  // Get the CTA button (centered link)
  const cta = layout.querySelector('p[style*="text-align: center"] a');

  // Compose the content cell: intro paragraphs + <ul> + CTA button
  const contentCell = [];
  if (introParas.length) contentCell.push(...introParas.map(p => p.cloneNode(true)));
  if (ul) contentCell.push(ul.cloneNode(true));
  if (cta) {
    const ctaWrapper = document.createElement('p');
    ctaWrapper.appendChild(cta.cloneNode(true));
    contentCell.push(ctaWrapper);
  }

  // Only add row if we have a heading and some content
  if (h2 && contentCell.length) {
    rows.push([h2.cloneNode(true), contentCell]);
  }

  // Replace the original element with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
