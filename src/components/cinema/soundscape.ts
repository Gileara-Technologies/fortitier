/**
 * Procedural sound for the film, Web Audio only (no files): a low night ambience, a diesel
 * engine that follows the truck's speed, a starter crank on ignition, and soft whooshes on
 * scene changes. Created on a user gesture (the "Enter with sound" button or the toggle).
 */
export class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;
  private oscA: OscillatorNode | null = null;
  private oscB: OscillatorNode | null = null;
  private roadGain: GainNode | null = null;
  private roadFilter: BiquadFilterNode | null = null;
  private noise: AudioBuffer | null = null;
  private on = false;

  get enabled() {
    return this.on;
  }

  private build() {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    master.connect(comp);
    comp.connect(ctx.destination);
    this.master = master;

    // Shared noise buffer (brown-ish).
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.2;
    }
    this.noise = buf;

    // Ambience: a soft low drone with slow movement, and wind.
    const drone = ctx.createGain();
    drone.gain.value = 0.05;
    const dl = ctx.createBiquadFilter();
    dl.type = "lowpass";
    dl.frequency.value = 320;
    drone.connect(dl);
    dl.connect(master);
    [55, 82.4, 110.2].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 1 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.25 : 0.6;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03;
      const lg = ctx.createGain();
      lg.gain.value = 0.25;
      lfo.connect(lg);
      lg.connect(g.gain);
      o.connect(g);
      g.connect(drone);
      o.start();
      lfo.start();
    });
    const wind = ctx.createBufferSource();
    wind.buffer = buf;
    wind.loop = true;
    const wf = ctx.createBiquadFilter();
    wf.type = "bandpass";
    wf.frequency.value = 500;
    wf.Q.value = 0.6;
    const wg = ctx.createGain();
    wg.gain.value = 0.05;
    const wl = ctx.createOscillator();
    wl.frequency.value = 0.08;
    const wlg = ctx.createGain();
    wlg.gain.value = 0.03;
    wl.connect(wlg);
    wlg.connect(wg.gain);
    wind.connect(wf);
    wf.connect(wg);
    wg.connect(master);
    wind.start();
    wl.start();

    // Diesel: two saws through a resonant low-pass with a firing-order wobble.
    const ef = ctx.createBiquadFilter();
    ef.type = "lowpass";
    ef.frequency.value = 160;
    ef.Q.value = 5;
    const eg = ctx.createGain();
    eg.gain.value = 0;
    ef.connect(eg);
    eg.connect(master);
    const ein = ctx.createGain();
    ein.gain.value = 0.5;
    ein.connect(ef);
    const a = ctx.createOscillator();
    a.type = "sawtooth";
    a.frequency.value = 36;
    const b = ctx.createOscillator();
    b.type = "sawtooth";
    b.frequency.value = 72.8;
    a.connect(ein);
    b.connect(ein);
    const fire = ctx.createOscillator();
    fire.frequency.value = 9;
    const fg = ctx.createGain();
    fg.gain.value = 0.2;
    fire.connect(fg);
    fg.connect(ein.gain);
    a.start();
    b.start();
    fire.start();
    this.oscA = a;
    this.oscB = b;
    this.engineFilter = ef;
    this.engineGain = eg;

    // Tyres on asphalt.
    const road = ctx.createBufferSource();
    road.buffer = buf;
    road.loop = true;
    const rf = ctx.createBiquadFilter();
    rf.type = "bandpass";
    rf.frequency.value = 260;
    rf.Q.value = 0.8;
    const rg = ctx.createGain();
    rg.gain.value = 0;
    road.connect(rf);
    rf.connect(rg);
    rg.connect(master);
    road.start();
    this.roadGain = rg;
    this.roadFilter = rf;
  }

  start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    void ctx.resume();
    this.master!.gain.setTargetAtTime(0.9, ctx.currentTime, 0.6);
    this.on = true;
  }

  stop() {
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    this.on = false;
  }

  /** Starter crank, then the engine catches into idle. */
  ignition() {
    if (!this.ctx || !this.engineGain || !this.noise) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + 0.35;
    const crank = ctx.createBufferSource();
    crank.buffer = this.noise;
    const cf = ctx.createBiquadFilter();
    cf.type = "bandpass";
    cf.frequency.value = 180;
    cf.Q.value = 2;
    const cg = ctx.createGain();
    cg.gain.value = 0;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 11;
    const lg = ctx.createGain();
    lg.gain.value = 0.35;
    lfo.connect(lg);
    lg.connect(cg.gain);
    crank.connect(cf);
    cf.connect(cg);
    cg.connect(this.master!);
    cg.gain.setValueAtTime(0, t0);
    cg.gain.linearRampToValueAtTime(0.5, t0 + 0.05);
    cg.gain.setValueAtTime(0.5, t0 + 0.6);
    cg.gain.linearRampToValueAtTime(0, t0 + 0.75);
    crank.start(t0);
    lfo.start(t0);
    crank.stop(t0 + 0.8);
    lfo.stop(t0 + 0.8);
    this.engineGain.gain.cancelScheduledValues(t0);
    this.engineGain.gain.setValueAtTime(0, t0 + 0.55);
    this.engineGain.gain.linearRampToValueAtTime(0.42, t0 + 0.7);
    this.engineGain.gain.setTargetAtTime(0.2, t0 + 0.9, 0.5);
    this.oscA?.frequency.setValueAtTime(52, t0 + 0.6);
    this.oscA?.frequency.setTargetAtTime(36, t0 + 0.8, 0.4);
  }

  setSpeed(kmh: number) {
    if (!this.ctx || !this.oscA || !this.oscB || !this.engineFilter || !this.roadGain || !this.roadFilter || !this.engineGain) return;
    const now = this.ctx.currentTime;
    const k = Math.min(1, kmh / 85);
    this.oscA.frequency.setTargetAtTime(36 + k * 34, now, 0.5);
    this.oscB.frequency.setTargetAtTime(72.8 + k * 70, now, 0.5);
    this.engineFilter.frequency.setTargetAtTime(160 + k * 380, now, 0.5);
    this.engineGain.gain.setTargetAtTime(0.2 + k * 0.12, now, 0.6);
    this.roadGain.gain.setTargetAtTime(k * 0.22, now, 0.6);
    this.roadFilter.frequency.setTargetAtTime(220 + k * 420, now, 0.6);
  }

  /** Soft air movement for a scene change. */
  whoosh() {
    if (!this.ctx || !this.noise || !this.master || !this.on) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(260, t);
    f.frequency.exponentialRampToValueAtTime(1800, t + 0.5);
    f.frequency.exponentialRampToValueAtTime(400, t + 1.1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 1.2);
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(t, Math.random() * 2);
    src.stop(t + 1.3);
  }

  /** Tiny interface tick. */
  tick() {
    if (!this.ctx || !this.master || !this.on) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(2200, t);
    o.frequency.exponentialRampToValueAtTime(1400, t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + 0.07);
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
  }
}
