export interface Domain {
  id: string;
  name: string;
  auth_type: string;
  auth_attr: {
    url: string;
    app_id: string;
    app_secret: string;
  };
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Meeting {
  id: string;
  profile_id: string;
  profile_name: string;
  domain_id: string;
  domain_name: string;
  room_id: string;
  room_name: string;
  host_key: string;
  guest_key: string;
  name: string;
  info: string;
  schedule_type: string;
  schedule_attr: unknown;
  hidden: boolean;
  restricted: boolean;
  subscribable: boolean;
  enabled: boolean;
  chain_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Profile {
  id: string;
  name: string;
  email: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Room {
  id: string;
  name: string;
  domain_id: string;
  domain_name: string;
  has_suffix: boolean;
  suffix: string;
  enabled: boolean;
  chain_enabled: boolean;
  created_at: string;
  updated_at: string;
  accessed_at: string;
}
