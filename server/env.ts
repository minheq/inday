import dotenv from 'dotenv';

dotenv.config();

const getOsEnv = (key: string, options = { required: false }): string => {
  const osEnv = process.env[key] as string;
  if (options.required && !osEnv) {
    throw new Error(`Environment variable ${key} is required!`);
  }

  return osEnv;
};

function toNumber(value: string): number {
  return Number(value);
}

function toBool(value: string): boolean {
  return value === 'true';
}

export const env = {
  isProduction: toBool(getOsEnv('NODE_ENV')),
  database: {
    host: getOsEnv('DATABASE_HOST'),
    name: getOsEnv('DATABASE_NAME'),
    username: getOsEnv('DATABASE_USERNAME'),
    password: getOsEnv('DATABASE_PASSWORD'),
    port: toNumber(getOsEnv('DATABASE_PORT')),
  },
  logger: {
    level: getOsEnv('LOGGER_LEVEL'),
  },
  port: toNumber(getOsEnv('PORT')),
  nodeEnv: getOsEnv('NODE_ENV'),
};
