/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero4Parser from './parsers/hero4.js';
import tabs5Parser from './parsers/tabs5.js';
import hero9Parser from './parsers/hero9.js';
import cards7Parser from './parsers/cards7.js';
import hero3Parser from './parsers/hero3.js';
import carousel6Parser from './parsers/carousel6.js';
import columns14Parser from './parsers/columns14.js';
import tabs8Parser from './parsers/tabs8.js';
import tabs18Parser from './parsers/tabs18.js';
import columns16Parser from './parsers/columns16.js';
import columns12Parser from './parsers/columns12.js';
import cards2Parser from './parsers/cards2.js';
import accordion20Parser from './parsers/accordion20.js';
import hero23Parser from './parsers/hero23.js';
import columns24Parser from './parsers/columns24.js';
import cards22Parser from './parsers/cards22.js';
import columns10Parser from './parsers/columns10.js';
import hero25Parser from './parsers/hero25.js';
import accordion29Parser from './parsers/accordion29.js';
import columns33Parser from './parsers/columns33.js';
import columns32Parser from './parsers/columns32.js';
import columns19Parser from './parsers/columns19.js';
import columns36Parser from './parsers/columns36.js';
import columns38Parser from './parsers/columns38.js';
import columns39Parser from './parsers/columns39.js';
import carousel35Parser from './parsers/carousel35.js';
import columns40Parser from './parsers/columns40.js';
import cards13Parser from './parsers/cards13.js';
import tabs41Parser from './parsers/tabs41.js';
import cardsNoImages27Parser from './parsers/cardsNoImages27.js';
import columns37Parser from './parsers/columns37.js';
import columns50Parser from './parsers/columns50.js';
import carousel52Parser from './parsers/carousel52.js';
import carousel43Parser from './parsers/carousel43.js';
import hero55Parser from './parsers/hero55.js';
import cards54Parser from './parsers/cards54.js';
import hero56Parser from './parsers/hero56.js';
import cards57Parser from './parsers/cards57.js';
import columns53Parser from './parsers/columns53.js';
import columns58Parser from './parsers/columns58.js';
import cards34Parser from './parsers/cards34.js';
import columns62Parser from './parsers/columns62.js';
import cards63Parser from './parsers/cards63.js';
import hero60Parser from './parsers/hero60.js';
import cards64Parser from './parsers/cards64.js';
import tabs66Parser from './parsers/tabs66.js';
import columns67Parser from './parsers/columns67.js';
import carousel69Parser from './parsers/carousel69.js';
import columns44Parser from './parsers/columns44.js';
import accordion72Parser from './parsers/accordion72.js';
import columns68Parser from './parsers/columns68.js';
import hero70Parser from './parsers/hero70.js';
import cards74Parser from './parsers/cards74.js';
import cards75Parser from './parsers/cards75.js';
import carousel1Parser from './parsers/carousel1.js';
import cards78Parser from './parsers/cards78.js';
import cards79Parser from './parsers/cards79.js';
import carousel80Parser from './parsers/carousel80.js';
import carousel77Parser from './parsers/carousel77.js';
import accordion82Parser from './parsers/accordion82.js';
import cardsNoImages76Parser from './parsers/cardsNoImages76.js';
import columns83Parser from './parsers/columns83.js';
import cards84Parser from './parsers/cards84.js';
import columns65Parser from './parsers/columns65.js';
import cards85Parser from './parsers/cards85.js';
import cards86Parser from './parsers/cards86.js';
import hero89Parser from './parsers/hero89.js';
import carousel91Parser from './parsers/carousel91.js';
import columns47Parser from './parsers/columns47.js';
import tabs92Parser from './parsers/tabs92.js';
import columns81Parser from './parsers/columns81.js';
import cardsNoImages97Parser from './parsers/cardsNoImages97.js';
import cards94Parser from './parsers/cards94.js';
import accordion95Parser from './parsers/accordion95.js';
import columns88Parser from './parsers/columns88.js';
import carousel98Parser from './parsers/carousel98.js';
import tabs59Parser from './parsers/tabs59.js';
import accordion103Parser from './parsers/accordion103.js';
import hero101Parser from './parsers/hero101.js';
import columns104Parser from './parsers/columns104.js';
import carousel102Parser from './parsers/carousel102.js';
import cards105Parser from './parsers/cards105.js';
import columns90Parser from './parsers/columns90.js';
import cards107Parser from './parsers/cards107.js';
import cards109Parser from './parsers/cards109.js';
import hero28Parser from './parsers/hero28.js';
import tabs111Parser from './parsers/tabs111.js';
import hero61Parser from './parsers/hero61.js';
import cards100Parser from './parsers/cards100.js';
import columns99Parser from './parsers/columns99.js';
import hero115Parser from './parsers/hero115.js';
import columns117Parser from './parsers/columns117.js';
import accordion116Parser from './parsers/accordion116.js';
import cards119Parser from './parsers/cards119.js';
import columns93Parser from './parsers/columns93.js';
import tabs112Parser from './parsers/tabs112.js';
import tabs113Parser from './parsers/tabs113.js';
import columns106Parser from './parsers/columns106.js';
import cards110Parser from './parsers/cards110.js';
import columns17Parser from './parsers/columns17.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero4: hero4Parser,
  tabs5: tabs5Parser,
  hero9: hero9Parser,
  cards7: cards7Parser,
  hero3: hero3Parser,
  carousel6: carousel6Parser,
  columns14: columns14Parser,
  tabs8: tabs8Parser,
  tabs18: tabs18Parser,
  columns16: columns16Parser,
  columns12: columns12Parser,
  cards2: cards2Parser,
  accordion20: accordion20Parser,
  hero23: hero23Parser,
  columns24: columns24Parser,
  cards22: cards22Parser,
  columns10: columns10Parser,
  hero25: hero25Parser,
  accordion29: accordion29Parser,
  columns33: columns33Parser,
  columns32: columns32Parser,
  columns19: columns19Parser,
  columns36: columns36Parser,
  columns38: columns38Parser,
  columns39: columns39Parser,
  carousel35: carousel35Parser,
  columns40: columns40Parser,
  cards13: cards13Parser,
  tabs41: tabs41Parser,
  cardsNoImages27: cardsNoImages27Parser,
  columns37: columns37Parser,
  columns50: columns50Parser,
  carousel52: carousel52Parser,
  carousel43: carousel43Parser,
  hero55: hero55Parser,
  cards54: cards54Parser,
  hero56: hero56Parser,
  cards57: cards57Parser,
  columns53: columns53Parser,
  columns58: columns58Parser,
  cards34: cards34Parser,
  columns62: columns62Parser,
  cards63: cards63Parser,
  hero60: hero60Parser,
  cards64: cards64Parser,
  tabs66: tabs66Parser,
  columns67: columns67Parser,
  carousel69: carousel69Parser,
  columns44: columns44Parser,
  accordion72: accordion72Parser,
  columns68: columns68Parser,
  hero70: hero70Parser,
  cards74: cards74Parser,
  cards75: cards75Parser,
  carousel1: carousel1Parser,
  cards78: cards78Parser,
  cards79: cards79Parser,
  carousel80: carousel80Parser,
  carousel77: carousel77Parser,
  accordion82: accordion82Parser,
  cardsNoImages76: cardsNoImages76Parser,
  columns83: columns83Parser,
  cards84: cards84Parser,
  columns65: columns65Parser,
  cards85: cards85Parser,
  cards86: cards86Parser,
  hero89: hero89Parser,
  carousel91: carousel91Parser,
  columns47: columns47Parser,
  tabs92: tabs92Parser,
  columns81: columns81Parser,
  cardsNoImages97: cardsNoImages97Parser,
  cards94: cards94Parser,
  accordion95: accordion95Parser,
  columns88: columns88Parser,
  carousel98: carousel98Parser,
  tabs59: tabs59Parser,
  accordion103: accordion103Parser,
  hero101: hero101Parser,
  columns104: columns104Parser,
  carousel102: carousel102Parser,
  cards105: cards105Parser,
  columns90: columns90Parser,
  cards107: cards107Parser,
  cards109: cards109Parser,
  hero28: hero28Parser,
  tabs111: tabs111Parser,
  hero61: hero61Parser,
  cards100: cards100Parser,
  columns99: columns99Parser,
  hero115: hero115Parser,
  columns117: columns117Parser,
  accordion116: accordion116Parser,
  cards119: cards119Parser,
  columns93: columns93Parser,
  tabs112: tabs112Parser,
  tabs113: tabs113Parser,
  columns106: columns106Parser,
  cards110: cards110Parser,
  columns17: columns17Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
