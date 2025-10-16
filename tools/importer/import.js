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
import carousel1Parser from './parsers/carousel1.js';
import carousel5Parser from './parsers/carousel5.js';
import accordion4Parser from './parsers/accordion4.js';
import cards2Parser from './parsers/cards2.js';
import columns8Parser from './parsers/columns8.js';
import hero9Parser from './parsers/hero9.js';
import columns10Parser from './parsers/columns10.js';
import tabs6Parser from './parsers/tabs6.js';
import cards13Parser from './parsers/cards13.js';
import columns11Parser from './parsers/columns11.js';
import cards7Parser from './parsers/cards7.js';
import accordion17Parser from './parsers/accordion17.js';
import columns16Parser from './parsers/columns16.js';
import columns20Parser from './parsers/columns20.js';
import columns14Parser from './parsers/columns14.js';
import columns19Parser from './parsers/columns19.js';
import cards25Parser from './parsers/cards25.js';
import cards22Parser from './parsers/cards22.js';
import columns26Parser from './parsers/columns26.js';
import carousel24Parser from './parsers/carousel24.js';
import columns27Parser from './parsers/columns27.js';
import columns29Parser from './parsers/columns29.js';
import accordion33Parser from './parsers/accordion33.js';
import hero31Parser from './parsers/hero31.js';
import hero32Parser from './parsers/hero32.js';
import tabs36Parser from './parsers/tabs36.js';
import cards34Parser from './parsers/cards34.js';
import cardsNoImages35Parser from './parsers/cardsNoImages35.js';
import columns37Parser from './parsers/columns37.js';
import columns40Parser from './parsers/columns40.js';
import columns43Parser from './parsers/columns43.js';
import columns44Parser from './parsers/columns44.js';
import columns45Parser from './parsers/columns45.js';
import hero46Parser from './parsers/hero46.js';
import columns41Parser from './parsers/columns41.js';
import hero50Parser from './parsers/hero50.js';
import tabs51Parser from './parsers/tabs51.js';
import columns52Parser from './parsers/columns52.js';
import columns49Parser from './parsers/columns49.js';
import columns53Parser from './parsers/columns53.js';
import cards54Parser from './parsers/cards54.js';
import hero55Parser from './parsers/hero55.js';
import hero56Parser from './parsers/hero56.js';
import columns58Parser from './parsers/columns58.js';
import cards57Parser from './parsers/cards57.js';
import cards61Parser from './parsers/cards61.js';
import columns63Parser from './parsers/columns63.js';
import accordion64Parser from './parsers/accordion64.js';
import columns60Parser from './parsers/columns60.js';
import hero59Parser from './parsers/hero59.js';
import columns66Parser from './parsers/columns66.js';
import columns67Parser from './parsers/columns67.js';
import cards68Parser from './parsers/cards68.js';
import columns65Parser from './parsers/columns65.js';
import cardsNoImages73Parser from './parsers/cardsNoImages73.js';
import cardsNoImages75Parser from './parsers/cardsNoImages75.js';
import carousel69Parser from './parsers/carousel69.js';
import cardsNoImages76Parser from './parsers/cardsNoImages76.js';
import cardsNoImages77Parser from './parsers/cardsNoImages77.js';
import tabs79Parser from './parsers/tabs79.js';
import hero80Parser from './parsers/hero80.js';
import cards70Parser from './parsers/cards70.js';
import hero81Parser from './parsers/hero81.js';
import cards78Parser from './parsers/cards78.js';
import hero82Parser from './parsers/hero82.js';
import cards83Parser from './parsers/cards83.js';
import cards86Parser from './parsers/cards86.js';
import cardsNoImages84Parser from './parsers/cardsNoImages84.js';
import columns87Parser from './parsers/columns87.js';
import accordion89Parser from './parsers/accordion89.js';
import carousel85Parser from './parsers/carousel85.js';
import carousel88Parser from './parsers/carousel88.js';
import cards92Parser from './parsers/cards92.js';
import cards91Parser from './parsers/cards91.js';
import columns90Parser from './parsers/columns90.js';
import cards94Parser from './parsers/cards94.js';
import cards96Parser from './parsers/cards96.js';
import cards93Parser from './parsers/cards93.js';
import carousel99Parser from './parsers/carousel99.js';
import hero97Parser from './parsers/hero97.js';
import columns98Parser from './parsers/columns98.js';
import columns101Parser from './parsers/columns101.js';
import tabs100Parser from './parsers/tabs100.js';
import cards103Parser from './parsers/cards103.js';
import tableNoHeader105Parser from './parsers/tableNoHeader105.js';
import columns102Parser from './parsers/columns102.js';
import carousel107Parser from './parsers/carousel107.js';
import cardsNoImages106Parser from './parsers/cardsNoImages106.js';
import columns108Parser from './parsers/columns108.js';
import cards109Parser from './parsers/cards109.js';
import hero110Parser from './parsers/hero110.js';
import accordion112Parser from './parsers/accordion112.js';
import columns113Parser from './parsers/columns113.js';
import accordion104Parser from './parsers/accordion104.js';
import cards114Parser from './parsers/cards114.js';
import columns115Parser from './parsers/columns115.js';
import cards116Parser from './parsers/cards116.js';
import columns117Parser from './parsers/columns117.js';
import carousel111Parser from './parsers/carousel111.js';
import columns118Parser from './parsers/columns118.js';
import tabs121Parser from './parsers/tabs121.js';
import cards120Parser from './parsers/cards120.js';
import tabs123Parser from './parsers/tabs123.js';
import accordion126Parser from './parsers/accordion126.js';
import tabs122Parser from './parsers/tabs122.js';
import columns127Parser from './parsers/columns127.js';
import cards129Parser from './parsers/cards129.js';
import cards119Parser from './parsers/cards119.js';
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
  carousel1: carousel1Parser,
  carousel5: carousel5Parser,
  accordion4: accordion4Parser,
  cards2: cards2Parser,
  columns8: columns8Parser,
  hero9: hero9Parser,
  columns10: columns10Parser,
  tabs6: tabs6Parser,
  cards13: cards13Parser,
  columns11: columns11Parser,
  cards7: cards7Parser,
  accordion17: accordion17Parser,
  columns16: columns16Parser,
  columns20: columns20Parser,
  columns14: columns14Parser,
  columns19: columns19Parser,
  cards25: cards25Parser,
  cards22: cards22Parser,
  columns26: columns26Parser,
  carousel24: carousel24Parser,
  columns27: columns27Parser,
  columns29: columns29Parser,
  accordion33: accordion33Parser,
  hero31: hero31Parser,
  hero32: hero32Parser,
  tabs36: tabs36Parser,
  cards34: cards34Parser,
  cardsNoImages35: cardsNoImages35Parser,
  columns37: columns37Parser,
  columns40: columns40Parser,
  columns43: columns43Parser,
  columns44: columns44Parser,
  columns45: columns45Parser,
  hero46: hero46Parser,
  columns41: columns41Parser,
  hero50: hero50Parser,
  tabs51: tabs51Parser,
  columns52: columns52Parser,
  columns49: columns49Parser,
  columns53: columns53Parser,
  cards54: cards54Parser,
  hero55: hero55Parser,
  hero56: hero56Parser,
  columns58: columns58Parser,
  cards57: cards57Parser,
  cards61: cards61Parser,
  columns63: columns63Parser,
  accordion64: accordion64Parser,
  columns60: columns60Parser,
  hero59: hero59Parser,
  columns66: columns66Parser,
  columns67: columns67Parser,
  cards68: cards68Parser,
  columns65: columns65Parser,
  cardsNoImages73: cardsNoImages73Parser,
  cardsNoImages75: cardsNoImages75Parser,
  carousel69: carousel69Parser,
  cardsNoImages76: cardsNoImages76Parser,
  cardsNoImages77: cardsNoImages77Parser,
  tabs79: tabs79Parser,
  hero80: hero80Parser,
  cards70: cards70Parser,
  hero81: hero81Parser,
  cards78: cards78Parser,
  hero82: hero82Parser,
  cards83: cards83Parser,
  cards86: cards86Parser,
  cardsNoImages84: cardsNoImages84Parser,
  columns87: columns87Parser,
  accordion89: accordion89Parser,
  carousel85: carousel85Parser,
  carousel88: carousel88Parser,
  cards92: cards92Parser,
  cards91: cards91Parser,
  columns90: columns90Parser,
  cards94: cards94Parser,
  cards96: cards96Parser,
  cards93: cards93Parser,
  carousel99: carousel99Parser,
  hero97: hero97Parser,
  columns98: columns98Parser,
  columns101: columns101Parser,
  tabs100: tabs100Parser,
  cards103: cards103Parser,
  tableNoHeader105: tableNoHeader105Parser,
  columns102: columns102Parser,
  carousel107: carousel107Parser,
  cardsNoImages106: cardsNoImages106Parser,
  columns108: columns108Parser,
  cards109: cards109Parser,
  hero110: hero110Parser,
  accordion112: accordion112Parser,
  columns113: columns113Parser,
  accordion104: accordion104Parser,
  cards114: cards114Parser,
  columns115: columns115Parser,
  cards116: cards116Parser,
  columns117: columns117Parser,
  carousel111: carousel111Parser,
  columns118: columns118Parser,
  tabs121: tabs121Parser,
  cards120: cards120Parser,
  tabs123: tabs123Parser,
  accordion126: accordion126Parser,
  tabs122: tabs122Parser,
  columns127: columns127Parser,
  cards129: cards129Parser,
  cards119: cards119Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  replaceWithErrorBlock: (element, message) => {
    if (!element || !element.parentElement) return;
    const headerRow = ['Columns (exc-import-error)'];
    const rows = [headerRow, [message]];

    const errorElement = WebImporter.DOMUtils.createTable(rows, document);
    try {
      element.replaceWith(errorElement);
    } catch (e) {
      console.warn(`Failed to replace element with error element: ${message}`, e);
    }
  },
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
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

