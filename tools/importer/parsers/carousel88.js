/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract testimonial slides
  function extractSlides(wrapper) {
    // All slides have class 'testimonial-item-container-internal'
    return Array.from(wrapper.querySelectorAll('.testimonial-item-container-internal'));
  }

  // Helper to build text content cell for a slide
  function buildTextCell(slide) {
    const container = document.createElement('div');
    // Quotation text
    const quote = slide.querySelector('.quotation');
    if (quote) {
      // Remove empty <p>&nbsp;</p> if present
      Array.from(quote.querySelectorAll('p')).forEach(p => {
        if (!p.textContent.trim()) p.remove();
      });
      // Reference existing quote node, not clone
      container.appendChild(quote);
    }
    // Author name (bold)
    const author = slide.querySelector('.author');
    if (author) {
      const strong = document.createElement('strong');
      strong.textContent = author.textContent.trim();
      container.appendChild(strong);
      container.appendChild(document.createElement('br'));
    }
    // Author statement (title/location)
    const statement = slide.querySelector('.author-statement');
    if (statement) {
      const span = document.createElement('span');
      span.textContent = statement.textContent.trim();
      container.appendChild(span);
    }
    return container;
  }

  // Main parse logic
  const headerRow = ['Carousel (carousel88)'];
  const rows = [headerRow];

  // Find all slides
  const slides = extractSlides(element);
  slides.forEach(slide => {
    // Image cell: get the <img> inside .testimonial-item-image-internal
    let imgCell = null;
    const imgWrapper = slide.querySelector('.testimonial-item-image-internal img');
    if (imgWrapper) {
      imgCell = imgWrapper;
    }
    // Text cell: build from quote + author
    const textCell = buildTextCell(slide);
    rows.push([imgCell, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
