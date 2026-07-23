import { execFileSync } from "node:child_process";

const forbiddenPathPattern = /promo/i;
const proScopePathPattern = /^(?:dist\/pro(?:\.html|\/)|dist\/assets\/pro\/|scripts\/(?:fixtures\/)?pro-|scripts\/test-pro-|tests\/pro\/|docs\/[^/]*PRO[^/]*|playwright\.pro\.config\.mjs$)/i;

export function proScopeFiles(files) {
  return [...new Set((files || []).map(String).filter(Boolean))].filter((file) =>
    proScopePathPattern.test(file.replaceAll("\\", "/")),
  );
}

export function forbiddenProScopeFiles(files) {
  return [...new Set((files || []).map(String).filter(Boolean))].filter((file) =>
    forbiddenPathPattern.test(file.replaceAll("\\", "/")),
  );
}

export function assertProOnlyChanges(files) {
  const forbidden = forbiddenProScopeFiles(files);
  if (forbidden.length) {
    throw new Error(
      "Pro-only change guard rejected forbidden paths:\n" +
        forbidden.map((file) => "- " + file).join("\n"),
    );
  }
  return true;
}

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

export function validateBaseSha(baseSha, cwd = process.cwd()) {
  if (!baseSha) throw new Error("Comparison base SHA is empty");
  git(["cat-file", "-e", `${baseSha}^{commit}`], cwd);
  return baseSha;
}

export function changedFilesFromBase(baseSha, cwd = process.cwd()) {
  validateBaseSha(baseSha, cwd);
  const changed = git(["diff", "--name-only", baseSha, "--"], cwd)
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
  const untracked = git(["ls-files", "--others", "--exclude-standard"], cwd)
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
  return [...new Set([...changed, ...untracked])];
}

export function resolveComparisonBase({
  cwd = process.cwd(),
  env = process.env,
} = {}) {
  const explicit = String(env.PRO_SMOKE_BASE_SHA || "").trim();
  if (explicit) return validateBaseSha(explicit, cwd);
  if (String(env.CI || "").toLowerCase() === "true") {
    throw new Error(
      "PRO_SMOKE_BASE_SHA is required in CI; refusing to skip the Pro-only change guard",
    );
  }
  try {
    return validateBaseSha(git(["merge-base", "HEAD", "origin/main"], cwd), cwd);
  } catch (error) {
    console.warn(
      "Warning: Pro-only change guard could not resolve origin/main locally:",
      error.message,
    );
    return "";
  }
}

export function verifyWorkingTreeScope(options = {}) {
  const baseSha = resolveComparisonBase(options);
  if (!baseSha) return { baseSha: "", changed: [], skipped: true };
  const changed = changedFilesFromBase(baseSha, options.cwd);
  if (!proScopeFiles(changed).length) {
    return { baseSha, changed, skipped: true, reason: "no_pro_files_changed" };
  }
  assertProOnlyChanges(changed);
  return { baseSha, changed, skipped: false };
}
