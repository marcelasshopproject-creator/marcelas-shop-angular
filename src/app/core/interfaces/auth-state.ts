import { User } from '@supabase/supabase-js';
import { Profile } from './profile';

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean
}
