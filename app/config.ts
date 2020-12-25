export const HOSTNAME: string = "127.0.0.1";
export const PORT: number = 8000;

export type Algorithm = "none" | "HS256" | "HS512" | "RS256";
export const JWT_ALG: Algorithm = "HS512";
export const JWT_AUD: string = "myapp";
export const JWT_ISS: string = "myapp";
export const JWT_SECRET: string = "mysecret";
export const JWT_TIMEOUT: number = 8 * 60 * 60;
export const JWT_ADMIN_TIMEOUT: number = 2 * 60;

export const DB_USER: string = "galaxy";
export const DB_PASSWD: string = "galaxy";
export const DB_NAME: string = "galaxy";
export const DB_HOST: string = "postgres";
export const DB_PORT: number = 5432;
export const DB_POOL_SIZE: number = 8;
