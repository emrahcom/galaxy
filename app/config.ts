export const HOSTNAME: string = "127.0.0.1";
export const PORT: number = 8000;

export type Algorithm = "none" | "HS256" | "HS512" | "RS256";
export const JWT_ALG: Algorithm = "HS512";
export const JWT_AUD: string = "myapp";
export const JWT_ISS: string = "myapp";
export const JWT_SECRET: string = "mysecret";
export const JWT_TIMEOUT: number = 8 * 60 * 60;
