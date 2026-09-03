import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nextDir = __dirname.replace("packages/config/eslint", "apps");

export { nextDir };
