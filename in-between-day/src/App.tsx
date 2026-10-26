import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const PALETTE = [
  { n: 'Lavender', c: '#b9a8ff' }, { n: 'Ice blue', c: '#9fd8ff' }, { n: 'Peach', c: '#ffc9a8' },
  { n: 'Rose', c: '#f4a6c8' }, { n: 'Mint', c: '#a8f0d4' }, { n: 'Gold', c: '#f2dc8e' },
]

/* Two strands braided around a shared centre; s = +1 / -1 gives the opposite phase. */
const braid = (s: 1 | -1, x0 = 60, x1 = 740) => {
  const pts: string[] = []
  for (let x = x0; x <= x1; x += 6) {
    const d = x - 400
    const a = 66 * Math.exp(-(d * d) / (2 * 105 * 105))
    pts.push(`${x},${(200 + s * a * Math.sin(d / 32)).toFixed(1)}`)
  }
  return 'M' + pts.join('L')
}
/* An untied strand reaching in from one side; p = 0 far apart, 1 meeting. */
const reach = (side: 1 | -1, p: number) => {
  const sx = side === 1 ? 60 : 740, ex = side === 1 ? 80 + p * 320 : 720 - p * 320
  const ey = 200 - side * (1 - p) * 46
  const pts: string[] = []
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, x = sx + (ex - sx) * t
    pts.push(`${x.toFixed(1)},${(200 + (ey - 200) * t * t + 12 * Math.sin(x / 36) * (1 - t * 0.6)).toFixed(1)}`)
  }
  return { d: 'M' + pts.join('L'), ex, ey }
}

type Knot = { a: string; b: string; animate?: boolean; id: string }
function KnotArt({ a, b, animate, id }: Knot) {
  const rm = useReducedMotion()
  const t = (delay: number) => (animate && !rm ? { duration: 1.8, delay, ease: 'easeInOut' as const } : { duration: 0 })
  const init = animate && !rm ? { pathLength: 0 } : { pathLength: 1 }
  return (
    <g>
      <defs><filter id={id} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5" /></filter></defs>
      <motion.path d={braid(1)} stroke={a} strokeWidth="9" fill="none" opacity=".45" filter={`url(#${id})`} initial={init} animate={{ pathLength: 1 }} transition={t(0)} />
      <motion.path d={braid(-1)} stroke={b} strokeWidth="9" fill="none" opacity=".45" filter={`url(#${id})`} initial={init} animate={{ pathLength: 1 }} transition={t(0.5)} />
      <motion.path d={braid(1)} stroke={a} strokeWidth="3" strokeLinecap="round" fill="none" initial={init} animate={{ pathLength: 1 }} transition={t(0)} />
      <motion.path d={braid(-1)} stroke="#101528" strokeWidth="8" fill="none" initial={init} animate={{ pathLength: 1 }} transition={t(0.5)} />
      <motion.path d={braid(-1)} stroke={b} strokeWidth="3" strokeLinecap="round" fill="none" initial={init} animate={{ pathLength: 1 }} transition={t(0.5)} />
      <motion.circle cx="400" cy="200" r="7" fill="#f3eefb" initial={{ opacity: animate && !rm ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ delay: animate && !rm ? 2.2 : 0, duration: 0.8 }} />
    </g>
  )
}

