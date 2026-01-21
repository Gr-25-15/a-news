import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

const isLogin = process.argv[2] === "login";
const cwd = process.cwd();
const configDir = path.join(cwd, ".stripe-config");

// Ensure config dir exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

console.log(`> Running Docker command for Stripe CLI (${isLogin ? "login" : "run"})...`);

const args = ["run", "--rm", "-it", "--network=host", "-v", `${configDir}:/root/.config/stripe`];

if (isLogin) {
  // Equivalent to: -e STRIPE_SECRET_KEY --entrypoint sh stripe/stripe-cli:latest -c 'stripe login --api-key "$STRIPE_SECRET_KEY"'
  args.push(
    "-e",
    "STRIPE_SECRET_KEY",
    "--entrypoint",
    "sh",
    "stripe/stripe-cli:latest",
    "-c",
    'stripe login --api-key "$STRIPE_SECRET_KEY"',
  );
} else {
  // Forward all provided arguments to the stripe-cli
  args.push("stripe/stripe-cli:latest");
  args.push(...process.argv.slice(2));
}

// execute
const result = spawnSync("docker", args, {
  stdio: "inherit",
});

if (result.error) {
  console.error("Failed to start docker:", result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
