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
