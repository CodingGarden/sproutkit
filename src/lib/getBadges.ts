import Badge from '@/interfaces/Badge';
import BadgesResponse, {
  BadgeResponseItem,
} from '@/interfaces/BadgesResponse';

const BADGES_BASE_URL = 'https://badges.twitch.tv/v1/badges';

let badgeInfo: BadgesResponse;
const channelBadgeInfo: {
  [key: string]: BadgesResponse;
} = {};

const getSrcSet = (versionInfo: BadgeResponseItem) => [
  [versionInfo.image_url_4x, '4x'].join(' '),
  [versionInfo.image_url_2x, '2x'].join(' '),
  [versionInfo.image_url_1x, '1x'].join(' '),
].join(', ');

const cache = new Map<string, Badge[]>();

export default async function getBadges(
  badges: string,
  channelId?: string,
): Promise<Badge[]> {
  const cacheName = badges + channelId;
  if (cache.has(cacheName)) return cache.get(cacheName) as Badge[];
  if (!badgeInfo) {
    const response = await fetch(`${BADGES_BASE_URL}/global/display`);
    badgeInfo = (await response.json()) as BadgesResponse;
  }
  if (channelId && !channelBadgeInfo[channelId]) {
    const response = await fetch(
      `${BADGES_BASE_URL}/channels/${channelId}/display`,
    );
    channelBadgeInfo[channelId] = (await response.json()) as BadgesResponse;
  }
  const results: Badge[] = [];
  badges.split(',').forEach((badge) => {
    const [name, version] = badge.split('/');
    let versionInfo: BadgeResponseItem | null = null;
    if (channelId && name === 'subscriber') {
      if (!channelBadgeInfo[channelId]) return;
      const info = channelBadgeInfo[channelId].badge_sets[name];
      if (info && info.versions[version]) {
        versionInfo = info.versions[version];
        if (!versionInfo.srcSet) {
          versionInfo.srcSet = getSrcSet(versionInfo);
        }
      }
    }
    if (!versionInfo) {
      const info = badgeInfo.badge_sets[name];
      if (info && info.versions[version]) {
        versionInfo = info.versions[version];
        if (!versionInfo.srcSet) {
          versionInfo.srcSet = getSrcSet(versionInfo);
        }
      }
    }
    if (versionInfo) {
      results.push({
        name: versionInfo.title,
        srcSet: versionInfo.srcSet || '',
        url: versionInfo.image_url_1x || versionInfo.image_url_2x || versionInfo.image_url_4x,
      });
    }
  });
  cache.set(cacheName, results);
  return results;
}
