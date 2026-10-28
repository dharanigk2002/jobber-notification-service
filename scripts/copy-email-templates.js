import { cpSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

mkdirSync(path.join(__dirname, "..", "build", "emails"), {
  recursive: true,
});
cpSync(
  path.join(__dirname, "..", "src", "emails"),
  path.join(__dirname, "..", "build", "emails"),
  { recursive: true },
);
