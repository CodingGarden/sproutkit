import DOMPurify from 'dompurify';
import showdown from 'showdown';

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

export default function sanitizeMessage(message: string, trusted: boolean) {
  if (trusted) {
    return DOMPurify.sanitize(converter.makeHtml(message), {
      FORBID_ATTR: ['style', 'onerror', 'onload', 'class'],
      FORBID_TAGS: [
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
    ALLOWED_TAGS: ['img'],
    ALLOWED_ATTR: [],
  });
}
