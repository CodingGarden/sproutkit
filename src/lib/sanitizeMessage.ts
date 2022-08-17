import DOMPurify from 'dompurify';
import showdown from 'showdown';

import whitelist from '../whitelist';

const converter = new showdown.Converter();

const so = (option: string) => {
  converter.setOption(option, true);
};

[
  'underline',
  'strikethrough',
  'emoji',
  'tables',
  'tasklists',
  'smoothLivePreview',
  'openLinksInNewWindow',
  'simplifiedAutoLink',
].forEach(so);

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (node.tagName === 'IMG' && node.parentElement?.tagName !== 'SPAN' && !node.getAttribute('data-wrapped')) {
    node.setAttribute("data-wrapped", "true");
    node.outerHTML = `<span data-wrapper="true" data-title="${node.getAttribute("alt")}">${node.outerHTML}</span>`;
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.hasAttribute('src')) {
    const src = node.getAttribute('src') || '';
    const regexpWhitelist = whitelist.map((url) => {
      const escapedUrl = url.replace(/\./g, '\\.'); // Slashes are escaped by the RegExp constructor
      const fwdSlashCount = escapedUrl.split('/').length - 1;
      const includesPath = fwdSlashCount - 2 > 0; // Remove the two slashes after the protocol from the count
      let trailingCharacter: string;
      if (includesPath) trailingCharacter = url.endsWith('/') ? '' : '$';
      else trailingCharacter = '/'; // Avoid TLDs like .comcast matching with .com
      return new RegExp(`^${escapedUrl}${trailingCharacter}`);
    });
    if (!regexpWhitelist.some((item) => item.exec(src))) {
      node.setAttribute('src', 'https://i.giphy.com/media/xUPGcl3ijl0vAEyIDK/giphy.webp');
    } else if (node.parentElement?.tagName !== 'SPAN') {
      node.setAttribute('title', node.getAttribute('alt') || '');
    }
  }
});

export default function sanitizeMessage(message: string, trusted: boolean) {
  if (trusted) {
    return DOMPurify.sanitize(converter.makeHtml(message), {
      FORBID_ATTR: ['style', 'size', 'onerror', 'onload', 'class'],
      FORBID_TAGS: [
        'svg',
        'dialog',
        'canvas',
        'table',
        'script',
        'audio',
        'video',
        'style',
        'iframe',
        'object',
        'embed',
        'textarea',
        'frame',
        'frameset',
      ],
    });
  }
  return DOMPurify.sanitize(converter.makeHtml(message), {
    ALLOWED_TAGS: ['img', 'font', 'big', 'small', 'mark', 'span'],
    ALLOWED_ATTR: ['src', 'color', 'face', 'dir', 'title', 'alt'],
  });
}
