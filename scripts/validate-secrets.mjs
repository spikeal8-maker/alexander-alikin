import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function walk(dir, exts) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", "dist", ".astro", ".git", ".work"].includes(entry.name)
    ) {
      files.push(...walk(full, exts));
    } else if (entry.isFile() && exts.some((e) => entry.name.endsWith(e))) {
      files.push(full);
    }
  }
  return files;
}

const srcFiles = walk(path.join(root, "src"), [".ts", ".mjs", ".css"]).concat(
  walk(path.join(root, "scripts"), [".mjs"]),
);
const errors = [];
const nonContentFiles = srcFiles.filter((f) => !f.includes(path.sep + "content" + path.sep));

// Check for secrets in non-content files
const secretPatterns = [
  { name: "PRIVATE KEY", re: /BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/ },
  { name: "GitHub token", re: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
  { name: "OpenAI key", re: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z_-]{30,}/ },
  { name: "API key in string", re: /api[_ -]?key\s*[:=]\s*['"][^'"]+['"]/i },
  { name: "password in string", re: /password\s*[:=]\s*['"][^'"]+['"]/i },
  { name: "token in string", re: /token\s*[:=]\s*['"][^'"]+['"]/i },
];

for (const file of nonContentFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.re.test(content)) {
      errors.push(`${file}: possible secret (${pattern.name})`);
    }
  }
}

// Check for forbidden files in git
const allDirFiles = walk(root, []);
for (const file of allDirFiles) {
  const name = path.basename(file);
  if (name === ".env" && !file.endsWith(".example")) {
    errors.push(`${file}: .env file committed (only .env.example allowed)`);
  }
  if (
    file.endsWith(".tar") ||
    file.endsWith(".tar.gz") ||
    file.endsWith(".zip") ||
    file.endsWith(".b64")
  ) {
    errors.push(`${file}: archive or base64 file found`);
  }
}

if (errors.length) {
  console.error("SECRET/LEAK ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Secret scan: PASS");
