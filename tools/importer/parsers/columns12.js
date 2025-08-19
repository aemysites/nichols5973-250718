/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example, exactly one cell
  const headerRow = ['Columns (columns12)'];

  // The two columns in this block
  let leftColContent, rightColContent;

  // LEFT COLUMN: Title and subtext
  // Find .landing-subnav--intro, which contains .title (h1) and .text
  const intro = element.querySelector('.landing-subnav--intro');
  if (intro) {
    leftColContent = intro;
  } else {
    // fallback: find the title and text directly
    const title = element.querySelector('h1, .title');
    const text = element.querySelector('.text');
    if (title || text) {
      const leftDiv = document.createElement('div');
      if (title) leftDiv.appendChild(title);
      if (text) leftDiv.appendChild(text);
      leftColContent = leftDiv;
    } else {
      leftColContent = '';
    }
  }

  // RIGHT COLUMN: Function nav list
  // Prefer nav in .landing-subnav--nav-wrapper, fallback to .landing-subnav--filters in .landing-subnav--outside-nav
  let rightDiv = null;
  const navWrapper = element.querySelector('.landing-subnav--nav-wrapper');
  if (navWrapper) {
    rightDiv = document.createElement('div');
    // Label as in screenshot, always "Functions" from the active class
    const label = navWrapper.querySelector('.active');
    if (label) {
      const labelDiv = document.createElement('div');
      labelDiv.textContent = label.textContent.trim().toUpperCase();
      labelDiv.style.fontWeight = 'bold';
      rightDiv.appendChild(labelDiv);
    }
    // List of links from nav
    const nav = navWrapper.querySelector('.landing-subnav--nav');
    if (nav) {
      Array.from(nav.children).forEach(item => {
        // Each item is a <div> containing an <a>
        const childLinks = item.querySelectorAll('a');
        if (childLinks.length > 0) {
          childLinks.forEach(link => rightDiv.appendChild(link));
        } else {
          // fallback, raw text
          rightDiv.appendChild(item);
        }
      });
    }
  }
  // Fallback if rightDiv is not set, use .landing-subnav--filters links (mobile)
  if (!rightDiv) {
    const filters = element.querySelector('.landing-subnav--filters');
    if (filters) {
      rightDiv = document.createElement('div');
      // Functions label from button
      const btn = filters.querySelector('.mobile-label');
      if (btn) {
        const labelDiv = document.createElement('div');
        labelDiv.textContent = btn.textContent.trim().toUpperCase();
        labelDiv.style.fontWeight = 'bold';
        rightDiv.appendChild(labelDiv);
      }
      // Append all the links
      Array.from(filters.querySelectorAll('a')).forEach(link => rightDiv.appendChild(link));
    }
  }
  rightColContent = rightDiv || '';

  // Final table: exactly as in example, header and one row with two cells
  const cells = [headerRow, [leftColContent, rightColContent]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
