import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, printf } = format;

const consoleLogFormat = format.combine(
  colorize(),
  printf(({ level, message }) => {
    return `${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "src/logs/app.log" }),
  ],
});

export default logger;