const ReportBuilder = () => {
  const report = { 'Has Failed Parser': 'false', 'Failed Parsers': [] };
  return {
    getReport: () => report,
    addFailedParser: (parserName) => {
      report['Has Failed Parser'] = 'true';
      report['Failed Parsers'].push(parserName);
    },
  };
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL }, reportBuilder } = source;

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
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, document.body, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const emptyElement = document.createElement('div');
      const { element = emptyElement, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];

      let parserElement = element;
      if (typeof parserElement === 'string') {
        parserElement = document.body.querySelector(parserElement);
      }
      const originalContent = parserElement.innerHTML;
      try {
        main.append(parserElement);
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
        if (parserFn) {
          // parse the element
          parserFn.call(this, parserElement, { ...source });
          if (parserElement.parentElement && parserElement.innerHTML === originalContent) {
            WebImporter.Import.replaceWithErrorBlock(parserElement, `Failed to parse content into block - please check the parser ${parserName}`);
            reportBuilder.addFailedParser(parserName);
          }
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
        WebImporter.Import.reaplceWithErrorBlock(parserElement, `Failed to parse content into block with exception: "${e.message}" - please check the parser ${parserName}`);
        if (parserFn) {
          reportBuilder.addFailedParser(parserName);
        }
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, {
  fragment, inventory, publishUrl, ...source
}) {
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
        ...source, document, fragment, bodyWidth, publishUrl,
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

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

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

    const reportBuilder = ReportBuilder();
    const sourceBody = document.body;
    const main = document.createElement('div');

    // before transform hook
    WebImporter.Import.transform(
      TransformHook.beforeTransform,
      sourceBody,
      { ...payload, inventory },
    );

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
      transformFragment(main, {
        ...payload, fragment, inventory, publishUrl, reportBuilder,
      });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory, reportBuilder });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(
      TransformHook.afterTransform,
      main,
      { ...payload, inventory },
    );

    return [{
      element: main,
      path,
      report: reportBuilder.getReport(),
    }];
  },
};
