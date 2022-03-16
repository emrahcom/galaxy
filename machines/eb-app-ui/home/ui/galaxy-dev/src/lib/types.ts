export interface Domain {
  id: string;
  name: string;
  auth_type: string;
  domain_attr: {
    url: string;
    app_id: string;
    app_secret: string;
  };
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainReduced {
  id: string;
  name: string;
  auth_type: string;
  url: string;
  enabled: boolean;
  ownership: string;
}

// -----------------------------------------------------------------------------
export interface DomainInvite {
  id: string;
  domain_id: string;
  domain_name: string;
  domain_url: string;
  code: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainInviteReduced {
  domain_name: string;
  domain_url: string;
  code: string;
}

// -----------------------------------------------------------------------------
export interface Meeting {
  id: string;
  profile_id: string;
  profile_name: string;
  domain_id: string;
  domain_name: string;
  domain_enabled: boolean;
  domain_owner_enabled: boolean;
  room_id: string;
  room_name: string;
  room_enabled: boolean;
  room_owner_enabled: boolean;
  host_key: string;
  guest_key: string;
  name: string;
  info: string;
  schedule_type: string;
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
  domain_enabled: boolean;
  domain_owner_enabled: boolean;
  has_suffix: boolean;
  suffix: string;
  enabled: boolean;
  owner_enabled: boolean;
  chain_enabled: boolean;
  created_at: string;
  updated_at: string;
  accessed_at: string;
}
