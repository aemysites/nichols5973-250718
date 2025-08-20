/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: Must match example exactly
  const headerRow = ['Cards (cards22)'];

  // Find consultants container
  const consultantsSection = element.querySelector('.consultant-directory--consultants');
  if (!consultantsSection) return;

  // Find all consultant elements
  const consultantEls = Array.from(consultantsSection.querySelectorAll('.consultant'));
  const rows = [headerRow];

  consultantEls.forEach((consultant) => {
    const link = consultant.querySelector('a');
    if (!link) return;
    // Image: Use existing img element
    const imgDiv = link.querySelector('.image');
    const img = imgDiv ? imgDiv.querySelector('img') : null;

    // Compose card text: Name (bold), ALL location text (comma separated)
    // Also: retain semantic meaning, use only existing elements, no markdown
    const nameEl = link.querySelector('.name');
    const nameText = nameEl ? nameEl.textContent.trim() : '';
    const titleEl = document.createElement('strong');
    titleEl.textContent = nameText;

    // Get all location text
    const locationWrapper = link.querySelector('.location-wrapper');
    let locationText = '';
    if (locationWrapper) {
      // Collect all .location span text (can be >1 span)
      const locationSpans = locationWrapper.querySelectorAll('.location span');
      locationText = Array.from(locationSpans).map(span => span.textContent.trim()).join(', ');
    }
    // Build text cell: title (bold), then location(s) (plain text)
    const cellContent = [];
    if (nameText) cellContent.push(titleEl);
    if (locationText) cellContent.push(document.createElement('br'), document.createTextNode(locationText));
    // If no name or location, skip row
    if (!img && cellContent.length === 0) return;
    rows.push([img, cellContent]);
  });

  // Create the cards table, replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
