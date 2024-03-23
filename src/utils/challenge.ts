export function challenge(challenge: string[]): string {
  let out = '';
  for (const c in challenge) {
    out += challenge[c];
  }

  return out;
}
