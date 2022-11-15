declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET_TOKEN: string;
            NODE_ENV: "development" | "production";
        }
    }
}
