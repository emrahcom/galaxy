export const HOSTNAME = "127.0.0.1";
export const PORT = 8000;

export type Algorithm = "none" | "HS256" | "HS512" | "RS256";
export const JWT_ALG: Algorithm = "HS512";
export const JWT_AUD = "myapp";
export const JWT_ISS = "myapp";
export const JWT_SECRET = "mysecret";
export const JWT_TIMEOUT = 8 * 60 * 60;

export const DB_USER = "galaxy";
export const DB_PASSWD = "galaxy";
export const DB_NAME = "galaxy";
export const DB_HOST = "postgres";
export const DB_PORT = 5432;
export const DB_POOL_SIZE = 8;
