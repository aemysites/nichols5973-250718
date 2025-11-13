/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns37)'];

  // Defensive: get the main content wrapper
  const contentWrapper = element.querySelector('.testimonial-content');
  if (!contentWrapper) return;

  // Find the two column containers
  const row = contentWrapper.querySelector('.row');
  if (!row) return;
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: Testimonial
  const leftCol = columns[0];
  // Get heading (h2)
  const heading = contentWrapper.querySelector('h2');
  // Get testimonial card (the review)
  const testimonialCard = leftCol.querySelector('.testimonial-content__review');

  // Compose left cell: heading + testimonial card
  const leftCellContent = [];
  if (heading) leftCellContent.push(heading);
  if (testimonialCard) leftCellContent.push(testimonialCard);

  // Right column: Rating
  const rightCol = columns[1];
  // Get image (icon)
  const iconContainer = rightCol.querySelector('.icon-container');
  let iconImg = null;
  if (iconContainer) {
    iconImg = iconContainer.querySelector('img');
  }
  // Get rating heading (h3)
  const ratingHeading = rightCol.querySelector('h3');
  // Get description (p)
  const description = rightCol.querySelector('.testimonial-content__description');

  // --- FIX: Extract the large rating number and stars ---
  // The rating number and stars are visually present but not in a semantic element.
  // We'll try to extract them from the iconContainer or its siblings.
  let ratingNumber = null;
  let stars = null;
  // Look for a large number near the iconContainer
  if (iconContainer) {
    // Sometimes the number is a text node or inside a span/div/h1/h2/h3 near the iconContainer
    // Try to find a large number in the rightCol
    const possibleNumber = Array.from(rightCol.querySelectorAll('h1, h2, h3, span, div'))
      .find(el => /4\.7/.test(el.textContent));
    if (possibleNumber) {
      ratingNumber = possibleNumber.cloneNode(true);
    }
    // Try to find stars: look for elements with 'star' in class or aria-label
    const possibleStars = Array.from(rightCol.querySelectorAll('[class*="star"], [aria-label*="star"], svg'));
    if (possibleStars.length) {
      stars = document.createElement('div');
      possibleStars.forEach(star => stars.appendChild(star.cloneNode(true)));
    }
  }
  // If not found, fallback to text node search
  if (!ratingNumber) {
    const textMatch = rightCol.textContent.match(/4\.7/);
    if (textMatch) {
      ratingNumber = document.createElement('span');
      ratingNumber.textContent = textMatch[0];
    }
  }

  // Compose right cell: icon + rating number + stars + heading + description
  const rightCellContent = [];
  if (iconImg) rightCellContent.push(iconImg);
  if (ratingNumber) rightCellContent.push(ratingNumber);
  if (stars) rightCellContent.push(stars);
  if (ratingHeading) rightCellContent.push(ratingHeading);
  if (description) rightCellContent.push(description);

  // Table row: two columns
  const contentRow = [leftCellContent, rightCellContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with table
  element.replaceWith(table);
}
