'use strict';
// model.js — Consulting analysts choosing among five approaches, with a pooled-data AI recommender.
// Written against MODEL_CONTRACT.md. Helpers from the page: randInt, randn, shuffle, softmax,
// sampleCategorical, fmt, mean, final, generateNK, bitsOf, hamming, runBatch.
// Randomness comes ONLY from the rng argument, never Math.random, so a seed reproduces a run.

// fixed: true success rates of the five approaches, approach 1 is clearly best; the others are worse by different amounts
const TRUE_RATES = [0.70, 0.55, 0.50, 0.40, 0.30];
// fixed: every impression (and the AI's view of an untried approach) starts at 0.5, "no particular opinion"
const START_IMPRESSION = 0.5;

// index of the largest value, ties broken at random
function argmaxRandom(rng, arr){
  let best = -Infinity, ties = [];
  for (let i = 0; i < arr.length; i++){
    if (arr[i] > best){ best = arr[i]; ties = [i]; }
    else if (arr[i] === best) ties.push(i);
  }
  return ties[randInt(rng, ties.length)];
}

const ANALYSTS_AI = {
  id: 'analystsai',
  name: 'Analysts and a pooled-data AI',

  about: [
    'M analysts in a consulting firm each do one client project per round and must pick one of five standard approaches. Each approach has a true success rate that nobody knows (fixed: 0.70, 0.55, 0.50, 0.40, 0.30; approach 1 is the best). A project succeeds or fails at that rate. The approaches never change.',
    'Each analyst keeps an impression of each approach, a number between 0 and 1 that starts at 0.5 for every approach (no opinion), built only from their own projects. Searching alone, an analyst mostly picks the approach they currently think is best (ties broken at random), but with probability ε they instead try one of the other four approaches at random. After the project they see only whether it succeeded (1) or failed (0), and the impression of the approach they used moves a fraction φ of the way toward that result. Nothing else changes and nobody leaves.',
    'The AI sees every analyst’s results. At the start of each round it recommends the approach with the highest pooled success rate (successes ÷ projects, over all analysts and all previous rounds); an approach nobody has tried yet counts as 0.5, and ties are broken at random. It is never wrong on purpose, but early on it has little data. Each analyst, each round, follows the AI with a fixed probability p; an analyst who does not follow uses their own rule above. The AI keeps learning from all projects, followed or not. With the AI off, the same M analysts learn only from their own projects.',
    'Puranam et al. (2015) mapping. Task environment: five approaches with fixed true success rates; a project is a coin flip at that rate. Representation: an analyst sees their own impressions of the five approaches, not the true rates; the AI sees the pooled success counts of everyone. Choice: an analyst follows the AI with probability p, otherwise picks their highest impression (random tie-break) except with probability ε tries another approach at random; the AI recommends the highest pooled rate. Feedback: the analyst sees only success or failure of their own project; the AI sees everyone’s. Transformation: the used approach’s impression moves a fraction φ toward the result; the AI’s counts grow; the approaches and the follow probability never change.'
  ],
  howToRead: [
    'The headline is the share of analysts using the best approach (approach 1) at the end of the run. Press Compare to see whether the AI gets the firm there faster than analysts learning alone, and whether it stays there.',
    'To see lock-in, set the follow probability to 1: everyone uses what the AI recommends, so only that approach gets new data. Watch the “AI recommends the best approach” line, which in a Batch is the share of runs in which the AI is pointing at approach 1. If it sits below 1 late in the run, some runs have locked in on a wrong approach. Lower the follow probability or raise ε and see whether that line recovers.',
    'The state strip shows, for each approach (1 = best), the share of analysts who used it this round.'
  ],
  T: 100,

  params: [
    { key:'ai',      label:'AI recommender',           type:'seg',   values:['off','on'],          default:'on',  note:'off = analysts learn only from their own projects' },
    { key:'pFollow', label:'Follow the AI, prob. p',    type:'seg',   values:[0.25,0.5,0.75,1],     default:0.5,   note:'probability an analyst takes the AI’s recommendation this round' },
    { key:'eps',     label:'Try at random, prob. ε',    type:'seg',   values:[0,0.05,0.1,0.25],     default:0.1,   note:'probability an analyst who is not following the AI tries one of the other approaches at random' },
    { key:'phi',     label:'Impression step φ',         type:'range', min:0, max:1, step:0.1, default:0.3, fmt:v=>v.toFixed(1), sweep:[0,0.1,0.3,0.6,1], note:'how far the impression moves toward the result; 0 = never learns' },
    { key:'M',       label:'Analysts M',                type:'seg',   values:[10,30,100],           default:30 },
  ],
  // fixed: five approaches, true rates TRUE_RATES, starting impression 0.5, 100 rounds

  compare: { key:'ai', on:'on', off:'off', labelOn:'with AI', labelOff:'without AI' },

  charts: [
    { id:'best', title:'Using the best approach', yMin:0, yMax:1, series:[
      { key:'share_best',  label:'share of analysts using the best approach', color:'blue',   dash:[],    marker:'circle',   hollow:false },
      { key:'ai_rec_best', label:'AI recommends the best approach (1 = yes; in a batch, share of runs)', color:'orange', dash:[6,3], marker:'triangle', hollow:true },
    ]},
    { id:'succ', title:'Success this round', yMin:0, yMax:1, series:[
      { key:'succ_rate',   label:'share of this round’s projects that succeeded', color:'blue',   dash:[],    marker:'rect',     hollow:false },
      { key:'exp_succ',    label:'average true success rate of the approaches chosen', color:'orange', dash:[6,3], marker:'rectRot',  hollow:true },
    ]},
    { id:'how', title:'How analysts chose', yMin:0, yMax:1, series:[
      { key:'share_follow',  label:'share who followed the AI',        color:'green',  dash:[],    marker:'circle',   hollow:false },
      { key:'share_explore', label:'share who tried one at random',    color:'purple', dash:[2,3], marker:'cross',    hollow:true },
    ]},
  ],
  state: { title: 'approaches (1 = best) · share of analysts using each this round', render: null },

  checks: [
    { name:'AI off: nobody follows it',
      set:{ ai:'off' }, test: B => final(B,'share_follow') === 0 || `share_follow = ${fmt(final(B,'share_follow'))}` },
    { name:'ε = 0: nobody ever tries an approach at random',
      set:{ ai:'off', eps:0 }, test: B => final(B,'share_explore') === 0 || `share_explore = ${fmt(final(B,'share_explore'))}` },
    { name:'AI on and p = 1: every analyst follows the AI every round and nobody tries one at random',
      set:{ ai:'on', pFollow:1 }, test: B => (final(B,'share_follow') === 1 && final(B,'share_explore') === 0) || `share_follow = ${fmt(final(B,'share_follow'))}, share_explore = ${fmt(final(B,'share_explore'))}` },
    { name:'analysts learning alone (defaults, AI off) end up on the best approach well above chance (1 in 5)',
      set:{ ai:'off' }, test: B => final(B,'share_best') > 0.3 || `share_best = ${fmt(final(B,'share_best'))}` },
  ],

  // ---- runtime state (set during a run) ----
  p: null, q: null, b: null, succ: null, trials: null, rec: -1, t: 0,

  generateEnvironment(rng){
    this.q = TRUE_RATES.slice();                      // CHOICE: fixed numbers, not drawn at random, so every run has the same task
  },
  initState(rng){
    const p = this.p, A = this.q.length;
    this.b = [];
    for (let j = 0; j < p.M; j++) this.b.push(new Float64Array(A).fill(START_IMPRESSION));
    this.succ = new Float64Array(A);                  // pooled successes per approach (what the AI sees)
    this.trials = new Float64Array(A);                // pooled projects per approach
    this.rec = -1;
    this.t = 0;
  },
  stepPeriod(rng){
    const p = this.p, q = this.q, A = q.length;
    // AI recommendation for this round, from all data up to the end of the previous round
    // CHOICE: computed once at the start of the round, so every analyst who follows gets the same recommendation
    let rec = -1;
    if (p.ai === 'on'){
      const rate = new Array(A);
      for (let i = 0; i < A; i++) rate[i] = this.trials[i] > 0 ? this.succ[i] / this.trials[i] : START_IMPRESSION;
      rec = argmaxRandom(rng, rate);
    }
    this.rec = rec;

    let followed = 0, explored = 0, successes = 0, usedBest = 0, sumTrue = 0;
    const used = new Float64Array(A);
    const chosen = new Int32Array(p.M), result = new Int8Array(p.M);
    for (let j = 0; j < p.M; j++){                   // everyone acts in the same round on their own impressions; order does not matter
      let a;
      if (p.ai === 'on' && rng() < p.pFollow){        // CHOICE: the follow draw comes first; an analyst who follows the AI neither exploits nor explores on their own
        a = rec; followed++;
      } else {
        const fav = argmaxRandom(rng, this.b[j]);     // CHOICE: ties between impressions broken at random
        if (rng() < p.eps){                           // CHOICE: a random try is one of the OTHER four approaches, never the current favourite
          let r = randInt(rng, A - 1); if (r >= fav) r++;
          a = r; explored++;
        } else a = fav;
      }
      const s = rng() < q[a] ? 1 : 0;                 // the project succeeds or fails at the approach's true rate
      chosen[j] = a; result[j] = s;
      used[a]++; successes += s; sumTrue += q[a]; if (a === 0) usedBest++;
    }
    // transformation: own impression of the used approach moves a fraction phi toward the result
    for (let j = 0; j < p.M; j++){
      const a = chosen[j];
      this.b[j][a] += p.phi * (result[j] - this.b[j][a]);
    }
    // the AI's pooled data grows with every project, followed or not
    for (let j = 0; j < p.M; j++){ this.trials[chosen[j]]++; this.succ[chosen[j]] += result[j]; }
    this.t++;

    const bitShare = new Array(A); let maxShare = 0;
    for (let i = 0; i < A; i++){ bitShare[i] = used[i] / p.M; if (bitShare[i] > maxShare) maxShare = bitShare[i]; }
    const recRate = rec >= 0 && this.trials[rec] > 0 ? this.succ[rec] / this.trials[rec] : null;
    return { t: this.t,
             share_best: usedBest / p.M,
             ai_rec_best: rec < 0 ? null : (rec === 0 ? 1 : 0),
             succ_rate: successes / p.M,
             exp_succ: sumTrue / p.M,
             share_follow: followed / p.M,
             share_explore: explored / p.M,
             share_same: maxShare,
             bitShare,
             M: p.M, followed, explored, successes, usedBest, rec, recRate, recTrials: rec >= 0 ? this.trials[rec] : 0 };
  },
  logLine(r){
    const aiPart = r.rec < 0 ? 'AI off' : `AI recommended approach ${r.rec + 1}${r.rec === 0 ? ' (the best)' : ''}`;
    return `t=${String(r.t).padStart(3)}: ${aiPart} · followed AI ${r.followed}/${r.M} · tried one at random ${r.explored}/${r.M} · used the best approach ${r.usedBest}/${r.M} · succeeded ${r.successes}/${r.M}`;
  },
  stateReadout(r){
    if (r.rec < 0) return 'AI off';
    return `AI now rates approach ${r.rec + 1} highest: ${r.recRate === null ? '—' : fmt(r.recRate, 2)} from ${r.recTrials} projects`;
  },
};

const MODELS = [ANALYSTS_AI];
