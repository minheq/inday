type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug';

const levelValueMap: { [level in Level]: number } = {
  fatal: 50,
  error: 40,
  warn: 30,
  info: 20,
  debug: 10,
};

interface Options {
  level?: Level;
}

class Logger {
  private level: Level;

  constructor(options: Options) {
    const { level = 'info' } = options;
    this.level = level;
  }

  private log(level: Level, message: string) {
    if (levelValueMap[level] >= levelValueMap[this.level]) {
      console.log(message);
    }
  }

  public fatal(message: string) {
    this.log('error', message);
  }

  public error(message: string) {
    this.log('error', message);
  }

  public warn(message: string) {
    this.log('warn', message);
  }

  public info(message: string) {
    this.log('info', message);
  }

  public debug(message: string) {
    this.log('debug', message);
  }
}

const logger = new Logger({
  level: 'info',
});

export function useLogger() {
  return logger;
}
