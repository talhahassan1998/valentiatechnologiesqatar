// Value parsing for the metric counter (src/components/ui/CountUp.tsx).
//
// The counter takes the already-formatted string from content.ts, so it has to
// split off whatever prefix/suffix each metric carries and decide what is even
// countable. Mirrors the logic in CountUp; keep in step with it.

const parse = (value) => {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/s);
  if (!match) return { countable: false, text: value };
  const [, prefix, digits, suffix] = match;
  const target = parseFloat(digits.replace(/,/g, ''));
  if (!Number.isFinite(target)) return { countable: false, text: value };
  const isYear = !prefix && !suffix && /^\d{4}$/.test(digits) && target > 1900;
  return {
    countable: !isYear,
    prefix, suffix, target, isYear,
    decimals: (digits.split('.')[1] || '').length,
    grouped: digits.includes(','),
  };
};

let fail = 0;
const ok = (m, v) => { if (!v) { console.log("FAIL", m); fail++; } };

// The four real metrics in content.ts.
const plain = parse('250');
ok("250 counts", plain.countable && plain.target === 250);
ok("250 has no affixes", plain.prefix === '' && plain.suffix === '');

const pct = parse('85%');
ok("85% counts to 85", pct.countable && pct.target === 85);
ok("85% keeps its suffix", pct.suffix === '%');

const plus = parse('600+');
ok("600+ counts to 600", plus.countable && plus.target === 600);
ok("600+ keeps its suffix", plus.suffix === '+');

// A year is a label, not a quantity: counting 0..2004 reads as a stopwatch,
// and grouping would render it "2,004".
const year = parse('2004');
ok("2004 is treated as a year", year.isYear);
ok("2004 does not count", !year.countable);

// Guard the year rule against false positives: a real 4-digit quantity with a
// suffix, or one below 1900, must still count.
ok("1200+ still counts", parse('1200+').countable);
ok("1500 (below cutoff) still counts", parse('1500').countable);

// Formatting details that would corrupt the displayed value.
ok("decimals preserved", parse('99.5%').decimals === 1);
ok("grouped numbers flagged", parse('1,200').grouped && parse('1,200').target === 1200);

// Prefixes, in case a currency metric is ever added.
const money = parse('$40M');
ok("$40M counts to 40", money.countable && money.target === 40);
ok("$40M keeps prefix and suffix", money.prefix === '$' && money.suffix === 'M');

// Nothing countable must pass through untouched rather than blanking.
ok("dash passes through", !parse('—').countable && parse('—').text === '—');

console.log(fail ? `${fail} failing` : "all count-up rules pass");
process.exit(fail ? 1 : 0);
