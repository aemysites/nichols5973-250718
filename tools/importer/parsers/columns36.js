/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content/columns
  const content = element.querySelector('.header-podcast--content');
  const imageContainer = element.querySelector('.image-container');

  // LEFT COLUMN: podcast info
  const leftColumn = [];
  // Extract heading
  const h1 = content.querySelector('h1');
  if (h1) leftColumn.push(h1);
  // Extract podcast block (iframe)
  const iframe = content.querySelector('iframe');
  if (iframe) {
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.title || 'Podcast link';
    leftColumn.push(a);
  }
  // Extract subtitle (Podcast label)
  const subtitle = content.querySelector('.subtitle');
  if (subtitle) leftColumn.push(subtitle);
  // Hosted by section
  const hoster = content.querySelector('.header-podcast--hoster');
  if (hoster) leftColumn.push(hoster);
  // (category is empty in source)

  // RIGHT COLUMN: image and description
  const rightColumn = [];
  // Prefer desktop image, fallback to any img
  let img = imageContainer.querySelector('.image-container__image--desktop img');
  if (!img) img = imageContainer.querySelector('img');
  if (img) rightColumn.push(img);
  // Image description (title and text)
  const imageDesc = imageContainer.querySelector('.image-desc');
  if (imageDesc) rightColumn.push(imageDesc);

  // Table header row matches the example: "Columns (columns36)"
  const cells = [
    ['Columns (columns36)'],
    [leftColumn, rightColumn]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
