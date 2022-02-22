// -----------------------------------------------------------------------------
export interface Attributes {
  name: string;
  type: string;
  value?: string;
  disabled: boolean;
  required?: boolean;
}

// -----------------------------------------------------------------------------
export interface Label {
  id: number;
  type: string;
  text: string;
  context?: unknown;
}

// -----------------------------------------------------------------------------
export interface Message {
  id: number;
  type: string;
  text: string;
  context?: unknown;
}

// -----------------------------------------------------------------------------
export interface Meta {
  label?: Label;
}

// -----------------------------------------------------------------------------
export interface Node {
  type: string;
  group: string;
  attributes: Attributes;
  messages: Message[];
  meta: Meta;
}

// -----------------------------------------------------------------------------
export interface UI {
  action: string;
  method: string;
  messages?: Message[];
  nodes: Node[];
  "updated_at": string;
}

// -----------------------------------------------------------------------------
export interface KratosForm {
  instanceOf: "KratosForm";
  id: string;
  type: string;
  forced?: boolean;
  ui: UI;
  "created_at"?: string;
  "expires_at": string;
  "issued_at": string;
  "updated_at"?: string;
  "request_url": string;
}

// -----------------------------------------------------------------------------
export interface KratosError {
  instanceOf: "KratosError";
  error: {
    code: number;
    message: string;
    status: string;
    reason?: string;
    details?: {
      docs: string;
      hint: string;
      "redirect_to": string;
      "reject_reason": string;
    };
  };
}

// -----------------------------------------------------------------------------
export interface KratosLogout {
  instanceOf: "KratosLogout";
  "logout_url": string;
}

// -----------------------------------------------------------------------------
export interface KratosIdentity {
  id: string;
  traits: {
    email: string;
  };
  state: string;
  "created_at": string;
  "updated_at": string;
}

// -----------------------------------------------------------------------------
export interface KratosLoad {
  status?: number;
  redirect?: string;
  props?: {
    [key: string]:
      | string
      | KratosError
      | KratosForm
      | KratosIdentity
      | KratosLogout;
  };
}
