export const regexps = [
  /^http:\/\/localhost:(\d+)\//,
  /^http:\/\/10\.1\.10\.(\d+):(\d+)\//,
  /^http:\/\/10\.0\.0\.(\d+):(\d+)\//,
];

export const hostnames = [
  'api.coding.garden',
  'fonts.googleapis.com',
  'badges.twitch.tv',
  'static-cdn.jtvnw.net',
  'fonts.gstatic.com',
  'cdn.betterttv.net',
  'cdn.7tv.app',
  'cdn.frankerfacez.com',
  'static.alca.tv',
  'cdn.alca.tv',
  'secretbyte.net',
  'turnergames.net',
  'i.lungers.com',
  'api.disstreamchat.com',
  'cdn.therealpygon.com',
  'infi.s-ul.eu',
  's.mrdemonwolf.com',
  'cdn.nomercy.tv',
  'c.oskr.nl',
  'cdn.davidsnyder.tech',
];

// TEST: must end with slash
export const startsWith = [
  'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/',
];

export const urls = [
  'https://i.giphy.com/media/xUPGcl3ijl0vAEyIDK/giphy.webp',
  'https://i.imgur.com/tcLl4Dz.png',
  'https://i.imgur.com/rD7b0Ki.png',
  'https://i.imgur.com/pukCZL7.png',
  'https://i.imgur.com/TFt8RMh.png',
  'https://i.imgur.com/gtkM6u3.png',
  'https://i.imgur.com/Hl734P3.png',
  'https://i.imgur.com/Pyx1Nqx.gif',
  'https://i.imgur.com/UC7eiSh.png',
];

export function allowUrl(url: string) {
  if (regexps.some((regexp) => regexp.test(url))) return true;
  try {
    const { hostname } = new URL(url);
    if (hostnames.includes(hostname)) return true;
    if (startsWith.some((start) => url.startsWith(start))) return true;
    return urls.includes(url);
  } catch (error) {
    return false;
  }
}
