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

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.hasAttribute('src')) {
    const src = node.getAttribute('src') || '';
    if (!whitelist.some((item) => item.exec(src))) {
      node.setAttribute('src', 'https://i.giphy.com/media/xUPGcl3ijl0vAEyIDK/giphy.webp');
    } else {
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
    ALLOWED_TAGS: ['img', 'font', 'big', 'small', 'mark'],
    ALLOWED_ATTR: ['src', 'color', 'face', 'dir', 'title'],
  });
}
