/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Cards (cards58)'];

  // Get the list of cards
  const track = element.querySelector('.insights--content.glide__track');
  const ul = track && track.querySelector('ul.glide__slides');
  if (!ul) return;
  const lis = Array.from(ul.children);
  const cells = [headerRow];

  lis.forEach(li => {
    // First column: the card image (reference actual <img> element)
    let imgCell = null;
    const imgWrap = li.querySelector('.insight--image');
    if (imgWrap) {
      const imgLink = imgWrap.querySelector('a');
      if (imgLink) {
        const img = imgLink.querySelector('img');
        if (img) {
          imgCell = img;
        }
      }
    }

    // Second column: text content (title, tags, description, cta)
    const txtWrap = li.querySelector('.insight--txt');
    if (txtWrap) {
      const textFrag = document.createDocumentFragment();
      // Tags: flatten into a single line, each as span (if present)
      const tags = txtWrap.querySelector('.insight--tags');
      if (tags && tags.children.length) {
        const tagsDiv = document.createElement('div');
        Array.from(tags.children).forEach((a, idx) => {
          const tagSpan = document.createElement('span');
          tagSpan.textContent = a.textContent;
          tagsDiv.appendChild(tagSpan);
          if (idx < tags.children.length - 1) {
            tagsDiv.appendChild(document.createTextNode(' '));
          }
        });
        textFrag.appendChild(tagsDiv);
      }
      // Title: strong element, reference text from <h3> or its link
      const h3 = txtWrap.querySelector('h3');
      if (h3) {
        let titleText = '';
        const h3link = h3.querySelector('a');
        if (h3link) {
          titleText = h3link.textContent;
        } else {
          titleText = h3.textContent;
        }
        if (titleText.trim()) {
          const strongTitle = document.createElement('strong');
          strongTitle.textContent = titleText.trim();
          textFrag.appendChild(strongTitle);
        }
      }
      // Description: <p> elements with text, skip empty ones
      const paragraphs = Array.from(txtWrap.querySelectorAll('p'));
      paragraphs.forEach(p => {
        if (p.textContent.trim()) {
          textFrag.appendChild(document.createElement('br'));
          textFrag.appendChild(document.createTextNode(p.textContent.trim()));
        }
      });
      // Call-to-Action: the button link (if present)
      const cta = txtWrap.querySelector('a.link--button');
      if (cta) {
        textFrag.appendChild(document.createElement('br'));
        textFrag.appendChild(cta);
      }
      cells.push([imgCell, textFrag]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
