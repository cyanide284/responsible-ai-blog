---
title: "Behavioral and Mechanistic: AI Evaluation's Missing Loop"
description: 'Behavioral evals and mechanistic interpretability are usually framed as two camps. They are not. They are two halves of a method neuropsychology has been refining for decades.'
pubDate: 2026-05-13
heroImage: '../../assets/behavioral-mechanistic-evals-hero.png'
tags: ['Evaluation', 'Methodology', 'Interpretability', 'Red Teaming']
series: 'Evaluation Methodology'
seriesPart: 1
readingTime: '13 min read'
audio: true
---

My mom is a neuropsychologist at PGIMER, one of India's main medical research institutes. She works in the neurosurgery department, which means her job is the bridge between "what does the brain scan show" and "what can the patient actually do." Neither answer alone is enough. The combination is the standard of care.

I keep thinking about that when I look at how AI evaluation is currently structured, because that bridge is what hasn't become standard practice yet.

Two years of professional GenAI red teaming on frontier models, currently at Amazon AGI, has shaped how I see this problem. You watch the same prompt produce different responses across runs and have to decide whether that's noise or signal. Evals get passed by surface compliance while the underlying behavior persists in subtler form. Failure modes fixed in a small model reappear in the larger one with no obvious mechanism. The methodological problems aren't theoretical from this seat. They're the daily texture of the work.

The good news is that we don't have to invent the methodology from scratch. Adjacent fields have been working on the same shape of problem for a long time, and there's a clear opportunity to import what they've learned.

---

## The two camps in AI evaluation today

Most AI safety and evaluation work falls into one of two camps.

**Behavioral evaluation.** Treat the model as a black box. Send it inputs, observe outputs, measure properties of the response. This includes red teaming, jailbreak testing, capability benchmarks (MMLU, HumanEval), refusal evals, factuality checks, and agent task success rates. The system under test is opaque; the methodology is empirical observation of behavior under stimulus.

**Mechanistic interpretability.** Crack the model open. Probe activations, run attribution analyses, use sparse autoencoders to find features, identify circuits, perform activation patching. The system is treated as inspectable in principle, with transparency as the aspiration even where current methods only get partial access. The goal is to understand how a behavior arises mechanistically.

