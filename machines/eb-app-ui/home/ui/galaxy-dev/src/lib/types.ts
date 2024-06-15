// -----------------------------------------------------------------------------
// 000  - public interfaces
// 111  - interfaces accessed by access codes (audiences, candidates etc)
// 222  - interfaces shared with members
// 333  - interfaces shared with partners
// none - interfaces shared with owners
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
export interface Contact {
  id: string;
  name: string;
  profile_name: string;
  profile_email: string;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Domain {
  id: string;
  name: string;
  auth_type: string;
  domain_attr: {
    url: string;
    app_id: string;
    app_secret: string;
    app_alg: string;
    jaas_url: string;
    jaas_app_id: string;
    jaas_kid: string;
    jaas_key: string;
    jaas_alg: string;
    jaas_aud: string;
    jaas_iss: string;
  };
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Domain333 {
  id: string;
  name: string;
  auth_type: string;
  url: string;
  enabled: boolean;
  updated_at: string;
  ownership: string;
  partnership_id: string;
}

// -----------------------------------------------------------------------------
export interface DomainInvite {
  id: string;
  name: string;
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
export interface DomainInvite111 {
  domain_name: string;
  domain_url: string;
  code: string;
}

// -----------------------------------------------------------------------------
export interface DomainPartner {
  id: string;
  domain_id: string;
  contact_name: string;
  profile_name: string;
  profile_email: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainPartnerCandidacy {
  id: string;
  domain_name: string;
  domain_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainPartnerCandidate {
  id: string;
  domain_id: string;
  contact_name: string;
  profile_name: string;
  profile_email: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainPartnership {
  id: string;
  domain_name: string;
  domain_url: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Meeting {
  id: string;
  name: string;
  info: string;
  profile_id: string;
  profile_name: string;
  profile_email: string;
  domain_id: string;
  domain_name: string;
  domain_url: boolean;
  domain_enabled: boolean;
  room_id: string;
  room_name: string;
  room_enabled: boolean;
  room_ephemeral: boolean;
  schedule_type: string;
  hidden: boolean;
  restricted: boolean;
  subscribable: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Meeting222 {
  id: string;
  name: string;
  info: string;
  domain_name: string;
  domain_url: boolean;
  room_name: string;
  room_ephemeral: boolean;
  schedule_type: string;
  session_list: string[];
  session_at: string;
  hidden: boolean;
  restricted: boolean;
  subscribable: boolean;
  enabled: boolean;
  chain_enabled: boolean;
  updated_at: string;
  ownership: string;
  membership_id: string;
  join_as: string;
}

// -----------------------------------------------------------------------------
export interface MeetingInvite {
  id: string;
  name: string;
  meeting_id: string;
  meeting_name: string;
  meeting_info: string;
  meeting_schedule_type: string;
  code: string;
  invite_to: string;
  join_as: string;
  disposable: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingInvite111 {
  meeting_name: string;
  meeting_info: string;
  code: string;
  invite_to: string;
  schedule_type: string;
  session_list: [[string, string]];
}

// -----------------------------------------------------------------------------
export interface MeetingMember {
  id: string;
  meeting_id: string;
  contact_name: string;
  profile_name: string;
  profile_email: string;
  join_as: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingMemberCandidacy {
  id: string;
  meeting_name: string;
  meeting_info: string;
  schedule_type: string;
  session_list: [[string, string]];
  join_as: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingMemberCandidate {
  id: string;
  meeting_id: string;
  contact_name: string;
  profile_name: string;
  profile_email: string;
  join_as: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingMembership {
  id: string;
  profile_id: string;
  profile_name: string;
  profile_email: string;
  meeting_name: string;
  meeting_info: string;
  join_as: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingSchedule {
  id: string;
  meeting_id: string;
  name: string;
  schedule_attr: {
    [key: string]: string;
  };
  session_at: string;
  session_remaining: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingSchedule222 {
  meeting_id: string;
  meeting_name: string;
  meeting_info: string;
  schedule_name: string;
  started_at: string;
  ended_at: string;
  duration: number;
  waiting_time: number;
  join_as: string;
  membership_id: string;
}

// -----------------------------------------------------------------------------
export interface MeetingSchedule111 {
  code: string;
  meeting_name: string;
  meeting_info: string;
  schedule_name: string;
  started_at: string;
  ended_at: string;
  duration: number;
  waiting_time: number;
  join_as: string;
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
  domain_url: string;
  domain_enabled: boolean;
  has_suffix: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  accessed_at: string;
}

// -----------------------------------------------------------------------------
export interface Room333 {
  id: string;
  name: string;
  domain_name: string;
  domain_url: string;
  enabled: boolean;
  chain_enabled: boolean;
  updated_at: string;
  ownership: string;
  partnership_id: string;
}

// -----------------------------------------------------------------------------
export interface RoomInvite {
  id: string;
  name: string;
  room_id: string;
  room_name: string;
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
export interface RoomInvite111 {
  room_name: string;
  domain_name: string;
  domain_url: string;
  code: string;
}

// -----------------------------------------------------------------------------
export interface RoomPartner {
  id: string;
  room_id: string;
  contact_name: string;
  profile_name: string;
  profile_email: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomPartnerCandidacy {
  id: string;
  room_name: string;
  domain_name: string;
  domain_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomPartnerCandidate {
  id: string;
  room_id: string;
  contact_name: string;
  profile_name: string;
  profile_email: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomPartnership {
  id: string;
  room_name: string;
  domain_name: string;
  domain_url: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}
