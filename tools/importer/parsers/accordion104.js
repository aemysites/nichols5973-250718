/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion104)'];

  // Find the layout container (main content area)
  const layout = element.querySelector('.layout-container');
  if (!layout) return;

  // Extract heading and intro paragraphs (all content before the list)
  const heading = layout.querySelector('h2');
  const ul = layout.querySelector('ul');
  const introNodes = [];
  let node = layout.firstChild;
  while (node && node !== ul) {
    if (node.nodeType === 1 && (node.tagName === 'H2' || node.tagName === 'P')) {
      introNodes.push(node.cloneNode(true));
    }
    node = node.nextSibling;
  }
  // Compose intro fragment
  const introFragment = document.createDocumentFragment();
  introNodes.forEach(n => introFragment.appendChild(n));

  // Get all list items (accordion questions)
  const listItems = ul ? ul.querySelectorAll('li') : [];
  if (!listItems.length) return;

  // Compose a single accordion item: title is heading, content is intro + all questions
  const contentFragment = document.createDocumentFragment();
  // Add intro content
  introNodes.forEach(n => contentFragment.appendChild(n.cloneNode(true)));
  // Add all questions as a list
  const questionsList = document.createElement('ul');
  Array.from(listItems).forEach(li => {
    const questionText = li.textContent.trim();
    const liElem = document.createElement('li');
    liElem.textContent = questionText;
    questionsList.appendChild(liElem);
  });
  contentFragment.appendChild(questionsList);

  // Only one accordion row: [title, content]
  const rows = [[heading ? heading.textContent.trim() : 'Questions', contentFragment]];

  // Table rows: header + accordion items
  const tableRows = [
    headerRow,
    ...rows
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
