/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Columns (columns45)'];

  // 2. Find the two columns: left (image + heading), right (principle titles + descriptions)
  const mainWrap = element.querySelector('.rai-main-wrapper');
  const sectionWrap = mainWrap && getChildByClass(mainWrap, 'rai-section-wrap');
  const accSub = sectionWrap && getChildByClass(sectionWrap, 'rai-acc-sub');

  // Left column: image + heading from HTML only
  let leftCol = document.createElement('div');
  if (accSub) {
    // Shield image
    const imgContainer = getChildByClass(accSub, 'rai-image-container');
    if (imgContainer) {
      leftCol.appendChild(imgContainer.cloneNode(true));
    }
    // Heading above columns (from HTML)
    if (sectionWrap) {
      const heading = sectionWrap.querySelector('.acc-rai-heading');
      if (heading) {
        leftCol.appendChild(heading.cloneNode(true));
      }
    }
  }

  // Right column: principle titles + descriptions, separated by <hr>
  let rightCol = document.createElement('div');
  if (accSub) {
    const textContent = getChildByClass(accSub, 'rai-text-content');
    if (textContent) {
      const textWrap = getChildByClass(textContent, 'rai-text-wrap');
      if (textWrap) {
        const blocks = textWrap.querySelectorAll('.rai-acc-block');
        blocks.forEach((block, idx) => {
          const item = document.createElement('div');
          // Title
          const title = block.querySelector('.rai-acc-title');
          if (title) {
            item.appendChild(title.cloneNode(true));
          }
          // Description paragraph
          const content = block.querySelector('.rai-acc-content');
          if (content) {
            const para = content.querySelector('.rai-paragraph');
            if (para) {
              item.appendChild(para.cloneNode(true));
            }
          }
          rightCol.appendChild(item);
          // Divider except after last
          if (idx < blocks.length - 1) {
            const hr = document.createElement('hr');
            hr.style.margin = '12px 0';
            rightCol.appendChild(hr);
          }
        });
      }
    }
  }

  // 3. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCol, rightCol],
  ], document);

  // 4. Replace the original element
  element.replaceWith(table);
}
