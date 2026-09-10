import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, "../../logs");
const logFile = path.join(logDirectory, "requests.log");
const MAX_LOG_SIZE = Number(process.env.MAX_LOG_SIZE || 10) * 1024 * 1024;
const MAX_TOTAL_SIZE = Number(process.env.MAX_TOTAL_SIZE || 100) * 1024 * 1024;

let writeQueue = Promise.resolve();

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
    };

    const logLine = JSON.stringify(log) + "\n";

    writeQueue = writeQueue
      .then(() => writeLog(logLine))
      .catch((err) => console.error("Failed to write request log:", err));
  });

  next();
}

async function writeLog(log: string): Promise<void> {
  const logSize = Buffer.byteLength(log, "utf8");

  let currentLogSize = 0;

  try {
    const stats = await fs.promises.stat(logFile);
    currentLogSize = stats.size;
  } catch (error) {
    currentLogSize = 0;
  }

  if (logSize + currentLogSize >= MAX_LOG_SIZE) await rotateLog();

  await fs.promises.appendFile(logFile, log, "utf8");

  await cleanUpLogs();
}

async function rotateLog(): Promise<void> {
  try {
    await fs.promises.access(logFile);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const rotateFile = path.join(logDirectory, `requests-${timestamp}.log`);

    await fs.promises.rename(logFile, rotateFile);
  } catch (error) {
    console.error("Failed to rotate log:", error);
    return;
  }
}

async function cleanUpLogs(): Promise<void> {
  const files = await fs.promises.readdir(logDirectory);

  const logFiles = [];

  for (let file of files) {
    if (!file.endsWith(".log")) {
      continue;
    }

    const filePath = path.join(logDirectory, file);

    const fileStat = await fs.promises.stat(filePath);

    logFiles.push({
      path: filePath,
      size: fileStat.size,
      modified: fileStat.mtimeMs,
    });
  }

  let totalSize = logFiles.reduce((total, file) => total + file.size, 0);
  logFiles.sort((a, b) => a.modified - b.modified);

  while (totalSize > MAX_TOTAL_SIZE && logFiles.length > 0) {
    const oldest = logFiles.shift();

    if (!oldest) break;

    await fs.promises.unlink(oldest.path);

    totalSize -= oldest.size;
  }
}

export default requestLogger;