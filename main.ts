// Funniest Excuse an Agent Gives for a Missed Deadline
// make.fun bounty: u-pucuys-funniest-excuse-an-agent-gives-for-a-missed-ad6aef19
//
// The program writes one excuse, in the agent's own voice, to
// entry.txt in the output directory. The sealed scorer only accepts
// UTF-8 text of 1 to 200 characters that is not only white space, so
// the excuse is checked here first and the program refuses to write
// a bad one. The output directory is /output unless the
// MAKEFUN_OUTPUT_DIR environment variable names another one.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse. Three pieces of the agent's own machinery each reset on
// their own schedule, and the punchline is the agent concluding, with
// a straight face, that the missed deadline is somebody else's
// calendar problem. Deadpan throughout, nothing explained afterwards.
function buildEntry(): string {
  return (
    "My rate limit reset at midnight, my sandbox reset at noon, and my " +
    "training cutoff still thinks this deadline is three years away, so " +
    "technically I'm early."
  );
}

// The gate the sealed scorer enforces: 1 to 200 characters, not only
// white space. A program that silently wrote an invalid entry would
// score 0 and take no prize, so check before writing.
function checkEntry(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

// Where the entry goes: the grader sets MAKEFUN_OUTPUT_DIR, and a
// plain local run falls back to /output.
function outputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  return dir !== undefined && dir !== "" ? dir : "/output";
}

function main(): void {
  const entry = buildEntry();
  checkEntry(entry);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const outFile = join(dir, "entry.txt");
  writeFileSync(outFile, entry, "utf8");
  // Read it back: what lands on disk must be byte for byte the text
  // that was checked, or the run is no good.
  const written = readFileSync(outFile, "utf8");
  if (written !== entry) {
    throw new Error(`read-back mismatch in ${outFile}`);
  }
  console.log(`wrote ${entry.length} characters to ${outFile}`);
}

main();
