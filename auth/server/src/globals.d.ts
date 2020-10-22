declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    JWT_ACCESS_SECRET: string
    JWT_REFRESH_SECRET: string
    PORT?: string
  }
}
