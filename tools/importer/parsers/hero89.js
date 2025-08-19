/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background-image url
  let bgUrl = null;
  const style = element.getAttribute('style');
  if (style) {
    const bgMatch = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (bgMatch && bgMatch[1]) {
      bgUrl = bgMatch[1].replace(/['"]/g, '');
    }
  }

  // Create image element for background image if present
  let imageEl = null;
  if (bgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgUrl;
    imageEl.alt = '';
  }

  // Find the column with the content
  // Typically: .layout-container > .row > .column
  let textColumn = null;
  const layoutContainer = element.querySelector('.layout-container');
  if (layoutContainer) {
    const row = layoutContainer.querySelector('.row');
    if (row) {
      textColumn = row.querySelector('.column');
    }
  }
  if (!textColumn) {
    textColumn = element.querySelector('.column');
  }

  // Collect all relevant block content (heading, subhead, paragraph, CTA)
  const blockContent = [];
  if (textColumn) {
    // Heading (find the largest heading present)
    const headings = Array.from(textColumn.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    if (headings.length > 0) {
      blockContent.push(headings[0]);
    }

    // Subheading and descriptive paragraphs (non-empty)
    // Only include paragraphs with non-empty text
    const paragraphs = Array.from(textColumn.querySelectorAll('p')).filter(p => p.textContent.trim());
    // Remove paragraphs that are only nbsp
    const cleanParagraphs = paragraphs.filter(p => p.innerHTML.replace(/&nbsp;|\s/g, '') !== '');
    // If the first paragraph comes before the heading, skip it (often used as spacing)
    let contentParas = cleanParagraphs;
    if (headings.length > 0 && cleanParagraphs.length > 0) {
      const headingIndex = Array.from(textColumn.children).indexOf(headings[0]);
      const paraIndex = Array.from(textColumn.children).indexOf(cleanParagraphs[0]);
      if (paraIndex < headingIndex) {
        contentParas = cleanParagraphs.slice(1);
      }
    }
    contentParas.forEach(p => blockContent.push(p));

    // CTA links (class link--button)
    const ctas = Array.from(textColumn.querySelectorAll('a.link--button'));
    if (ctas.length > 0) {
      const ctaDiv = document.createElement('div');
      ctas.forEach((cta, idx) => {
        ctaDiv.appendChild(cta);
        if (idx < ctas.length - 1) {
          ctaDiv.appendChild(document.createTextNode(' '));
        }
      });
      blockContent.push(ctaDiv);
    }
  }

  // Compose table as per the block's requirements
  const cells = [
    ['Hero (hero89)'],
    [imageEl ? imageEl : ''],
    [blockContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
