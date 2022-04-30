type Level = "fatal" | "error" | "warn" | "info" | "debug";

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
    const { level = "info" } = options;
    this.level = level;
  }

  private log(level: Level, message: string, data: unknown = {}) {
    if (levelValueMap[level] >= levelValueMap[this.level]) {
      console.log(message, JSON.stringify(data));
    }
  }

  public fatal(message: string, data?: unknown) {
    this.log("error", message, data);
  }

  public error(message: string, data?: unknown) {
    this.log("error", message, data);
  }

  public warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  public info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  public debug(message: string, data?: unknown) {
    this.log("debug", message, data);
  }
}

const logger = new Logger({
  level: "info",
});

export function useLogger(): Logger {
  return logger;
}
