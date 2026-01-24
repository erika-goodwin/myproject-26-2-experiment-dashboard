declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: string;
    DATABASE_URL: string;
  }
}
