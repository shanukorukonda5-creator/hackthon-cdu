import * as cheerio from 'cheerio';
import ContentCleaner from './ContentCleaner.js';
import MetadataExtractor from './MetadataExtractor.js';
import { logger } from '../utils/logger.js';

export const WebsiteProcessor = {
  async processUrl(targetUrl) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract title
      const title = $('title').text().trim() || $('h1').first().text().trim() || targetUrl;

      // Strip noise elements: nav, header, footer, script, style, ads, cookie banners
      $(
        'script, style, nav, header, footer, iframe, noscript, svg, [role="banner"], [role="navigation"], .ads, .cookie-banner, .advertisement'
      ).remove();

      // Extract structured main content
      let textPieces = [];
      $('main, article, #content, .content, body').find('h1, h2, h3, h4, p, li').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 5) {
          textPieces.push(text);
        }
      });

      const rawText = textPieces.join('\n\n') || $('body').text().trim();
      const cleanText = ContentCleaner.cleanText(rawText);
      const metrics = MetadataExtractor.extractMetrics(cleanText, 1);

      return {
        type: 'url',
        url: targetUrl,
        title,
        extractedText: cleanText,
        ...metrics,
      };
    } catch (err) {
      logger.error(`WebsiteProcessor failed for URL ${targetUrl}:`, err.message);
      throw new Error(`Failed to scrape URL content: ${err.message}`);
    }
  },
};

export default WebsiteProcessor;