These read as separate disciplines. They often publish in different sub-communities, attract different researchers, and use different vocabulary. The default framing is that you pick one and specialize. The pattern of communities citing within themselves rather than across boundaries has started to be measured directly: a December 2025 network analysis of over 6,000 papers across 12 major conferences documented strong community segregation, with over 80% of collaborations occurring within either the safety or ethics community alone ([Roytburg & Miller, 2025](https://arxiv.org/abs/2512.10058), on safety vs. ethics specifically). The same pattern separates behavioral evaluation from mechanistic interpretability, though it hasn't been measured for that specific divide yet.

That framing leaves value on the table. Meaningful crossover work exists at labs with weight access, from Anthropic's Sleeper Agents and Scaling Monosemanticity papers to the broader model-organisms-of-misalignment line of research. External evaluators with only API access (METR, Apollo Research, Redwood Research on proprietary models) are necessarily limited to behavioral methods, which makes the synthesis harder to achieve outside the frontier labs. The result is that most evaluations still live entirely on one side of the boundary.

---

## A note on the analogy

Before going further, an objection worth pre-empting: if we're going to borrow methodology from neuroscience and psychology, are we sure the analogy holds? Aren't models literally neural networks?

The name oversells the resemblance. The mechanics diverge in almost every dimension that matters:

- **Substrate:** silicon transistors doing matrix multiplication vs. electrochemical signaling with thousands of distinct neurotransmitters and receptor types.
- **Plasticity:** gradient descent on a fixed loss vs. Hebbian plasticity, neuromodulation, and sleep-based consolidation.
- **Time:** stateless functions called in lockstep vs. continuous firing with timing-dependent dynamics.
- **Architecture:** uniform stacks of attention and MLP blocks (which can develop emergent specialization during training) vs. heterogeneous regions doing fundamentally different things by design.
- **Energy:** ~20 watts for a brain doing continuous inference and learning vs. megawatts for a cluster doing either. The gap is large enough to signal fundamentally different mechanisms, not the same thing scaled up.

So the claim is not that models *are* brains, and the methodology I'm pointing to isn't unique to neuropsychology. Pharmacology runs the same loop (drug effect, candidate receptor, agonist or antagonist intervention, behavioral re-test). So does behavioral genetics (phenotype, candidate gene, knockout or knockdown, phenotype re-test). The pattern shows up wherever a field has had to study a system whose internals can't be directly read off the surface, and where intervention is possible. AI sits squarely in that category: we can't fully read the mechanism, but we can patch activations, ablate circuits, and steer features. The loop applies.

I'm drawing the comparison primarily with neuropsychology partly because I've seen it up close, and partly because the behavioral/mechanistic pairing is unusually visible in clinical neuro work, where both measurements are routinely performed on the same patient at the same time. [Bereska & Gavves (2024)](https://arxiv.org/abs/2404.14082) draw the same parallel in their review of mechanistic interpretability for AI safety, noting that interpretability has historically relied on black-box techniques and is now shifting toward inner mechanistic analysis in ways that mirror neuroscience's own development. The argument doesn't depend on neuropsychology being the closest analog; it depends on the loop being a mature methodology that AI evaluation can adopt.

The deeper reason the methodology transfers across these fields is that the systems share an access profile, not a substrate. A drug, a brain, and an AI model are completely different in what they're made of, but the methodological access is the same: you can observe behavior, you can't directly see internals, you can intervene on candidate mechanisms. The behavioral/mechanistic loop developed for systems with that access profile. It works on any system that has it, regardless of what the system actually is.

When we study any system whose internals can't be fully read off the surface, the methodological problem has a shape. Several mature fields have been working that shape for decades. There's no need to start from scratch.

---

## What behavioral evaluation gets right (and where the opportunity is)

Behavioral evaluation is the workhorse of AI safety today, for good reasons. It scales (you can test millions of prompts). It's reproducible at the API level (same input, same model, comparable output). It's the closest thing the field has to standardized measurement. Without it, claims about model capability or safety are anecdote.

The opportunity is that behavioral psychology has been working with this exact methodology for decades, and the lessons it has accumulated transfer directly:

- **Single observations don't generalize.** Psychology learned this the hard way through the replication crisis. "We ran the experiment, here's the result" is not enough. The empirical picture for AI evals is similar. The 2024 BetterBench study, which evaluated 24 widely used AI benchmarks against 46 best-practice criteria, found that [14 of the 24 benchmarks did not perform multiple evaluations of the same model or report statistical significance](https://arxiv.org/abs/2411.12990) (Reuel et al., 2024). The same pattern shows up in adjacent ML-based science: Kapoor and Narayanan's 2023 survey identified [data leakage affecting 294 papers across 17 scientific fields](https://www.cell.com/patterns/fulltext/S2666-3899(23)00159-9), in some cases producing "wildly overoptimistic conclusions." That's the same methodological gap pre-replication-crisis psychology had to close.
- **Construct validity is not free.** Even when a benchmark is reproducible, it has to actually measure the thing it claims to measure. Raji et al.'s 2021 NeurIPS paper ["AI and the Everything in the Whole Wide World Benchmark"](https://arxiv.org/abs/2111.15366) argued that many widely cited benchmarks operate as stand-ins for general capabilities they cannot in fact represent, because they're inherently specific, finite, and contextual. A 2025 NeurIPS systematic review of 445 LLM benchmarks ([Bean et al., 2025](https://arxiv.org/abs/2511.04703)) found that almost all reviewed articles had construct validity weaknesses across phenomena, tasks, metrics, or claims. The implication: passing a "reasoning" benchmark doesn't automatically establish reasoning in the broader sense; that's a separate inference the benchmark design has to support.
- **Stimulus design *is* the experiment.** Behavioral results depend heavily on how the prompt is framed, what the prior context is, and what the system message looks like. The eval is the experimental setup, not just a query. Two evals claiming to measure "deception" can be measuring entirely different things if their stimuli differ.
- **Behavior is consistent with multiple mechanisms.** A model might refuse a request because of safety training, because of pattern-matching on surface features, because of a tokenization quirk, or because of an artifact of the system prompt. The behavioral signal is identical. The mechanism is different. If the mechanism is "surface-feature pattern matching," the safety claim does not generalize to slight rephrasings.

The most pointed public demonstration of this last limit is Anthropic's [Sleeper Agents](https://arxiv.org/abs/2401.05566) work (Hubinger et al., January 2024). They trained models with conditional backdoors (write secure code when the year is 2023, insert exploits when the year flips to 2024) and then put those models through standard safety training: supervised fine-tuning, RLHF, and adversarial training. None reliably removed the backdoor behavior. The paper's own framing is striking: "rather than removing backdoors, we find that adversarial training can teach models to better recognize their backdoor triggers, effectively hiding the unsafe behavior."

The implication is straightforward: behavioral evaluation alone cannot reliably distinguish a model whose alignment generalizes from a model whose surface behavior happens to look aligned under the conditions you tested. If the same observable behavior is consistent with multiple internal mechanisms, methods that look at the mechanisms become a complement, not a luxury.

Behavioral psychology developed pre-registration, multiple-comparisons corrections, effect-size discipline, and methodological transparency to handle exactly these failure modes. AI evals have a head start: we can adopt those practices before the crisis forces them.

---

## What mechanistic interpretability gets right (and where the opportunity is)

Mechanistic interpretability is the discipline that says "behavior isn't enough; we need to understand why." It tries to identify circuits, features, and computational structures inside the model that explain its outputs. When it works, it gives you a mechanistic story: this attention head, in this layer, in this context, computes this thing.

Neuroscience has been doing the analogous work since the late 1800s, and the lessons it has learned about its own limits are useful here:

- **Correlation is not causation, even with a fancy probe.** fMRI gave neuroscience the ability to watch the brain "light up" during specific tasks. It also produced a wave of overconfident causal claims that later required substantial correction. Two cautionary tales from that era are worth knowing. [Bennett et al.'s "dead salmon" study](https://prefrontal.org/files/posters/Bennett-Salmon-2009.pdf) (2009) showed that a dead Atlantic salmon placed in an fMRI scanner produced 16 "significant" voxels of activity when multiple-comparisons correction was omitted. [Vul et al.'s "Puzzlingly High Correlations"](https://journals.sagepub.com/doi/abs/10.1111/j.1745-6924.2009.01125.x) paper (2009) argued that many widely cited brain-personality correlations in social neuroscience were inflated by non-independent analysis procedures. Both findings changed how the field reports results.

  Interpretability findings carry the same risk: a feature or circuit that *correlates* with a behavior is not necessarily the feature or circuit *causing* it.
- **Resolution limits everything.** fMRI shows aggregate blood flow over voxels containing tens of thousands of neurons. Attribution methods over a transformer layer summarize aggregate behavior over thousands of weights. Both see something real. Neither sees the actual mechanism at full resolution.
- **Interventions are the gold standard, not observations.** Neuroscience earned its causal claims primarily through lesion studies, optogenetics, and transcranial stimulation, methods that *change* the system and observe the result. The interpretability equivalent is activation patching, ablation, and steering. Observation alone, no matter how detailed, doesn't pin down mechanism.

Interpretability is younger than fMRI, and recent work has started naming the analogous risks directly. [Wei et al. (2025)](https://arxiv.org/abs/2505.16004) introduced an adversarial framework specifically to test "interpretability illusions" in sparse autoencoders, showing that SAE-derived concept representations can be substantially disrupted by small input perturbations. Other recent work has documented gaps between automated feature explanations and the actual downstream behavior of the features when used for steering ([Wu et al., 2025](https://arxiv.org/pdf/2510.03659); see also EleutherAI's [open-source autointerp pipeline](https://blog.eleuther.ai/autointerp/) for direct evaluation of explanation quality). These are constructive findings: they're how the field works out which interpretability claims actually generalize.

---

## The synthesis: how the loop should work

The point of bringing in the neuropsychology framing isn't "interpretability is bad" or "behavioral evals are sloppy." Both methods are doing their part. The opportunity is that they're halves of a single workflow, and most of the value sits in the loop between them.

```
Behavioral evaluation surfaces a phenomenon
   ↓
Mechanistic interpretability investigates the candidate mechanism
   ↓
Mechanism suggests a hypothesis (steer / edit / ablate)
   ↓
Behavioral evaluation validates the intervention
   ↓
(loop)
```

This is how psychology and neuroscience actually interact in real practice, and how pharmacology and behavioral genetics work as well. Behavioral observation gives you a phenomenon worth investigating. Imaging, recording, or assay suggests a candidate mechanism. Lesion, stimulation, knockout, or antagonist studies test whether that mechanism is causal. Behavioral re-testing confirms whether the intervention actually changed what you cared about. None of those steps stands alone.

Mapped onto AI:

- Red team probing finds a behavioral failure (e.g., a class of prompts that elicit deceptive responses).
- Interpretability investigates which features and circuits activate in those cases.
- The hypothesis becomes: if we steer or ablate this circuit, the deceptive behavior should decrease.
- The behavioral eval is run again under the intervention. If the behavior changes as predicted, the mechanism is causal. If not, the candidate mechanism was wrong.

This is methodology, not magic. It's also barely happening at scale.

---

## A worked example in AI: Golden Gate Claude

The clearest public demonstration of the loop done well *in AI* is from Anthropic's [Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/) work, published in May 2024 alongside a public demo called [Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude).

The flow:

- **Behavioral observation.** Claude 3 Sonnet, like other large models, has consistent associative patterns. References to the Golden Gate Bridge appear in geographic, photographic, romantic, and engineering contexts in predictable ways.
- **Mechanistic identification.** Sparse autoencoders trained on the model's activations recovered millions of interpretable features. One of them activated specifically on Golden Gate Bridge content, across modalities and contexts.
- **Causal intervention.** Anthropic clamped that single feature to 10× its maximum activation value, which they described as "a precise, surgical change to some of the most basic aspects of the model's internal activations."
- **Behavioral confirmation.** The resulting model variant, Golden Gate Claude, became obsessively focused on the bridge. It recommended spending $10 on toll fees in unrelated contexts, wrote love stories about cars crossing the bridge, and interpreted unrelated questions through a Golden Gate lens.

That sequence is the loop, end to end, on a real model:

```
Behavior pattern  →  SAE feature identified  →  Feature clamped  →  Behavior shifts as predicted
```

Now substitute "Golden Gate Bridge" with a safety-relevant feature. If a sparse autoencoder identifies a feature that activates during deceptive responses, the test of whether it's *the* deception mechanism (versus a correlated bystander) is whether clamping it changes the behavior the way the hypothesis predicts. Same loop. Higher stakes. Same methodology.

The Golden Gate work also makes the limit visible: identifying a feature that correlates with a behavior is the *first* step. The causal claim only lands once you've intervened and re-measured. Without the intervention, you have a colorful interpretability finding. With it, you have evidence about mechanism.

---

## A precedent from outside AI

If the Golden Gate work shows the loop is possible in AI, the next question is what mature versions of this methodology look like. For that, the clearest example I've seen isn't from AI at all. It's a 2017 paper from the Department of Neurosurgery at PGIMER Chandigarh ([Shahid, Mohanty et al., *Journal of Neurosurgery*](https://thejns.org/view/journals/j-neurosurg/128/1/article-p229.xml)) whose design is structurally analogous to what AI evaluation could adopt.

The setup: 34 patients underwent decompressive craniectomy and later cranioplasty (the bone flap is replaced). The question was whether the cranioplasty improves outcomes, and what those outcomes look like.

The methodology paired two measurements on the same patients at the same time points:

- **Mechanistic measurement:** technetium-99m SPECT brain perfusion imaging, 7 days before and 3 months after cranioplasty.
- **Behavioral measurement:** Glasgow Outcome Scale (GOS), Glasgow Coma Scale, and a battery of cognitive tests at the same time points.

The findings, taken directly from the paper's abstract:

- Pre-cranioplasty, 9 patients (26.5%) had a GOS score of 5 and 25 patients (73.5%) had a GOS score of 4. Post-cranioplasty, all 34 patients (100%) improved to a GOS score of 5.
- Approximately 35.3% to 90.9% of patients showed cognitive improvement post-cranioplasty across the various tests.
- 94% of patients showed improvement in cerebral perfusion on SPECT across different brain lobes.

Neither half of the methodology would have been sufficient on its own. The behavioral improvements alone could be attributed to anything (natural recovery, expectation effects, measurement noise). The perfusion improvements alone don't tell you what the patient can actually do. Together, and tied to a structural intervention (the surgery itself), the case for a coherent causal story is much stronger: the structural change improved blood flow, the blood flow tracked with cognitive function, and the behavioral measures confirmed the effect at the level of the patient's actual life. (The paper is observational rather than randomized, so the causal language is qualified, but the structural design is what matters here.)

That's the rigor worth importing. Behavior, mechanism, intervention, and behavioral re-test, all in the same study, on the same subjects. Right now, in AI, those four pieces typically live in different papers, by different authors, on different models.

---

## What this means for AI evaluation

A few practical implications if this framing is right:

**1. Behavioral evals can adopt methodology hygiene now.** Pre-registration, multiple seeds, multiple paraphrasings, effect-size reporting, replication, and explicit construct-validity arguments. The discipline psychology built post-2011 transfers directly, and the empirical picture from [BetterBench](https://arxiv.org/abs/2411.12990) (Reuel et al., 2024), [Kapoor and Narayanan](https://www.cell.com/patterns/fulltext/S2666-3899(23)00159-9) (2023), and [Raji et al.](https://arxiv.org/abs/2111.15366) (2021) makes clear how much headroom there is.

**2. Interpretability claims gain force when paired with causal tests.** A circuit that activates during a behavior is a *candidate* mechanism. The intervention (patching, ablating, steering) is what earns the causal claim. Golden Gate Claude is the proof of concept that this is doable at scale.

**3. The two methods benefit from shared infrastructure.** Right now, behavioral evaluators and interpretability researchers often run different harnesses, different prompts, and different model checkpoints. The cranioplasty paper worked because the two measurements were on the same patients at the same time. The AI equivalent is a shared eval scaffold where the behavioral test and the mechanistic probe run on the same model, the same prompt set, and the results are correlated.

**4. Robust safety claims benefit from both halves.** A claim like "this model refuses harmful requests" is a behavioral claim. A claim like "this model has no internal representation of [X]" is a mechanistic claim. The strongest version of either includes the other, and ideally a causal intervention showing that disabling the mechanism eliminates the behavior.

---

## What I'm working on

Most of what I've outlined here is methodology, not tooling. The next set of posts in this series will get more concrete:

- What a behavioral eval suite looks like when designed with the pre-registration discipline psychology had to learn.
- How to wire interpretability probes alongside a behavioral eval, on the same prompt set, on the same model.
- Specific failure modes where each side alone would draw the wrong conclusion.

This is also why the home AI node series matters in parallel: controlling the entire stack end to end is a prerequisite for paired-measurement designs of this kind, because mechanistic probes aren't possible on an API-only model.

---

## Sources and further reading

**On AI evaluation methodology and benchmark validity:**
- Reuel et al., ["BetterBench: Assessing AI Benchmarks, Uncovering Issues, and Establishing Best Practices"](https://arxiv.org/abs/2411.12990) (2024). Empirical analysis of 24 widely-used AI benchmarks against 46 best-practice criteria.
- Raji et al., ["AI and the Everything in the Whole Wide World Benchmark"](https://arxiv.org/abs/2111.15366) (NeurIPS 2021). Construct validity critique of general-purpose AI benchmarks.
- Kapoor and Narayanan, ["Leakage and the Reproducibility Crisis in ML-based Science"](https://www.cell.com/patterns/fulltext/S2666-3899(23)00159-9) (Patterns, 2023). 294 papers across 17 fields affected by data leakage.
- Bean et al., ["Measuring what Matters: Construct Validity in Large Language Model Benchmarks"](https://arxiv.org/abs/2511.04703) (NeurIPS 2025). Systematic review of 445 LLM benchmarks with 29 expert reviewers.

**On mechanistic interpretability:**
- Bereska & Gavves, ["Mechanistic Interpretability for AI Safety: A Review"](https://arxiv.org/abs/2404.14082) (2024). Comprehensive review of the field; includes explicit neuroscience analogy.
- Templeton et al., ["Scaling Monosemanticity"](https://transformer-circuits.pub/2024/scaling-monosemanticity/) (Anthropic, 2024). SAE-based feature identification in Claude 3 Sonnet, source of the Golden Gate Claude experiment.
- Wei et al., ["Interpretability Illusions in SAEs"](https://arxiv.org/abs/2505.16004) (2025); Wu et al., [steering utility gaps](https://arxiv.org/pdf/2510.03659) (2025). Recent work surfacing limits of SAE-derived explanations.

**On behavioral-mechanistic synthesis:**
- Hubinger et al., ["Sleeper Agents"](https://arxiv.org/abs/2401.05566) (Anthropic, 2024). Conditional backdoors that survive standard safety training.
- Roytburg & Miller, ["Mind the Gap! Pathways Towards Unifying AI Safety and Ethics Research"](https://arxiv.org/abs/2512.10058) (2025). Network analysis of community separation in AI safety research.

**From neuropsychology:**
- Shahid, Mohanty et al., ["The effect of cranioplasty following decompressive craniectomy on cerebral blood perfusion, neurological, and cognitive outcome"](https://thejns.org/view/journals/j-neurosurg/128/1/article-p229.xml) (J Neurosurg, 2017).
- Bennett et al., [dead salmon fMRI poster](https://prefrontal.org/files/posters/Bennett-Salmon-2009.pdf) (2009); Vul et al., ["Puzzlingly High Correlations"](https://journals.sagepub.com/doi/abs/10.1111/j.1745-6924.2009.01125.x) (Perspectives on Psychological Science, 2009).

---

Affiliation note: I'm a researcher at Amazon AGI. The views in this post are my own and do not represent Amazon or any other organization.

*My mom would say none of this is new. She'd be right. The opportunity isn't the methodology itself. It's that AI evaluation hasn't yet stitched the two halves together as standard practice, and it can.*
