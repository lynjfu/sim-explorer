// Runner appended after the page's utilities block and a model.js. Works under node (console.log) or macOS jsc (print).
const out = (typeof print === 'function') ? print : console.log;
const res = runSelfCheck(MODELS, { runs: 50 });
for (const l of res.lines) out(l);
if (!res.ok && typeof quit === 'function') quit(1);
if (!res.ok && typeof process !== 'undefined') process.exit(1);
