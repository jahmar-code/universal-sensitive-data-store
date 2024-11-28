declare namespace NodeJS {
    interface ProcessEnv {
        DB_HOST: string;
        DB_PORT: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        API_KEY: string;
    }
}