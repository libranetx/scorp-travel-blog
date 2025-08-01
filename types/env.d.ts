declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    NEXTAUTH_SECRET: string;
    NODE_ENV: 'development' | 'production';
  }
}