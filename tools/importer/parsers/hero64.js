/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches block name
  const headerRow = ['Hero (hero64)'];

  // Background image: extract from .header-subnav--container style
  let bgImg = '';
  const bgContainer = element.querySelector('.header-subnav--container');
  if (bgContainer && bgContainer.style.backgroundImage) {
    const match = bgContainer.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match) {
      bgImg = match[1];
    }
  }
  let bgImgEl = '';
  if (bgImg) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImg;
  }
  const bgRow = [bgImgEl || ''];

  // Content row: title, (subheading), call-to-action (video link)
  const contentCell = document.createElement('div');

  // Title (h1)
  const title = element.querySelector('h1');
  if (title) contentCell.appendChild(title);

  // Subheading: looks like <div class="text">, but is empty in this example
  // If present and not empty, include as paragraph
  const subheading = element.querySelector('.text');
  if (subheading && subheading.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = subheading.textContent.trim();
    contentCell.appendChild(p);
  }

  // Call-to-action: video link (from <a> inside .video-embed__media)
  const videoLink = element.querySelector('.video-embed__media a');
  if (videoLink) {
    // Try to use the most meaningful URL for a Brightcove video
    let href = videoLink.getAttribute('href');
    if (!href) {
      const accountId = videoLink.getAttribute('data-accountid');
      const videoId = videoLink.getAttribute('data-videoid');
      if (accountId && videoId) {
        href = `https://players.brightcove.net/${accountId}/default_default/index.html?videoId=${videoId}`;
      }
    }
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Play Video';
      contentCell.appendChild(link);
    }
  }

  const contentRow = [contentCell];

  // Build the block table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
