import winston from "winston";
//TODO: Recheck the logger configuration
export const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "master-backend",
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            silent: process.env.NODE_ENV === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: process.env.NODE_ENV === "test",
        }),
        new winston.transports.Console({
            level: "info",
            silent: process.env.NODE_ENV === "test",
        }),
    ],
});


