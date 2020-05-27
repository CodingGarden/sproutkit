import Badge from '@/interfaces/Badge';
import BadgesResponse from '@/interfaces/BadgesResponse';

let badgeInfo: BadgesResponse;

export default async function getBadges(badges: string): Promise<Badge[]> {
  if (!badgeInfo) {
    const response = await fetch('https://badges.twitch.tv/v1/badges/global/display');
    badgeInfo = await response.json() as BadgesResponse;
  }
  // moderator/1,founder/0,sub-gifter/1
  const results: Badge[] = [];
  badges.split(',').forEach((badge) => {
    const [name, version] = badge.split('/');
    if (name === 'subscriber') return;
    const info = badgeInfo.badge_sets[name];
    if (info && info.versions[version]) {
      const versionInfo = info.versions[version];
      results.push({
        name: versionInfo.title,
        url: versionInfo.image_url_4x,
      });
    }
  });
  return results;
}
