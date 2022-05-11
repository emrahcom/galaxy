import { writable } from "svelte/store";
import type { KratosIdentity } from "$lib/kratos/types";

export default writable({} as KratosIdentity);