function Hero() {
  const rm = useReducedMotion()
  const d = (n: number) => (rm ? 0 : n)
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-16">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <motion.path d="M-20 150 C 150 60, 250 260, 330 190 S 380 190, 392 196" stroke="#b9a8ff" strokeWidth="2" fill="none" initial={{ pathLength: 0, x: rm ? 0 : -60 }} animate={{ pathLength: 1, x: 0 }} transition={{ duration: d(9), ease: 'easeOut' }} />
        <motion.path d="M820 260 C 650 340, 550 130, 470 210 S 420 210, 408 204" stroke="#ffc9a8" strokeWidth="2" fill="none" initial={{ pathLength: 0, x: rm ? 0 : 60 }} animate={{ pathLength: 1, x: 0 }} transition={{ duration: d(9), ease: 'easeOut' }} />
      </svg>
      <div className="relative z-10 max-w-5xl">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(1.5) }} className="mb-8 text-sm tracking-widest text-ice">March 21 — a new holiday</motion.p>
        <motion.h1 initial={{ opacity: 0, y: d(24) }} animate={{ opacity: 1, y: 0 }} transition={{ duration: d(1.6), delay: d(0.6) }} className="font-serif text-5xl font-light leading-[1.05] md:text-8xl">What if the space between us wasn’t empty?</motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(2), delay: d(3.4) }} className="mt-12">
          <h2 className="font-serif text-3xl italic text-peach md:text-5xl">The In-Between Day</h2>
          <p className="mt-3 text-lg text-pearl/80">Not halfway. Whole in every world.</p>
          <a href="#ritual" className="mt-10 inline-block rounded-full border border-lav px-8 py-3 text-lav transition hover:bg-lav hover:text-night">Experience the ritual</a>
        </motion.div>
      </div>
    </section>
  )
}

function Why() {
  const lines = [
    ['The courage', 'to walk into a community where no one yet knows your name.'],
    ['The vulnerability', 'of starting over, and of being a beginner again.'],
    ['The connections', 'that slowly turn an unfamiliar place into somewhere you belong.'],
  ]
  return (
    <section className="mx-auto max-w-6xl px-6 py-40 md:px-16">
      <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} className="max-w-4xl font-serif text-4xl font-light leading-tight md:text-6xl">We celebrate arrivals. We rarely celebrate the crossing.</motion.h2>
      <p className="mt-10 max-w-xl text-lg leading-relaxed text-pearl/80">The In-Between Day celebrates the in-between itself: the stretch between the world you know and the one you are entering.</p>
      <ul className="mt-14 divide-y divide-pearl/15 border-y border-pearl/15">
        {lines.map(([h, t], i) => (
          <li key={h} className="grid gap-2 py-7 md:grid-cols-12 md:items-baseline">
            <span className="font-serif text-2xl italic md:col-span-4 md:text-3xl" style={{ color: ['#b9a8ff', '#9fd8ff', '#ffc9a8'][i] }}>{h}</span>
            <span className="text-lg text-pearl/80 md:col-span-8">{t}</span>
          </li>
        ))}
      </ul>
      <p className="mt-14 max-w-2xl font-serif text-xl italic leading-relaxed text-ice">As I prepare to move from the University of Utah Asia Campus to Salt Lake City, I stand in this in-between myself. I hope to belong fully to both worlds, not halfway to either. This day is for anyone who is crossing between worlds.</p>
    </section>
  )
}

function Equinox() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-16">
      <svg viewBox="0 0 400 240" className="w-full max-w-md" role="img" aria-label="Two equal circles, one lavender and one peach, overlapping in the middle">
        <motion.circle cx="155" cy="120" r="85" fill="none" stroke="#b9a8ff" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4 }} />
        <motion.circle cx="245" cy="120" r="85" fill="none" stroke="#ffc9a8" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, delay: 0.4 }} />
        <motion.ellipse cx="200" cy="120" rx="35" ry="79" fill="#f3eefb" initial={{ opacity: 0 }} whileInView={{ opacity: 0.18 }} viewport={{ once: true }} transition={{ delay: 2.4, duration: 1.2 }} />
      </svg>
      <div>
        <h2 className="font-serif text-3xl font-light md:text-5xl">Why March 21?</h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-pearl/80">Around this date, the spring equinox brings day and night close to equal. For a moment, neither one wins.</p>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-pearl/80">The exact moment shifts a little each year, so we keep one fixed day to honor the balance: a day that belongs fully to two worlds.</p>
      </div>
    </section>
  )
}

