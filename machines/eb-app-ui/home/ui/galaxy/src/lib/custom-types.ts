import type {
  KratosError,
  KratosForm,
  KratosIdentity,
  KratosLogout,
} from "$lib/kratos-types";

export interface LoadOutput {
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
