/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Hero (hero63)'];

  // --- Background image row ---
  let bgImgRow = [''];
  let bgUrl = '';
  // Extract background image from style attribute if present
  const container = element.querySelector('.header-subnav--container');
  if (container && container.style.backgroundImage) {
    const match = container.style.backgroundImage.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
    if (match && match[1]) {
      bgUrl = match[1];
    }
  }
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    bgImgRow = [img];
  }

  // --- Main content row ---
  // Find main content structure
  const content = element.querySelector('.header-subnav--content') || element;
  const item = content.querySelector('.header-subnav--item') || content;
  const intro = item.querySelector('.header-subnav--intro') || item;

  // Gather block content
  const contentCell = [];

  // Title (Heading)
  const title = intro.querySelector('h1, h2, h3, .title');
  if (title) contentCell.push(title);

  // Subheading/Paragraph
  const text = intro.querySelector('.text, p');
  if (text) contentCell.push(text);

  // Call-to-Action (video link)
  // The video embed may contain a link; if so, convert it to an <a> element with an href
  const videoEmbed = intro.querySelector('.video-embed, .video-embed-wrapper, .video-embed__media');
  let ctaLink = null;
  if (videoEmbed) {
    const ctaA = videoEmbed.querySelector('a');
    if (ctaA) {
      // Try to build a proper video link if possible
      const videoId = ctaA.getAttribute('data-videoid');
      const accountId = ctaA.getAttribute('data-accountid');
      if (videoId && accountId) {
        const videoUrl = `https://players.brightcove.net/${accountId}/default_default/index.html?videoId=${videoId}`;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.textContent = (ctaA.textContent || 'Play Video').trim();
        ctaLink = link;
      } else {
        // Use the existing anchor if it has an href
        if (ctaA.href) ctaLink = ctaA;
      }
    }
  }
  if (ctaLink) contentCell.push(ctaLink);

  // Compose table
  const cells = [
    headerRow,
    bgImgRow,
    [contentCell]
  ];

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