function Ritual({ onTied }: { onTied: (k: { a: string; b: string; la: string; lb: string }) => void }) {
  const [a, setA] = useState(PALETTE[0].c), [b, setB] = useState(PALETTE[2].c)
  const [la, setLa] = useState('A place I come from'), [lb, setLb] = useState('A world I am discovering')
  const [phase, setPhase] = useState<'set' | 'connect' | 'tied'>('set')
  const [p, setP] = useState(0)
  const drag = useRef<1 | -1 | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const L = reach(1, p), R = reach(-1, p)

  const tie = () => { setP(1); setPhase('tied'); onTied({ a, b, la, lb }) }
  const reset = () => { setP(0); setPhase('set'); onTied({ a, b, la, lb }) }
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svg.current) return
    const r = svg.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 800
    setP(Math.max(0, Math.min(1, drag.current === 1 ? (x - 80) / 320 : (720 - x) / 320)))
  }
  const up = () => { const was = drag.current; drag.current = null; if (was && p >= 0.92) tie() }
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(1, p + 0.1); n >= 0.99 ? tie() : setP(n) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setP(Math.max(0, p - 0.1)) }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tie() }
  }
  const Swatches = ({ v, set, name }: { v: string; set: (c: string) => void; name: string }) => (
    <div role="radiogroup" aria-label={name} className="flex gap-3">
      {PALETTE.map(s => (
        <button key={s.c} role="radio" aria-checked={v === s.c} aria-label={s.n} onClick={() => set(s.c)} style={{ background: s.c }} className={`h-9 w-9 rounded-full transition ${v === s.c ? 'ring-2 ring-pearl ring-offset-4 ring-offset-night' : 'opacity-70 hover:opacity-100'}`} />
      ))}
    </div>
  )
  const input = 'w-full border-b border-pearl/30 bg-transparent py-2 font-serif text-xl outline-none focus:border-ice'

  return (
    <section id="ritual" className="bg-deep px-6 py-32 md:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-4xl font-light md:text-6xl">The thread ritual</h2>
        <p className="mt-4 max-w-xl text-pearl/70">In life, this ritual takes two people. Here, you can try it alone: two threads, two worlds, one knot.</p>
        <dl className="mt-8 grid max-w-3xl gap-6 text-pearl/80 md:grid-cols-2">
          <div><dt className="font-serif text-xl italic text-lav">Two threads</dt><dd className="mt-1">Two distinct personal stories. Each keeps its own color.</dd></div>
          <div><dt className="font-serif text-xl italic text-peach">One knot</dt><dd className="mt-1">A connection made without erasing difference. Neither thread disappears.</dd></div>
        </dl>

        {phase === 'set' && (
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {([[a, setA, la, setLa, 'First thread'], [b, setB, lb, setLb, 'Second thread']] as const).map(([v, sv, lab, sl, nm]) => (
              <div key={nm} className="space-y-6">
                <p className="text-sm text-pearl/60">{nm}: choose a color</p>
                <Swatches v={v} set={sv} name={nm} />
                <label className="block text-sm text-pearl/60">Name this world
                  <input className={input} maxLength={32} value={lab} onChange={e => sl(e.target.value)} />
                </label>
              </div>
            ))}
            <button onClick={() => setPhase('connect')} className="justify-self-start rounded-full border border-lav px-8 py-3 text-lav transition hover:bg-lav hover:text-night md:col-span-2">Take up the threads</button>
          </div>
        )}

        {phase !== 'set' && (
          <div className="mt-10">
            <svg ref={svg} viewBox="0 0 800 400" className="w-full touch-none select-none" onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label="Two threads that can be drawn together into a knot">
              {phase === 'tied' ? <KnotArt a={a} b={b} animate id="gk" /> : (
                <>
                  {[[L, a, 1], [R, b, -1]].map(([r, c, s]) => {
                    const o = r as ReturnType<typeof reach>, side = s as 1 | -1
                    return (
                      <g key={side}>
                        <path d={o.d} stroke={c as string} strokeWidth="3" strokeLinecap="round" fill="none" />
                        <circle cx={o.ex} cy={o.ey} r="22" fill={c as string} opacity=".18" />
                        <circle cx={o.ex} cy={o.ey} r="9" fill={c as string} tabIndex={0} role="slider" aria-label={`${side === 1 ? la : lb} thread end. Arrow keys draw threads together`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} onKeyDown={key} style={{ cursor: 'grab' }}
                          onPointerDown={e => { drag.current = side; (svg.current as SVGSVGElement).setPointerCapture(e.pointerId) }} />
                      </g>
                    )
                  })}
                </>
              )}
              <text x="60" y="320" fill={a} fontFamily="Fraunces, Georgia, serif" fontSize="22" fontStyle="italic">{la}</text>
              <text x="740" y="320" fill={b} fontFamily="Fraunces, Georgia, serif" fontSize="22" fontStyle="italic" textAnchor="end">{lb}</text>
            </svg>
            {phase === 'connect' ? (
              <div className="mt-4 flex flex-wrap items-center gap-6 text-pearl/70">
                <p>Drag the glowing ends together, or focus one and press the arrow keys.</p>
                <button onClick={tie} className="rounded-full border border-ice px-6 py-2 text-ice transition hover:bg-ice hover:text-night">Bring them together</button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1.4 }} className="mt-4">
                <p className="max-w-2xl font-serif text-2xl italic leading-snug md:text-3xl">A connection is not the erasure of difference. It is something new, made together.</p>
                <div className="mt-8 flex gap-6 text-sm">
                  <a href="#keepsake" className="rounded-full border border-lav px-6 py-2 text-lav transition hover:bg-lav hover:text-night">Take your keepsake</a>
                  <button onClick={reset} className="text-pearl/60 underline underline-offset-4 hover:text-pearl">Begin again</button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Celebrate() {
  const acts = [
    ['Reach', 'Meet or approach someone whose story differs from yours.'],
    ['Share', 'Exchange one memory, tradition, or hope.'],
    ['Weave', 'Each of you chooses a thread, and you tie the two together. Keep the knot, trade it, or add it to a shared tapestry.'],
  ]
  return (
    <section className="mx-auto max-w-6xl px-6 py-40 md:px-16">
      <h2 className="font-serif text-4xl font-light md:text-6xl">How we observe it: three acts, every March 21</h2>
      <ol className="mt-16 divide-y divide-pearl/15">
        {acts.map(([t, d], i) => (
          <li key={t} className="grid gap-4 py-10 md:grid-cols-12 md:items-baseline">
            <h3 className="font-serif text-5xl italic md:col-span-4 md:text-7xl" style={{ color: ['#b9a8ff', '#9fd8ff', '#ffc9a8'][i] }}>{t}</h3>
            <p className="max-w-lg text-lg text-pearl/80 md:col-span-8">{d}</p>
          </li>
        ))}
      </ol>
      <div className="mt-24 max-w-3xl">
        <h3 className="font-serif text-2xl text-ice md:text-3xl">Imagine one March 21 on campus</h3>
        <div className="mt-6 space-y-4 font-serif text-xl italic leading-relaxed text-pearl/85">
          <p>A student from the Asia Campus, new to Salt Lake City, sits on the lawn beside a student who has always lived here.</p>
          <p>One shares the sounds of a grandmother’s kitchen. The other shares the canyon their family hikes each spring.</p>
          <p>Each chooses a thread and ties it to the other’s. The knot is hung on the community tapestry, beside the knots of earlier years. Next March 21, the tapestry grows again.</p>
        </div>
      </div>
      <div className="mt-20 grid gap-12 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-pearl/80">It can happen on a campus lawn, along a neighborhood street, across a dinner table, or between strangers who share a bench. No event is needed, only two people and a little curiosity.</p>
        <p className="text-lg leading-relaxed text-pearl/80">On campus, every knot can join one community tapestry linking Asia Campus and Salt Lake City students. It would grow a little each year, so that those who arrive later find the threads of those who came before.</p>
      </div>
    </section>
  )
}

function Keepsake({ k }: { k: { a: string; b: string; la: string; lb: string } }) {
  const ref = useRef<SVGSVGElement>(null)
  const source = () => {
    const s = new XMLSerializer().serializeToString(ref.current as SVGSVGElement)
    return s
  }
  const save = (blob: Blob, name: string) => {
    const u = URL.createObjectURL(blob), el = document.createElement('a')
    el.href = u; el.download = name; el.click(); setTimeout(() => URL.revokeObjectURL(u), 1000)
  }
  const svgDl = () => save(new Blob([source()], { type: 'image/svg+xml' }), 'in-between-day-knot.svg')
  const pngDl = () => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = 1200; c.height = 1600
      c.getContext('2d')!.drawImage(img, 0, 0, 1200, 1600)
      c.toBlob(b => b && save(b, 'in-between-day-knot.png'))
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source())
  }
  const f = 'Fraunces, Georgia, serif'
  return (
    <section id="keepsake" className="mx-auto max-w-6xl px-6 py-32 md:px-16">
      <h2 className="font-serif text-4xl font-light md:text-6xl">Take a piece of the day with you</h2>
      <div className="mt-14 grid items-center gap-12 md:grid-cols-2">
        <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" className="mx-auto w-full max-w-sm" role="img" aria-label={`Keepsake knot joining ${k.la} and ${k.lb}`}>
          <rect width="600" height="800" fill="#101528" />
          <rect x="20" y="20" width="560" height="760" fill="none" stroke="#f3eefb" strokeOpacity=".25" />
          <text x="300" y="90" fill="#f3eefb" fontFamily={f} fontSize="34" fontStyle="italic" textAnchor="middle">The In-Between Day</text>
          <text x="300" y="125" fill="#9fd8ff" fontFamily="sans-serif" fontSize="16" textAnchor="middle" letterSpacing="3">MARCH 21</text>
          <g transform="translate(-100 150) scale(1.25)"><KnotArt a={k.a} b={k.b} id="gs" /></g>
          <text x="60" y="560" fill={k.a} fontFamily={f} fontSize="22" fontStyle="italic">{k.la}</text>
          <text x="540" y="595" fill={k.b} fontFamily={f} fontSize="22" fontStyle="italic" textAnchor="end">{k.lb}</text>
          <text x="300" y="700" fill="#f3eefb" fontFamily={f} fontSize="26" textAnchor="middle">Different stories. Shared belonging.</text>
          <text x="300" y="740" fill="#ffc9a8" fontFamily="sans-serif" fontSize="14" textAnchor="middle">On March 21, make a real connection.</text>
        </svg>
        <div className="space-y-6">
          <p className="font-serif text-2xl italic">On March 21, make a real connection.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={pngDl} className="rounded-full border border-lav px-6 py-2 text-lav transition hover:bg-lav hover:text-night">Download PNG</button>
            <button onClick={svgDl} className="rounded-full border border-ice px-6 py-2 text-ice transition hover:bg-ice hover:text-night">Download SVG</button>
          </div>
          <a href="#ritual" className="inline-block text-pearl/60 underline underline-offset-4 hover:text-pearl">Make another knot</a>
        </div>
      </div>
      <p className="mt-32 text-center text-sm text-pearl/40">The In-Between Day · March 21 · Created for the University of Utah Interconnected Community Scholarship</p>
    </section>
  )
}

export default function App() {
  const [k, setK] = useState({ a: PALETTE[0].c, b: PALETTE[2].c, la: 'A place I come from', lb: 'A world I am discovering' })
  return (
    <main>
      <Hero /><Why /><Equinox /><Ritual onTied={setK} /><Celebrate /><Keepsake k={k} />
    </main>
  )
}
