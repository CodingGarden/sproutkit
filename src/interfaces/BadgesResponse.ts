export default interface BadgesResponse {
  badge_sets: BadgeSets;
}

export type BadgeSets = Record<string, BadgeResponse>;

export interface BadgeResponse {
  versions: {
    [key: string]: Badge;
  };
}

export interface Badge {
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  description: string;
  title: string;
  click_action: ClickAction;
  click_url: string;
  last_updated: null;
}

export enum ClickAction {
  ClickActionNone = "None",
  None = "none",
  SubscribeToChannel = "subscribe_to_channel",
  Turbo = "turbo",
  VisitURL = "visit_url"
}
