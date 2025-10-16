/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container for the left and right columns
  const container = element.querySelector('.landing-subnav--container');
  if (!container) return;

  const content = container.querySelector('.landing-subnav--content');
  if (!content) return;

  const item = content.querySelector('.landing-subnav--item');
  if (!item) return;

  // Left column: intro
  const leftCol = item.querySelector('.landing-subnav--intro');
  // Right column: nav wrapper
  const rightCol = item.querySelector('.landing-subnav--nav-wrapper');

  // Defensive: if either column is missing, fallback to the whole block in one cell
  if (!leftCol || !rightCol) {
    const headerRow = ['Columns (columns16)'];
    const contentRow = [element.cloneNode(true)];
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      contentRow,
    ], document);
    element.replaceWith(table);
    return;
  }

  // --- FLEXIBLE PARSING: preserve HTML structure ---

  // Left column: preserve heading and subheading markup
  const leftColFragment = document.createDocumentFragment();
  const leftTitle = leftCol.querySelector('h1, h2, h3, h4, h5, h6');
  if (leftTitle) leftColFragment.appendChild(leftTitle.cloneNode(true));
  const leftText = leftCol.querySelector('.text');
  if (leftText) leftColFragment.appendChild(leftText.cloneNode(true));
  // If nothing found, fallback to all children
  if (!leftColFragment.childNodes.length) {
    Array.from(leftCol.childNodes).forEach(node => {
      leftColFragment.appendChild(node.cloneNode(true));
    });
  }

  // Right column: preserve label and navigation links as elements
  const rightColFragment = document.createDocumentFragment();
  const navLabel = rightCol.querySelector('.active');
  if (navLabel) {
    const label = document.createElement('strong');
    label.textContent = navLabel.textContent.trim().toUpperCase();
    rightColFragment.appendChild(label);
  }
  const navList = rightCol.querySelector('.landing-subnav--nav');
  if (navList) {
    const ul = document.createElement('ul');
    navList.querySelectorAll('a').forEach(link => {
      const li = document.createElement('li');
      li.appendChild(link.cloneNode(true));
      ul.appendChild(li);
    });
    rightColFragment.appendChild(ul);
  } else {
    // Fallback: get all children
    Array.from(rightCol.childNodes).forEach(node => {
      rightColFragment.appendChild(node.cloneNode(true));
    });
  }

  // Build the table
  const headerRow = ['Columns (columns16)'];
  const contentRow = [leftColFragment, rightColFragment];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
