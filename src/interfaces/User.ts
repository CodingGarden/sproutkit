import Follow from './Follow';
import Subscription from './Subscription';
import Country from './Country';

export default interface User {
  _id?: string;
  name: string;
  bio?: null;
  created_at?: Date;
  display_name: string;
  id?: string;
  logo: string;
  type?: string;
  updated_at?: Date;
  follow: Follow | boolean;
  subscription: Subscription | boolean;
  team?: string;
  country?: Country;
}
