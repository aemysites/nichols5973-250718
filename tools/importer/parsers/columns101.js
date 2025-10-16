/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for columns block
  const headerRow = ['Columns (columns101)'];

  // --- LEFT COLUMN ---
  // Find the left column: main heading, text, CTA
  // Structure: .landing-subnav--item > .landing-subnav--intro (contains h1, text, link)
  const leftColContainer = element.querySelector('.landing-subnav--intro');
  let leftColContent = [];
  if (leftColContainer) {
    // Heading
    const heading = leftColContainer.querySelector('h1');
    if (heading) leftColContent.push(heading);
    // Supporting text and CTA
    const textDiv = leftColContainer.querySelector('.text');
    if (textDiv) leftColContent.push(textDiv);
  }

  // --- RIGHT COLUMN ---
  // Find the right column: nav label and nav links
  // Structure: .landing-subnav--nav-wrapper
  const navWrapper = element.querySelector('.landing-subnav--nav-wrapper');
  let rightColContent = [];
  if (navWrapper) {
    // The nav label ("Succession") is a div with class 'active' (not a link)
    const navLabel = navWrapper.querySelector('.active');
    if (navLabel) {
      // Make the label visually distinct (e.g., bold)
      const strong = document.createElement('strong');
      strong.textContent = navLabel.textContent.trim();
      rightColContent.push(strong);
    }
    // The nav links are inside .landing-subnav--nav > div > a
    const navLinks = navWrapper.querySelectorAll('.landing-subnav--nav > div > a');
    navLinks.forEach((a) => {
      rightColContent.push(document.createElement('br'));
      rightColContent.push(a);
    });
  }

  // Compose the columns row
  const columnsRow = [
    leftColContent,
    rightColContent
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
