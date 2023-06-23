import { twitchBadges } from '@/lib/services';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import Badge from '@/interfaces/Badge';
import BadgesResponse, {
  BadgeResponseItem,
} from '@/interfaces/BadgesResponse';

const BADGES_BASE_URL = 'https://badges.twitch.tv/v1/badges';

const getSrcSet = (versionInfo: BadgeResponseItem) => [
  [versionInfo.image_url_4x, '4x'].join(' '),
  [versionInfo.image_url_2x, '2x'].join(' '),
  [versionInfo.image_url_1x, '1x'].join(' '),
].join(', ');

const cache = new Map<string, Badge[]>();
const badgeInfoCache = new Map<string, BadgesResponse>();

async function getBadgeInfo() {
  if (badgeInfoCache.has('global')) return badgeInfoCache.get('global');
  const badgePromise = (async () => {
    const badgeInfo = await twitchBadges.get('global') as BadgesResponse;
    badgeInfoCache.set('global', badgeInfo);
    return badgeInfo;
  })();
  // @ts-ignore
  badgeInfoCache.set('global', badgePromise);
  return badgePromise;
}

async function getChannelBadgeInfo(channelId: string) {
  if (badgeInfoCache.has(channelId)) return badgeInfoCache.get(channelId);
  const badgePromise = (async () => {
    const badgeInfo = await twitchBadges.get(channelId) as BadgesResponse;
    badgeInfoCache.set(channelId, badgeInfo);
    return badgeInfo;
  })();
  // @ts-ignore
  badgeInfoCache.set(channelId, badgePromise);
  return badgePromise;
}

export default async function getBadges(
  badges: string,
  channelId?: string,
): Promise<Badge[]> {
  const cacheName = badges + channelId;
  if (cache.has(cacheName)) return cache.get(cacheName) as Badge[];
  const badgePromise = (async () => {
    const badgeInfo = await getBadgeInfo();
    const channelBadgeInfo = await getChannelBadgeInfo(channelId || '');
    const results: Badge[] = [];
    badges.split(',').forEach((badge) => {
      const [name, version] = badge.split('/');
      let versionInfo: BadgeResponseItem | null = null;
      if (channelId && name === 'subscriber') {
        if (!channelBadgeInfo) return;
        const info = channelBadgeInfo.badge_sets[name];
        if (info && info.versions[version]) {
          versionInfo = info.versions[version];
          if (!versionInfo.srcSet) {
            versionInfo.srcSet = getSrcSet(versionInfo);
          }
        }
      }
      if (!versionInfo) {
        // @ts-ignore
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
  })();
  // @ts-ignore
  cache.set(cacheName, badgePromise);
  return badgePromise;
}
