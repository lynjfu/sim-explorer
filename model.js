'use strict';
// model.js — the model the explorer runs. This one is the worked example: NK search with an AI advisor.
// Written against docs/MODEL_CONTRACT.md. Helpers available from the page: makeRng, randInt, randn, shuffle,
// softmax, sampleCategorical, fmt, mean, final, generateNK, bitsOf, hamming, runBatch.
// Randomness comes ONLY from the rng argument, never Math.random, so a seed reproduces a run.

const NK_AI_ADVISOR = {
  id: 'nkai',
  name: 'NK search with an AI advisor',

  about: [
    'M people each run a project made of N yes/no choices (which features to include, which markets to enter). A project’s performance is scored on an NK landscape: each choice contributes a payoff that depends on the choice itself and on K other choices, so changing one choice can raise or lower the payoff of others. Performance is shown divided by the best possible score on that landscape.',
    'Without AI, each period a person looks at one alternative project that differs from their own in a single choice, sees its true performance, and switches if it is strictly better. With AI, an advisor looks at all N single-choice alternatives for that person, estimates each one’s performance with some error (σ), and recommends the alternative it estimates highest. A person who follows the advisor checks that recommended alternative instead of a random one; a person who does not follow searches alone that period.',
    'Whether a person follows is a matter of trust. Each person follows the advisor with probability equal to their current trust, which starts at p0. After a recommended alternative has been checked, trust rises toward 1 at rate φ if the alternative was better than the person’s current project, and falls toward 0 at rate φ if it was not.',
    'Puranam et al. (2015) mapping. Task environment: the NK payoff table, fixed during a run. Representation: a person knows their own project, its true performance, and the one alternative they check this period; the advisor sees all N single-choice alternatives, but through noisy estimates. Choice: a person switches if the checked alternative is strictly better; the advisor recommends its highest estimate; following happens with probability equal to trust. Feedback: the person sees the true performance of the alternative they checked. Transformation: positions update; trust updates toward 1 or 0 at rate φ; the landscape and the advisor’s accuracy never change.'
  ],
  howToRead: [
    'With the advisor on and σ = 0, every followed recommendation is the best single-choice alternative, so performance rises fastest; compare K = 0 (one peak, everyone reaches it) with K = 7 (many peaks, people get stuck). Raise σ to watch trust fall as the advisor misleads people, and the population drift back to searching alone.',
    'Press Compare to overlay “with AI” and “without AI” on the same charts, averaged over many runs. Heterogeneity falls as people converge on the same few peaks; watch whether the advisor makes everyone more alike. The state strip shows, for each of the N choices, the share of people currently choosing 1.'
  ],
  T: 60,

  params: [
    { key:'K',        label:'Ruggedness K',          type:'seg',   values:[0,2,4,7],          default:4,    note:'how many other choices each choice’s payoff depends on; 0 = one peak, 7 = many local peaks' },
    { key:'ai',       label:'AI advisor',            type:'seg',   values:['off','on'],       default:'on', note:'off = everyone searches alone' },
    { key:'sigma',    label:'Advisor error σ',       type:'seg',   values:[0,0.05,0.1,0.2],   default:0.05, note:'sd of the error in the advisor’s estimates; performance differences between neighbours are about 0.1' },
    { key:'p0',       label:'Initial trust p0',      type:'range', min:0, max:1, step:0.1, default:0.5, fmt:v=>v.toFixed(1), sweep:[0,0.25,0.5,0.75,1], note:'probability of following the advisor at the start' },
    { key:'phi',      label:'Trust learning rate φ', type:'range', min:0, max:1, step:0.1, default:0.3, fmt:v=>v.toFixed(1), sweep:[0,0.1,0.3,0.6,1], note:'0 = trust never changes' },
    { key:'M',        label:'People M',              type:'seg',   values:[10,20,50],         default:20 },
    { key:'N',        label:'Choices N',             type:'seg',   values:[6,8,10],           default:8,    note:'2^N possible projects' },
  ],
  // fixed: interaction pattern = ring (each choice depends on the next K choices in order)

  // The Compare button runs the batch with ai='on' and ai='off' and overlays them.
  compare: { key:'ai', on:'on', off:'off', labelOn:'with AI', labelOff:'without AI' },

  charts: [
    { id:'perf', title:'Performance (÷ best possible)', yMin:0, yMax:1, series:[
      { key:'mean_perf',    label:'mean over people',       color:'blue',   dash:[],    marker:'circle',   hollow:false },
      { key:'best_perf',    label:'best person',            color:'orange', dash:[6,3], marker:'triangle', hollow:true  },
    ]},
    { id:'trust', title:'Trust in the advisor', yMin:0, yMax:1, series:[
      { key:'mean_trust',   label:'mean trust',             color:'green',  dash:[],    marker:'rect',     hollow:false },
      { key:'share_follow', label:'share who followed the advisor this period', color:'purple', dash:[2,3], marker:'rectRot', hollow:true },
    ]},
    { id:'het', title:'Heterogeneity of projects', yMin:0, yMax:1, series:[
      { key:'diversity',    label:'mean difference between two people’s projects (÷ N)', color:'blue',   dash:[],    marker:'rect',  hollow:false },
      { key:'share_peak',   label:'share stuck at a local peak',   color:'orange', dash:[6,3], marker:'cross', hollow:true },
    ]},
  ],
  state: { title: 'choices · share of people choosing 1', render: null },   // null = default strip

  // Sanity checks the page runs when the model loads. Each sets parameters, runs a batch B, and tests it.
  // ctx.batch({overrides}) runs another batch for a comparison.
  checks: [
    { name:'K=0 has one peak: with the advisor everyone reaches it (mean performance > 0.97)',
      set:{ K:0, ai:'on' }, test: B => final(B,'mean_perf') > 0.97 || `mean_perf = ${fmt(final(B,'mean_perf'))}` },
    { name:'K=0 has one peak: without the advisor everyone reaches it too',
      set:{ K:0, ai:'off' }, test: B => final(B,'mean_perf') > 0.97 || `mean_perf = ${fmt(final(B,'mean_perf'))}` },
    { name:'advisor off: nobody follows and trust stays at p0',
      set:{ ai:'off', p0:0.5 }, test: B => (final(B,'share_follow') === 0 && Math.abs(final(B,'mean_trust') - 0.5) < 1e-9) || `share_follow ${fmt(final(B,'share_follow'))}, mean_trust ${fmt(final(B,'mean_trust'))}` },
    { name:'φ=0: trust never moves from p0',
      set:{ ai:'on', phi:0, p0:0.7 }, test: B => Math.abs(final(B,'mean_trust') - 0.7) < 1e-9 || `mean_trust = ${fmt(final(B,'mean_trust'))}` },
    { name:'a perfect, always-followed advisor (σ=0, p0=1, φ=0) is ahead of no advisor at period 5, K=4',
      set:{ K:4, ai:'on', sigma:0, p0:1, phi:0 }, test: (B, ctx) => { const off = ctx.batch({ ai:'off' }); const d = B.mean.mean_perf[4] - off.mean.mean_perf[4]; return d > 0 || `difference at t=5 is ${fmt(d)}`; } },
  ],

  // ---- runtime state (set during a run) ----
  p: null, env: null, pos: null, trust: null, t: 0,

  generateEnvironment(rng){
    const p = this.p;
    this.env = generateNK(rng, p.N, p.K, 'ring');
  },
  initState(rng){
    const p = this.p;
    this.pos = new Int32Array(p.M);
    for (let j = 0; j < p.M; j++) this.pos[j] = randInt(rng, this.env.numStr);   // random starting project
    this.trust = new Float64Array(p.M).fill(p.p0);
    this.t = 0;
  },
  stepPeriod(rng){
    const p = this.p, env = this.env, N = env.N;
    let moved = 0, followed = 0;
    for (let j = 0; j < p.M; j++){                       // CHOICE: everyone acts in the same period on their own state; order does not matter because people do not interact
      const cur = this.pos[j], fcur = env.fit[cur];
      let cand, usedAI = false;
      if (p.ai === 'on' && rng() < this.trust[j]){
        usedAI = true;                                   // the advisor estimates every single-choice alternative and recommends its highest estimate
        let bestEst = -Infinity; cand = cur;
        for (let i = 0; i < N; i++){
          const s = cur ^ (1 << i);
          const est = env.fit[s] + p.sigma * randn(rng); // CHOICE: additive normal error, independent per alternative and per period
          if (est > bestEst){ bestEst = est; cand = s; }
        }
      } else {
        cand = cur ^ (1 << randInt(rng, N));             // searching alone: one random single-choice alternative
      }
      const better = env.fit[cand] > fcur;              // CHOICE: strict improvement (a tie means stay)
      if (better){ this.pos[j] = cand; moved++; }
      if (usedAI){
        followed++;
        this.trust[j] += better ? p.phi * (1 - this.trust[j]) : -p.phi * this.trust[j];   // trust moves toward 1 after a good recommendation, toward 0 after a bad one
      }
    }
    this.t++;
    // record everything the charts, log line and state strip need
    let sumF = 0, best = 0, atPeak = 0, sumTrust = 0; const bitShare = new Float64Array(N);
    for (let j = 0; j < p.M; j++){
      const s = this.pos[j]; const f = env.fit[s] / env.gmax;
      sumF += f; if (f > best) best = f; atPeak += env.isPeak[s]; sumTrust += this.trust[j];
      for (let i = 0; i < N; i++) bitShare[i] += (s >> i) & 1;
    }
    for (let i = 0; i < N; i++) bitShare[i] /= p.M;
    let pairs = 0, dist = 0;                             // heterogeneity: mean Hamming distance between two people's projects, ÷ N
    for (let a = 0; a < p.M; a++) for (let b = a + 1; b < p.M; b++){ dist += hamming(this.pos[a], this.pos[b]); pairs++; }
    const diversity = pairs ? dist / pairs / N : 0;
    return { t: this.t, mean_perf: sumF / p.M, best_perf: best, mean_trust: sumTrust / p.M, share_follow: followed / p.M,
             share_peak: atPeak / p.M, share_moved: moved / p.M, diversity, bitShare: Array.from(bitShare), M: p.M, nPeaks: env.nPeaks, followed, moved };
  },
  logLine(r){ return `t=${String(r.t).padStart(2)}: followed advisor ${r.followed}/${r.M} · switched ${r.moved}/${r.M} · mean performance ${fmt(r.mean_perf)} · best ${fmt(r.best_perf)} · mean trust ${fmt(r.mean_trust,2)} · at a peak ${Math.round(r.share_peak*r.M)}/${r.M}`; },
  stateReadout(r){ return `landscape has ${r.nPeaks} local peak${r.nPeaks===1?'':'s'}`; },
};

const MODELS = [NK_AI_ADVISOR];
