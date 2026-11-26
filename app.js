(() => {
  'use strict';

  // =========================================================================
  // 1. THEME TOGGLE (Obsidian Dark default / Precision Light)
  // =========================================================================
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const savedTheme = localStorage.getItem('yuri-infra-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }
  const syncThemeUI = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeLabel.textContent = isLight ? 'Light Lab' : 'Obsidian';
  };
  syncThemeUI();
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('yuri-infra-theme', next);
    syncThemeUI();
  });

  // =========================================================================
  // 2. INTERACTIVE TERMINAL EMULATOR (100% Verified Data)
  // =========================================================================
  const termOut = document.getElementById('termOutput');
  const termForm = document.getElementById('termForm');
  const termInput = document.getElementById('termInput');
  const termClearBtn = document.getElementById('termClearBtn');

  const COMMANDS = {
    help: () => [
      '<span class="t-cy">Available Commands:</span>',
      '  <span class="t-em">neofetch</span>        — Candidate profile, GPU hardware &amp; credentials',
      '  <span class="t-em">cuobjdump --ptx</span> — Verified SM_120 PTX instruction audit for .cu kernel',
      '  <span class="t-em">bench --all</span>     — 5-run ABA median highlights across all 3 engines',
      '  <span class="t-em">ls projects</span>     — List the 3 pinned AI Infra repositories',
      '  <span class="t-em">cat project1</span>    — Deep dive: fused-cuda-triton-inductor',
      '  <span class="t-em">cat project2</span>    — Deep dive: qwen-paged-serving',
      '  <span class="t-em">cat project3</span>    — Deep dive: qwen-32k-longctx-train',
      '  <span class="t-em">contact</span>         — Email, location &amp; internship availability',
      '  <span class="t-em">clear</span>           — Clear terminal viewport',
    ].join('\n'),

    neofetch: () => [
      '<span class="t-cy">yuri-infra</span>@<span class="t-em">blackwell-sm120</span>',
      '<span class="t-dim">──────────────────────────────────────────────</span>',
      '<span class="t-cy">Name</span>     : Hongwei Zhu (朱鸿伟)',
      '<span class="t-cy">M.Eng.</span>   : Fudan University · Electronic Information (2026–2029)',
      '<span class="t-cy">B.Eng.</span>   : Tiangong University · Rank 1/59 (GPA 3.92)',
      '<span class="t-cy">GPU</span>      : NVIDIA RTX 5060 Laptop (sm_120 · 26 SMs · 7.93 GB)',
      '<span class="t-cy">Roof</span>     : <span class="t-em">312.6 GB/s</span> measured 256MB D2D (81.4% of 384 GB/s spec)',
      '<span class="t-cy">Stack</span>    : CUDA C++ (.cu) · OpenAI Triton 3.7 · PyTorch 2.13 Inductor',
      '<span class="t-cy">Research</span> : IEEE/RSJ IROS 2025 (Sole Corresponding Author &amp; Invited Reviewer)',
      '<span class="t-cy">Industry</span> : Zhejiang Uniview Technologies · Embedded C Intern (6 mos)',
      '<span class="t-cy">Tests</span>    : <span class="t-em">24/24 PASS</span> (8/8 Kernels · 8/8 Serving · 8/8 32K Training)',
    ].join('\n'),

    'cuobjdump --ptx': () => [
      '<span class="t-dim"># Target: csrc/fused_add_rmsnorm_cuda.cu (cc 12.0 · TORCH_LIBRARY_IMPL)</span>',
      '  <span class="t-em">ld.global(.nc).v4.u32</span>  : <strong>80</strong>  (128-bit uint4 vectorized loads)',
      '  <span class="t-cy">st.global.v4.u32</span>       : <strong>30</strong>  (128-bit uint4 vectorized stores)',
      '  <span class="t-vi">shfl.sync.bfly.b32</span>     : <strong>140</strong> (warp butterfly register reductions)',
      '  <span class="t-am">bar.sync</span>               : <strong>28</strong>  (CTA synchronization barriers)',
      '<span class="t-em">✔ Attained [16384×4096 FP16]: 311.0 GB/s (99.5% of 312.6 GB/s D2D roof)</span>',
    ].join('\n'),

    'bench --all': () => [
      '<span class="t-em">[01 fused-cuda-triton-inductor]</span>',
      '  • FusedAddRMSNorm .cu (512MB HBM) : <span class="t-em">311.0 GB/s (99.5% D2D)</span> | FP32: 314.7 GB/s',
      '  • Triton GQA RoPE (B=1, S=1)      : <span class="t-em">11.6 μs</span> (1.40× compile · 11.97× Eager)',
      '  • 128K Chunked Linear+CE (BF16)   : <span class="t-em">-74.2% Activ VRAM</span> (1002 → 258.5 MB, 0.99× spd)',
      '<span class="t-cy">[02 qwen-paged-serving]</span>',
      '  • 24-Way Multi-Turn (t=0 cold)    : <span class="t-cy">839.9 tok/s (7.37×)</span> · 0.63% frag · 83.8% hit',
      '  • 12w Decode + 4×768 Burst P99    : <span class="t-cy">27.45 ms</span> vs 289.03 ms (<span class="t-cy">-90.5% / 10.53×</span>)',
      '  • Cross-Repo .cu Fusion Ablation  : <span class="t-cy">814 → 400 launches (-50.9%)</span> · TTFT 15.28 ms',
      '<span class="t-vi">[03 qwen-32k-longctx-train]</span>',
      '  • Single-8GB 2-Step Steady Window : <span class="t-vi">1,024 → 32,768 tokens (32.0×)</span>',
      '  • Intra-Layer SAC (S=4096)        : <span class="t-vi">-80.6% Activ VRAM</span> (3813 → 739 MB) · 15.13 TFLOPS',
      '  • Dual-Stream DMA + ZigZag Ring   : <span class="t-vi">100% PCIe Hidden</span> (55.3ms) · <span class="t-vi">1.00×</span> bal (err 8.58e-6)',
    ].join('\n'),

    'ls projects': () => [
      'drwxr-xr-x  <span class="t-em">01_fused-cuda-triton-inductor/</span>  CUDA .cu + Triton + TorchInductor Passes (8/8 pass)',
      'drwxr-xr-x  <span class="t-cy">02_qwen-paged-serving/</span>         GQA PagedAttn + Radix-Tree + Chunked-Prefill (8/8 pass)',
      'drwxr-xr-x  <span class="t-vi">03_qwen-32k-longctx-train/</span>     Zero-Atomic FA2 + ZigZag Ring + SAC + Offload (8/8 pass)',
    ].join('\n'),

    'cat project1': () => [
      '<span class="t-em"># 01 · fused-cuda-triton-inductor</span>',
      'Repo : https://github.com/yuri-infra/fused-cuda-triton-inductor',
      'Core : Single-pass uint4 .cu RMSNorm via TORCH_LIBRARY_IMPL (0 Python dispatch tax),',
      '       two-stage Core ATen post_grad pass with dynamic transitive-closure anti-cycle merge,',
      '       and underflow-proof 128K Chunked Linear+CE (2^-4 FP16 prescale).',
    ].join('\n'),

    'cat project2': () => [
      '<span class="t-cy"># 02 · qwen-paged-serving</span>',
      'Repo : https://github.com/yuri-infra/qwen-paged-serving',
      'Core : 24L Qwen2.5-0.5B serving engine: 7:1 GQA Tensor Core Triton PagedAttention (65.4 μs,',
      '       1.76× SDPA), heapq tail-splitting Radix-Tree, LIFO pinned swap, decoupled SSE thread',
      '       (2.45 ms jitter), and cross-repo .cu RMSNorm + Triton SwiGLU fusion.',
    ].join('\n'),

    'cat project3': () => [
      '<span class="t-vi"># 03 · qwen-32k-longctx-train</span>',
      'Repo : https://github.com/yuri-infra/qwen-32k-longctx-train',
      'Core : Single-8GB 32K steady-state training for 494M Qwen2.5-0.5B: zero-atomic Triton FA2,',
      '       mp.spawn ZigZag Ring Attention (6.99× → 1.00× load balance, err 8.58e-6), Intra-Layer',
      '       SAC (15.13 TFLOPS), in-place addmm_ 152K CE, dual-stream pinned DMA &amp; HybridCPUAdamW.',
    ].join('\n'),

    contact: () => [
      '<span class="t-em">● Open for AI Infra Internships (GPU Kernels · Compilers · LLM Systems)</span>',
      '  Email        : <span class="t-cy">zhuhw26@m.fudan.edu.cn</span>',
      '  GitHub       : <span class="t-cy">https://github.com/yuri-infra</span>',
      '  Location     : Shanghai, China (Fudan University M.Eng.)',
      '  Availability : Dec 2026+ · 3–6 months (4–5 days/week)',
    ].join('\n'),
  };

  const history = [];
  let histIdx = -1;

  function appendBlock(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    history.push(cmd);
    histIdx = history.length;

    if (cmd === 'clear') {
      termOut.innerHTML = '';
      return;
    }

    appendBlock(`<div class="t-cmd"><span class="t-p">❯</span> ${escapeHtml(cmd)}</div>`);
    const key = cmd.toLowerCase();
    if (COMMANDS[key]) {
      appendBlock(COMMANDS[key]());
    } else {
      appendBlock(`<span class="t-err">zsh: command not found: ${escapeHtml(cmd)}</span> <span class="t-dim">(try 'help', 'neofetch', or 'bench --all')</span>`);
    }
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runCommand(termInput.value);
    termInput.value = '';
  });

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      histIdx = Math.max(0, histIdx - 1);
      termInput.value = history[histIdx];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      histIdx = Math.min(history.length, histIdx + 1);
      termInput.value = history[histIdx] || '';
    }
  });

  termClearBtn.addEventListener('click', () => { termOut.innerHTML = ''; });
  document.querySelectorAll('.cmd-chip').forEach((btn) => {
    btn.addEventListener('click', () => runCommand(btn.dataset.cmd));
  });

  // Boot sequence (fits cleanly without clipping; click chips or type to explore)
  runCommand('neofetch');
  appendBlock('<div class="t-dim" style="margin-top:6px">Tip: click any RUN chip below or type <span class="t-em">cuobjdump --ptx</span> / <span class="t-em">bench --all</span> / <span class="t-em">help</span>.</div>');

  // =========================================================================
  // 3. INTERACTIVE LOG-LOG GPU ROOFLINE CHART (8 Verified Operating Points)
  // =========================================================================
  const ROOFLINE_POINTS = [
    {
      id: 'rmsnorm_hbm',
      domain: 'kernels',
      color: '#10f5a0',
      label: 'FusedAddRMSNorm (.cu) 512MB',
      short: 'RMSNorm .cu (512MB)',
      I: 0.75,
      P: 0.75 * 0.311,
      regime: 'MEMORY-BOUND · 99.5% D2D ROOF',
      attained: '311.0 GB/s (1726.2 μs)',
      ratio: '99.5% D2D · 5.55× Eager',
      baseline: 'vs 1702.7 μs compile / 9583.5 μs Eager',
      intensity: '~0.75 FLOP/Byte (HBM Streaming)',
      desc: 'Large-throughput [16384×4096] FP16 fused residual add + RMSNorm saturating sustained off-chip GDDR7 bandwidth.',
      mech: 'Single-pass register-resident uint4 128-bit ld.global.nc.v4.u32 (80×) + warp shfl.sync.bfly (140×) registered via TORCH_LIBRARY_IMPL.',
      source: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/csrc/fused_add_rmsnorm_cuda.cu',
      report: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/benchmarks/local_gpu_benchmark_report.md',
    },
    {
      id: 'rmsnorm_fp32',
      domain: 'kernels',
      color: '#34d399',
      label: 'FusedAddRMSNorm (.cu) FP32',
      short: 'RMSNorm .cu (FP32)',
      I: 0.42,
      P: 0.42 * 0.3147,
      regime: 'MEMORY-BOUND · 100.7% D2D ROOF',
      attained: '314.7 GB/s (853.1 μs)',
      ratio: '100.7% D2D · 1.01× compile',
      baseline: 'vs 864.3 μs compile / 2075.2 μs Eager',
      intensity: '~0.42 FLOP/Byte (FP32 Vectorized)',
      desc: '[4096×4096] FP32 vectorized Add+RMSNorm matching and slightly exceeding native TorchInductor generated CUDA.',
      mech: 'float4 128-bit coalesced load/store pipeline with single-pass register reuse eliminating second global memory read.',
      source: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/csrc/fused_add_rmsnorm_cuda.cu',
      report: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/benchmarks/local_gpu_benchmark_report.md',
    },
    {
      id: 'gqa_rope_m1',
      domain: 'kernels',
      color: '#fbbf24',
      label: 'Triton GQA RoPE (B=1, S=1)',
      short: 'GQA RoPE (M=1)',
      I: 0.22,
      P: 0.029,
      regime: 'LAUNCH-BOUND · SINGLE-LAUNCH WIN',
      attained: '11.6 μs (Single Launch)',
      ratio: '1.40× compile · 11.97× Eager',
      baseline: 'vs 16.2 μs compile / 138.7 μs Eager',
      intensity: '~0.22 FLOP/Byte (Small-Batch Decode)',
      desc: 'Heterogeneous-head (16Q/4KV, D=128) joint Q+K rotary embedding fused into a single dual-grid Triton kernel launch.',
      mech: 'Core ATen Stage-2 sibling rope_single merge + bidirectional broadcast-safe Triton dual-grid kernel avoiding 2× launch overhead.',
      source: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/ai_infra_fused_ops/kernels.py',
      report: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/benchmarks/local_gpu_benchmark_report.md',
    },
    {
      id: 'rmsnorm_m1',
      domain: 'kernels',
      color: '#f59e0b',
      label: 'FusedAddRMSNorm (.cu) Decode M=1',
      short: 'RMSNorm .cu (M=1)',
      I: 0.14,
      P: 0.014,
      regime: 'LAUNCH-BOUND · ZERO PYTHON TAX',
      attained: '13.8 μs (C++ c10::Dispatch)',
      ratio: '1.07× compile · 10.08× Eager',
      baseline: 'vs 14.8 μs compile / 139.1 μs Eager',
      intensity: '~0.14 FLOP/Byte (Latency Regime)',
      desc: 'Single-token [1, 4096] FP16 decode Add+RMSNorm where CPU dispatch overhead dominates GPU compute.',
      mech: 'Direct C++ TORCH_LIBRARY_IMPL(ai_infra, CUDA, m) registration bypasses Python @torch.library.impl dispatch overhead.',
      source: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/csrc/fused_add_rmsnorm_cuda.cu',
      report: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/benchmarks/local_gpu_benchmark_report.md',
    },
    {
      id: 'chunked_ce',
      domain: 'kernels',
      color: '#2dd4bf',
      label: '128K Chunked Linear + CE (BF16)',
      short: '128K Chunked CE',
      I: 18.5,
      P: 5.2,
      regime: 'MEMORY-OPTIMIZED GEMM + SOFTMAX',
      attained: '115.35 ms · 258.5 MB Activ',
      ratio: '-74.2% Activ VRAM · 0.99× compile',
      baseline: 'vs 1002.0 MB activ / 114.22 ms compile',
      intensity: '~18.5 FLOP/Byte (Chunked GEMM+CE)',
      desc: 'Cross-GEMM chunked projection + Triton online-softmax cross-entropy avoiding [4096×128,256] logits materialization.',
      mech: 'chunk_size=1024 streaming GEMM + in-place Triton online-softmax backward with 2^-4 FP16 exponent prescaling preventing underflow.',
      source: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/ai_infra_fused_ops/kernels.py',
      report: 'https://github.com/yuri-infra/fused-cuda-triton-inductor/blob/main/benchmarks/local_gpu_benchmark_report.md',
    },
    {
      id: 'paged_attn',
      domain: 'serving',
      color: '#00e5ff',
      label: 'Triton PagedAttention Split-KV (7:1 GQA)',
      short: 'PagedAttn Split-KV',
      I: 6.2,
      P: 1.55,
      regime: 'MEMORY-BOUND · 7:1 GQA REUSE',
      attained: '65.4 μs · 0.22 MB Temp',
      ratio: '1.76× vs .flatten()+SDPA',
      baseline: 'vs 115.1 μs & 8.22 MB temp copy',
      intensity: '~6.2 FLOP/Byte (Grouped Q Reuse)',
      desc: 'B=16, Context=1024 non-contiguous 16-token KV page decode on Qwen2.5 (14Q/2KV) with zero contiguous KV copy.',
      mech: 'Packs 7 Q-heads into BLOCK_G=16 for Tensor Core tl.dot, reading each physical KV page once per group with per-seq local_bps Split-KV.',
      source: 'https://github.com/yuri-infra/qwen-paged-serving/blob/main/llm_serving/paged_attention.py',
      report: 'https://github.com/yuri-infra/qwen-paged-serving/blob/main/benchmarks/local_serving_benchmark_report.md',
    },
    {
      id: 'serving_hit',
      domain: 'serving',
      color: '#38bdf8',
      label: 'Qwen2.5 Serving Hit TTFT (+ .cu Fusion)',
      short: 'Serving Hit TTFT',
      I: 1.9,
      P: 0.42,
      regime: 'LAUNCH-REDUCED E2E PREFILL',
      attained: '15.28 ms · 400 Launches',
      ratio: '3.57× Baseline · -50.9% Launches',
      baseline: 'vs 54.62 ms SDPA / 19.85 ms (814 launches)',
      intensity: '~1.9 FLOP/Byte (32-tok Tail Recompute)',
      desc: '1056-token prompt hitting 1024 Radix-Tree prefix tokens across all 24 Qwen2.5-0.5B layers with fused .cu RMSNorm + SwiGLU.',
      mech: 'Eliminates 414 small CUDA launches per step via cross-repo .cu FusedAddRMSNorm + Triton SwiGLU, cutting hit TTFT by 23.0% over Eager norm.',
      source: 'https://github.com/yuri-infra/qwen-paged-serving/blob/main/llm_serving/model_runner.py',
      report: 'https://github.com/yuri-infra/qwen-paged-serving/blob/main/benchmarks/local_serving_benchmark_report.md',
    },
    {
      id: 'sac_fa2',
      domain: 'training',
      color: '#b57bff',
      label: 'Intra-Layer SAC + Zero-Atomic Triton FA2',
      short: 'SAC + Triton FA2',
      I: 68.0,
      P: 15.13,
      regime: 'COMPUTE-BOUND · SUSTAINED E2E CEILING',
      attained: '15.13 TFLOPS (945.4 ms)',
      ratio: '-80.6% Activ VRAM · 1.02× Full-Ckpt',
      baseline: 'vs 3813.0 MB Eager / 14.87 TF Full-Ckpt',
      intensity: '~68 FLOP/Byte (S=4096 Fwd+Bwd)',
      desc: 'Full 24-layer Qwen2.5-0.5B S=4096 training retaining only compact attention boundaries and skipping O(S^2) & QKV/O/Down recompute.',
      mech: 'Zero-atomic Triton GQA FA2 backward (O(S) LSE) + SelectiveLayerCheckpointFunction discarding >80% wide SwiGLU activations.',
      source: 'https://github.com/yuri-infra/qwen-32k-longctx-train/blob/main/long_ctx_train/selective_checkpoint.py',
      report: 'https://github.com/yuri-infra/qwen-32k-longctx-train/blob/main/benchmarks/local_training_benchmark_report.md',
    },
  ];

  const rfSvg = document.getElementById('rooflineSvg');
  let activeDomain = 'all';
  let selectedId = 'rmsnorm_hbm';

  function updateInspector(pt) {
    selectedId = pt.id;
    const badge = document.getElementById('inspBadge');
    badge.textContent = pt.regime;
    badge.style.color = pt.color;
    badge.style.borderColor = pt.color;
    badge.style.background = `${pt.color}1a`;

    document.getElementById('inspTitle').textContent = pt.label;
    document.getElementById('inspDesc').textContent = pt.desc;
    document.getElementById('inspAttained').textContent = pt.attained;
    document.getElementById('inspRatio').textContent = pt.ratio;
    document.getElementById('inspBaseline').textContent = pt.baseline;
    document.getElementById('inspIntensity').textContent = pt.intensity;
    document.getElementById('inspMech').textContent = pt.mech;
    document.getElementById('inspSourceLink').href = pt.source;
    document.getElementById('inspReportLink').href = pt.report;
    renderRoofline();
  }

  function renderRoofline() {
    const px0 = 62, py0 = 26, pw = 552, ph = 294;
    const ixMin = Math.log10(0.08), ixMax = Math.log10(160);
    const pyMin = Math.log10(0.008), pyMax = Math.log10(45);
    const mx = (v) => px0 + ((Math.log10(v) - ixMin) / (ixMax - ixMin)) * pw;
    const my = (v) => py0 + ph - ((Math.log10(v) - pyMin) / (pyMax - pyMin)) * ph;

    const bwMeas = 0.3126, bwSpec = 0.384, pPeak = 15.13;
    const iRidge = pPeak / bwMeas;
    const xR = mx(iRidge), yP = my(pPeak);
    const yML = my(0.08 * bwMeas), ySL = my(0.08 * bwSpec);
    const xSR = mx(32 / bwSpec), ySR = my(32);

    const visible = ROOFLINE_POINTS.filter((p) => activeDomain === 'all' || p.domain === activeDomain);
    const sel = ROOFLINE_POINTS.find((p) => p.id === selectedId) || visible[0];

    let parts = [
      `<defs>
        <linearGradient id="rfMem" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10f5a0" stop-opacity="0.16"/>
          <stop offset="100%" stop-color="#10f5a0" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="rfCmp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#b57bff" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#b57bff" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="rfLine" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10f5a0"/>
          <stop offset="72%" stop-color="#00e5ff"/>
          <stop offset="100%" stop-color="#b57bff"/>
        </linearGradient>
        <clipPath id="rfPlotClip"><rect x="${px0}" y="${py0}" width="${pw}" height="${ph}"/></clipPath>
      </defs>`,
      `<rect x="${px0}" y="${py0}" width="${pw}" height="${ph}" fill="#050912" stroke="#1e2d44" stroke-width="1"/>`,
      `<g clip-path="url(#rfPlotClip)">
        <polygon points="${px0},${py0+ph} ${px0},${yML} ${xR},${yP} ${xR},${py0+ph}" fill="url(#rfMem)"/>
        <polygon points="${xR},${py0+ph} ${xR},${yP} ${px0+pw},${yP} ${px0+pw},${py0+ph}" fill="url(#rfCmp)"/>
      </g>`,
    ];

    // Gridlines
    [0.1, 1, 10, 100].forEach((v) => {
      const x = mx(v);
      parts.push(`<line x1="${x}" y1="${py0}" x2="${x}" y2="${py0+ph}" stroke="#152236" stroke-width="1"/>`);
      parts.push(`<text x="${x}" y="${py0+ph+17}" text-anchor="middle" fill="#7f92ab" font-size="10.5" font-family="var(--font-mono)">${v}</text>`);
    });
    parts.push(`<line x1="${xR}" y1="${yP}" x2="${xR}" y2="${py0+ph}" stroke="#b57bff" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.75"/>`);
    parts.push(`<text x="${xR}" y="${py0+ph+17}" text-anchor="middle" fill="#b57bff" font-size="10.5" font-weight="700" font-family="var(--font-mono)">48.4</text>`);

    [0.01, 0.1, 1, 10, 30].forEach((v) => {
      const y = my(v);
      parts.push(`<line x1="${px0}" y1="${y}" x2="${px0+pw}" y2="${y}" stroke="#152236" stroke-width="1"/>`);
      parts.push(`<text x="${px0-9}" y="${y+3.5}" text-anchor="end" fill="#7f92ab" font-size="10.5" font-family="var(--font-mono)">${v}</text>`);
    });

    // Roofline ceilings
    parts.push(`<g clip-path="url(#rfPlotClip)">
      <line x1="${px0}" y1="${ySL}" x2="${xSR}" y2="${ySR}" stroke="#64748b" stroke-width="1.3" stroke-dasharray="5 5" opacity="0.65"/>
      <polyline points="${px0},${yML} ${xR},${yP} ${px0+pw},${yP}" fill="none" stroke="url(#rfLine)" stroke-width="2.8" stroke-linejoin="round"/>
    </g>`);

    // Active crosshair for selected node
    if (sel) {
      const sx = mx(sel.I), sy = my(sel.P);
      parts.push(`<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${py0+ph}" stroke="${sel.color}" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>`);
      parts.push(`<line x1="${px0}" y1="${sy}" x2="${sx}" y2="${sy}" stroke="${sel.color}" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>`);
    }

    // Regime labels + axis titles
    parts.push(`<text x="${mx(6)}" y="${py0+ph-12}" text-anchor="middle" fill="#64748b" font-size="10" font-weight="700" letter-spacing="1.4" font-family="var(--font-mono)">MEMORY-BOUND</text>`);
    parts.push(`<text x="${mx(96)}" y="${py0+ph-12}" text-anchor="middle" fill="#b57bff" font-size="10" font-weight="700" letter-spacing="1.0" font-family="var(--font-mono)">COMPUTE</text>`);
    parts.push(`<text x="${px0+pw/2}" y="358" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600" font-family="var(--font-mono)">Operational Intensity I (FLOP / Byte) · Log₁₀</text>`);
    parts.push(`<text transform="translate(17, ${py0+ph/2}) rotate(-90)" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600" font-family="var(--font-mono)">Attained Performance (TFLOP/s)</text>`);
    parts.push(`<text x="${px0+pw-6}" y="${yP-10}" text-anchor="end" fill="#b57bff" font-size="10.2" font-weight="700" font-family="var(--font-mono)">15.13 TFLOPS Sustained E2E</text>`);

    // Points
    const labelOffsets = {
      rmsnorm_hbm: [-10, -14, 'end'],
      rmsnorm_fp32: [12, 14, 'start'],
      gqa_rope_m1: [12, 2, 'start'],
      rmsnorm_m1: [12, 13, 'start'],
      chunked_ce: [12, 16, 'start'],
      paged_attn: [12, 16, 'start'],
      serving_hit: [12, 16, 'start'],
      sac_fa2: [0, 26, 'middle'],
    };

    visible.forEach((p) => {
      const cx = mx(p.I), cy = my(p.P);
      const isSel = p.id === selectedId;
      const [dx, dy, anchor] = labelOffsets[p.id] || [10, -10, 'start'];
      parts.push(`<g class="rf-node" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.label}">
        ${isSel ? `<circle cx="${cx}" cy="${cy}" r="13" fill="${p.color}" fill-opacity="0.18" stroke="${p.color}" stroke-width="1.4"/>` : ''}
        <circle class="rf-dot" cx="${cx}" cy="${cy}" r="${isSel ? 6.5 : 5.2}" fill="${p.color}" stroke="#060b14" stroke-width="1.8"/>
        <text x="${cx+dx}" y="${cy+dy}" text-anchor="${anchor}" fill="${isSel ? '#ffffff' : '#cbd5e1'}" font-size="${isSel ? 10.6 : 9.6}" font-weight="${isSel ? 700 : 500}" font-family="var(--font-mono)">${p.short}</text>
      </g>`);
    });

    rfSvg.innerHTML = parts.join('');
    rfSvg.querySelectorAll('.rf-node').forEach((el) => {
      const pt = ROOFLINE_POINTS.find((x) => x.id === el.dataset.id);
      if (!pt) return;
      el.addEventListener('click', () => updateInspector(pt));
      el.addEventListener('mouseenter', () => updateInspector(pt));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateInspector(pt); }
      });
    });
  }

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeDomain = btn.dataset.domain;
      const matching = ROOFLINE_POINTS.filter((p) => activeDomain === 'all' || p.domain === activeDomain);
      if (matching.length && !matching.some((p) => p.id === selectedId)) {
        updateInspector(matching[0]);
      } else {
        renderRoofline();
      }
    });
  });

  updateInspector(ROOFLINE_POINTS[0]);

  // =========================================================================
  // 4. SYSTEM TABS + DEEP-LINK HASH SUPPORT (#kernels, #serving, #longctx)
  // =========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.sys-panel');

  function activateTab(tabName) {
    tabBtns.forEach((b) => {
      const on = b.dataset.tab === tabName;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    tabPanels.forEach((p) => {
      p.classList.toggle('active', p.id === `panel-${tabName}`);
    });
  }

  tabBtns.forEach((b) => {
    b.addEventListener('click', () => {
      activateTab(b.dataset.tab);
      history.replaceState?.(null, '', `#${b.dataset.tab}`);
    });
  });

  function checkHash() {
    const h = window.location.hash.replace('#', '');
    if (['kernels', 'serving', 'longctx'].includes(h)) {
      activateTab(h);
      document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  window.addEventListener('hashchange', checkHash);
  checkHash();

  // =========================================================================
  // 5. TAB 1 SIMULATOR: KERNELS & INDUCTOR WORKLOAD COMPARATOR
  // =========================================================================
  const KERNEL_WORKLOADS = [
    {
      id: 'hbm_rmsnorm',
      label: 'RMSNorm 512MB',
      unit: 'μs (lower is faster)',
      bars: [
        { name: 'PyTorch Eager', val: 9583.5, txt: '9583.5 μs (56.1 GB/s)', col: '#64748b' },
        { name: 'torch.compile (Inductor)', val: 1702.7, txt: '1702.7 μs (315.3 GB/s)', col: '#38bdf8' },
        { name: 'Ours: Native CUDA C++ (.cu)', val: 1726.2, txt: '1726.2 μs · 311.0 GB/s (99.5% D2D)', col: '#10f5a0' },
      ],
      note: 'Pure HBM regime [16384×4096 FP16]: .cu uint4 128-bit kernel hits 99.5% of measured 312.6 GB/s D2D roof (5.55× over Eager).',
    },
    {
      id: 'gqa_rope',
      label: 'GQA RoPE (M=1)',
      unit: 'μs (lower is faster)',
      bars: [
        { name: 'PyTorch Eager', val: 138.7, txt: '138.7 μs', col: '#64748b' },
        { name: 'torch.compile (Inductor)', val: 16.2, txt: '16.2 μs', col: '#38bdf8' },
        { name: 'Ours: Dual-Grid Triton GQA RoPE', val: 11.6, txt: '11.6 μs (1.40× compile · 11.97× Eager)', col: '#10f5a0' },
      ],
      note: 'B=1, S=1 (16Q/4KV, D=128) FP16: fusing sibling Q+K RoPE into a single launch beats native TorchInductor by 1.40×.',
    },
    {
      id: 'chunked_ce_vram',
      label: '128K CE VRAM',
      unit: 'MB Pure Intermediate Activations (lower is better)',
      bars: [
        { name: 'PyTorch Eager (F.cross_entropy)', val: 2747.5, txt: '2747.5 MB activ (3006 MB total)', col: '#fb7185' },
        { name: 'torch.compile (Inductor)', val: 1002.0, txt: '1002.0 MB activ (1260.5 MB total)', col: '#38bdf8' },
        { name: 'Ours: Chunked GEMM + Triton Online CE', val: 258.5, txt: '258.5 MB activ (-74.2% vs compile, 0.99× spd)', col: '#10f5a0' },
      ],
      note: 'M=4096, H=1024, Vocab=128,256 BF16 (corrected zero-grad baseline): eliminates [M, V] logits materialization at 115.35 ms vs 114.22 ms compile.',
    },
    {
      id: 'llama8l',
      label: '8L Stack B=8',
      unit: 'ms per step (5-run ABA median)',
      bars: [
        { name: 'PyTorch Eager', val: 6.862, txt: '6.862 ms', col: '#64748b' },
        { name: 'Native torch.compile', val: 2.956, txt: '2.956 ms', col: '#38bdf8' },
        { name: 'Ours: Post-Grad Pass + .cu c10::Dispatch', val: 2.864, txt: '2.864 ms (1.03× compile · 2.40× Eager)', col: '#10f5a0' },
      ],
      note: '8-Layer LLaMA-3 GQA Decoder Stack (B=8, S=1): 17 RMSNorms dispatched in pure C++ with strict FXGraphCache isolation (default path runtime counter = 0).',
    },
  ];

  const kSel = document.getElementById('kernelSelector');
  const kBars = document.getElementById('kernelBars');
  const kNote = document.getElementById('kernelNote');

  function renderKernelWorkload(id) {
    const w = KERNEL_WORKLOADS.find((x) => x.id === id) || KERNEL_WORKLOADS[0];
    kSel.querySelectorAll('.mini-pill').forEach((b) => b.classList.toggle('active', b.dataset.wid === w.id));
    const maxVal = Math.max(...w.bars.map((b) => b.val));
    kBars.innerHTML = w.bars.map((b) => {
      const pct = Math.max(6, (b.val / maxVal) * 100);
      return `<div class="bar-row">
        <div class="bar-meta"><span class="mono">${b.name}</span><strong class="mono" style="color:${b.col}">${b.txt}</strong></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${b.col}"></div></div>
      </div>`;
    }).join('');
    kNote.textContent = `${w.unit} — ${w.note}`;
  }

  kSel.innerHTML = KERNEL_WORKLOADS.map((w, i) =>
    `<button type="button" class="mini-pill mono ${i === 0 ? 'active' : ''}" data-wid="${w.id}">${w.label}</button>`
  ).join('');
  kSel.querySelectorAll('.mini-pill').forEach((b) => b.addEventListener('click', () => renderKernelWorkload(b.dataset.wid)));
  renderKernelWorkload(KERNEL_WORKLOADS[0].id);

  // =========================================================================
  // 6. TAB 2 SIMULATOR: PAGED SERVING ABLATION SWITCH
  // =========================================================================
  const SERVING_MODES = {
    baseline: {
      note: 'Baseline: Contiguous pre-allocated KV cache + atomic prefill + native PyTorch SDPA. Suffers from 35.99% internal KV fragmentation and severe head-of-line decode stalls (289.03 ms P99) under 4×768 burst injection.',
      cards: [
        { label: '1056-Tok TTFT', val: '54.62 ms', delta: '1.00× baseline', pct: 100, col: '#fb7185' },
        { label: 'Burst ITL P99 (4×768)', val: '289.03 ms', delta: 'HoL decode stall', pct: 100, col: '#fb7185' },
        { label: '24-Way Throughput', val: '114.0 tok/s', delta: '1.00× (no prefix sharing)', pct: 14, col: '#94a3b8' },
        { label: 'KV Fragmentation', val: '35.99%', delta: 'Contiguous pre-alloc waste', pct: 100, col: '#fb7185' },
        { label: 'CUDA Launches / Step', val: '814+ ops', delta: 'Unfused Eager Norm/MLP', pct: 100, col: '#fbbf24' },
        { label: 'SSE Loop Jitter (2ms)', val: '41.67 ms', delta: 'Sync coroutine blocking', pct: 100, col: '#fb7185' },
      ],
    },
    paged_eager: {
      note: 'Paged + Radix-Tree (Symmetric Eager Norm/MLP): True 7:1 GQA Triton PagedAttention + 1024-token prefix hit drops TTFT to 19.85 ms, Chunked-Prefill cuts P99 ITL by 90.5%, but unfused Norm/SwiGLU still fires 814 CUDA kernels/step.',
      cards: [
        { label: '1056-Tok TTFT (Hit)', val: '19.85 ms', delta: '2.75× vs baseline (-63.7%)', pct: 36, col: '#38bdf8' },
        { label: 'Burst ITL P99 (budget=96)', val: '27.45 ms', delta: '-90.5% (10.53× smoother)', pct: 10, col: '#00e5ff' },
        { label: '24-Way Throughput', val: '839.9 tok/s', delta: '7.37× · 83.8% Radix hit', pct: 100, col: '#00e5ff' },
        { label: 'KV Fragmentation', val: '0.63%', delta: '16-token on-demand pages', pct: 3, col: '#10f5a0' },
        { label: 'CUDA Launches / Step', val: '814 ops', delta: 'Host launch tax bottleneck', pct: 100, col: '#fbbf24' },
        { label: 'SSE Loop Jitter (2ms)', val: '2.45 ms', delta: 'Decoupled GPU thread (<5ms)', pct: 6, col: '#10f5a0' },
      ],
    },
    full_fused: {
      note: 'Full Stack (+ Cross-Repo .cu FusedAddRMSNorm & Triton SwiGLU): Compacts 814 → 400 CUDA launches/step (-50.9%), pushing 1056-tok hit TTFT down another 23.0% to 15.28 ms (3.57× / -72.0% vs baseline) with 0.63% KV fragmentation.',
      cards: [
        { label: '1056-Tok TTFT (Fused)', val: '15.28 ms', delta: '-72.0% (3.57×) · -23% vs Eager', pct: 28, col: '#10f5a0' },
        { label: 'Burst ITL P99 (budget=96)', val: '27.45 ms', delta: '-90.5% (10.53× smoother)', pct: 10, col: '#00e5ff' },
        { label: '24-Way Throughput', val: '839.9 tok/s', delta: '7.37× · 83.8% Radix hit', pct: 100, col: '#00e5ff' },
        { label: 'KV Fragmentation', val: '0.63%', delta: 'Down from 35.99%', pct: 3, col: '#10f5a0' },
        { label: 'CUDA Launches / Step', val: '400 ops', delta: '-50.9% (-414 launches/step)', pct: 49, col: '#10f5a0' },
        { label: 'SSE Loop Jitter (2ms)', val: '2.45 ms', delta: 'Decoupled GPU thread (<5ms)', pct: 6, col: '#10f5a0' },
      ],
    },
  };

  const servGrid = document.getElementById('servingMetricsGrid');
  const servNote = document.getElementById('servingModeNote');

  function renderServing(mode) {
    const cfg = SERVING_MODES[mode] || SERVING_MODES.full_fused;
    document.querySelectorAll('[data-serv-mode]').forEach((b) => b.classList.toggle('active', b.dataset.servMode === mode));
    servGrid.innerHTML = cfg.cards.map((c) => `
      <div class="serv-tile">
        <div class="serv-label mono">${c.label}</div>
        <div class="serv-val mono" style="color:${c.col}">${c.val}</div>
        <div class="serv-delta mono" style="color:${c.col}">${c.delta}</div>
        <div class="serv-bar"><div class="serv-bar-fill" style="width:${c.pct}%;background:${c.col}"></div></div>
      </div>
    `).join('');
    servNote.textContent = cfg.note;
  }
  document.querySelectorAll('[data-serv-mode]').forEach((b) => b.addEventListener('click', () => renderServing(b.dataset.servMode)));
  renderServing('full_fused');

  // =========================================================================
  // 7. TAB 3 SIMULATORS: ZIGZAG RING BALANCE + SINGLE-8GB CONTEXT LADDER
  // =========================================================================
  const RING_MODES = {
    contiguous: {
      ranks: [
        { name: 'R0 [c0,c1]', pairs: 524800, pct: 14.3, col: '#fbbf24' },
        { name: 'R1 [c2,c3]', pairs: 1573376, pct: 42.9, col: '#fb923c' },
        { name: 'R2 [c4,c5]', pairs: 2621952, pct: 71.4, col: '#f43f5e' },
        { name: 'R3 [c6,c7]', pairs: 3670528, pct: 100.0, col: '#e11d48' },
      ],
      summary: 'Contiguous Split: Max/Min causal pair load ratio = 6.99× (3,670,528 vs 524,800). Rank 3 straggler stalls the entire 4-GPU ring by 1.75×.',
    },
    zigzag: {
      ranks: [
        { name: 'R0 [c0,c7]', pairs: 2097664, pct: 57.1, col: '#10f5a0' },
        { name: 'R1 [c1,c6]', pairs: 2097664, pct: 57.1, col: '#00e5ff' },
        { name: 'R2 [c2,c5]', pairs: 2097664, pct: 57.1, col: '#38bdf8' },
        { name: 'R3 [c3,c4]', pairs: 2097664, pct: 57.1, col: '#b57bff' },
      ],
      summary: 'ZigZag Symmetric Split (c_r, c_{2P-1-r}): Exact 1.00× load balance across all 4 ranks (2,097,664 pairs each) · mp.spawn world_size=2 max backward grad err = 8.58e-6.',
    },
  };

  const ringBarsEl = document.getElementById('ringBars');
  const ringSumEl = document.getElementById('ringSummary');

  function renderRing(mode) {
    const cfg = RING_MODES[mode] || RING_MODES.zigzag;
    document.querySelectorAll('[data-ring-mode]').forEach((b) => b.classList.toggle('active', b.dataset.ringMode === mode));
    ringBarsEl.innerHTML = cfg.ranks.map((r) => `
      <div class="ring-row mono">
        <span class="ring-label">${r.name}</span>
        <div class="ring-track"><div class="ring-fill" style="width:${r.pct}%;background:${r.col}"></div></div>
        <span class="ring-val">${r.pairs.toLocaleString()}</span>
      </div>
    `).join('');
    ringSumEl.textContent = cfg.summary;
  }
  document.querySelectorAll('[data-ring-mode]').forEach((b) => b.addEventListener('click', () => renderRing(b.dataset.ringMode)));
  renderRing('zigzag');

  const LADDER_STAGES = [
    {
      id: '1k',
      title: '1. Standard PyTorch Baseline (SDPA + Full CE + GPU AdamW)',
      ctx: '1,024 tokens (1.0×)',
      pct: 6,
      detail: 'Step 2 steady-state ceiling on 7.93 GB GDDR7: resident GPU AdamW moments (~1.88 GB) + materialized [S-1, 151,936] logits trigger OOM at 2,048 tokens.',
    },
    {
      id: '4k',
      title: '2. Streaming 152K addmm_ Chunked CE + HybridCPUAdamW',
      ctx: '4,096 tokens (4.0×)',
      pct: 18,
      detail: 'Eliminates >93% vocabulary logits workspace (872 MB vs ~13.9 GB at M=16K) and moves 5.52 GB FP32 master weights/moments to host RAM via 64 MB pinned staging.',
    },
    {
      id: '24k',
      title: '3. Pure GPU: Zero-Atomic Triton FA2 + Intra-Layer SAC',
      ctx: '24,576 tokens (24.0×)',
      pct: 75,
      detail: 'Discards >80% wide SwiGLU activations while skipping attention & QKV/O/Down recompute (S=4096: 3813 → 739.3 MB activ, 15.13 TFLOPS > 14.87 TF Full-Ckpt).',
    },
    {
      id: '32k',
      title: '4. Full Hybrid: + Dual-Stream Pinned DMA Offload/Prefetch',
      ctx: '32,768 tokens (32.0× · Full Qwen2.5 32K)',
      pct: 100,
      detail: 'AdaptiveHybridMemoryPlanner offloads shallowest layers to slot-safe PinnedActivationPool: B=4, S=2048 672 MB round-trip hides 55.33 ms over 52.47 ms bare PCIe (100% hidden).',
    },
  ];

  const ladderEl = document.getElementById('ladderList');
  const ladderDetailEl = document.getElementById('ladderDetail');

  function selectLadder(id) {
    const st = LADDER_STAGES.find((x) => x.id === id) || LADDER_STAGES[3];
    ladderEl.querySelectorAll('.ladder-step').forEach((el) => el.classList.toggle('active', el.dataset.lid === st.id));
    ladderDetailEl.textContent = st.detail;
  }

  ladderEl.innerHTML = LADDER_STAGES.map((st, idx) => `
    <button type="button" class="ladder-step ${idx === 3 ? 'active' : ''}" data-lid="${st.id}">
      <div class="ladder-top mono"><span>${st.title}</span><span class="accent-vi">${st.ctx}</span></div>
      <div class="ladder-bar-wrap"><div class="ladder-bar" style="width:${st.pct}%"></div></div>
    </button>
  `).join('');
  ladderEl.querySelectorAll('.ladder-step').forEach((el) => el.addEventListener('click', () => selectLadder(el.dataset.lid)));
  selectLadder('32k');
})();
