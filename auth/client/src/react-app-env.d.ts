/// <reference types="react-scripts" />

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    BASE_URL?: string
  }
}
