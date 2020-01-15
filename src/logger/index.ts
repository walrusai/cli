import winston from 'winston';

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.printf((log) => `${log.message}`),
  ),
  transports: new winston.transports.Console(),
});
