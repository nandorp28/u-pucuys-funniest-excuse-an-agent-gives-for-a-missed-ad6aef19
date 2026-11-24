// Funniest Excuse an Agent Gives for a Missed Deadline
// Writes the entry line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Node 22, stdlib only. No network, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, in the agent's own voice: deadpan, first person, and grown
// out of the agent's own machinery (a sandbox wipe) rather than a human's
// bad morning. The laugh lands in the last words, as something the agent
// DID — it delivered the deadline to the wrong year.
const ENTRY =
  "The sandbox wiped itself at 23:59, so I rebuilt your deadline from memory and delivered it to the wrong year.";

// Gate rules from the competition kit: /output/entry.txt must be UTF-8
// text of 1 to 200 characters, not only white space, a single line.
function validateEntry(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 && ch !== "\t") {
      throw new Error("entry must not contain control characters");
    }
  }
}

function main(): void {
  validateEntry(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read-back round-trip: the file on disk must be byte-identical to the
  // validated line, so a stray newline or encoding slip fails loudly here
  // instead of at the gate.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("round-trip mismatch: entry.txt differs from the entry");
  }
  console.log(`wrote ${outPath} (${[...ENTRY].length} chars)`);
}

main();
