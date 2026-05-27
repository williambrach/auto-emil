// app.jsx — main app: home → quiz → loading → result → customize → form → done

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────────────────
// Tweak defaults
// ─────────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "animation": "bold"
}/*EDITMODE-END*/;

const MOTION_SCALE = { subtle: 0.55, medium: 0.85, bold: 1.2 };

// ─────────────────────────────────────────────────────────────────────────
// Quiz questions
// ─────────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id:'lifestyle', kind:'single', key:'lifestyle',
    eyebrow:'01 · O tebe',
    title:'Aký je tvoj život práve teraz?',
    subtitle:'Vyber to, čo ťa najlepšie vystihuje.',
    options:[
      { value:'fam', label:'Rodina',           sub:'Deti, sedačky, výlety',          mood:'🏡' },
      { value:'sng', label:'Single & mesto',   sub:'Mobilita, štýl, drive',          mood:'🌆' },
      { value:'act', label:'Aktívny outdoor',  sub:'Hory, bicykle, dobrodružstvo',   mood:'🥾' },
      { value:'urb', label:'Mladí profíci',    sub:'Práca, kariéra, štýl',          mood:'💼' },
    ],
  },
  {
    id:'usage', kind:'multi', key:'usage',
    eyebrow:'02 · Použitie',
    title:'Na čo budeš auto najviac používať?',
    subtitle:'Vyber všetko, čo platí. Aspoň jedno.',
    options:[
      { value:'commute',  label:'Dochádzanie do práce', mood:'🚦' },
      { value:'family',   label:'Rodinné výlety',       mood:'👨‍👩‍👧' },
      { value:'business', label:'Pracovné cesty',       mood:'💼' },
      { value:'offroad',  label:'Off-road & 4×4',       mood:'🪨' },
      { value:'leisure',  label:'Víkendy & voľný čas',  mood:'🌿' },
    ],
  },
  {
    id:'budget', kind:'slider', key:'budget',
    eyebrow:'03 · Peniaze',
    title:'Aký máš rozpočet?',
    subtitle:'Posuň jazdec. Vyhľadávame od najlacnejších.',
    min:14000, max:70000, step:1000, defaultValue:25000,
  },
  {
    id:'road', kind:'single', key:'road',
    eyebrow:'04 · Nálada',
    title:'Ktorá cesta ťa volá?',
    subtitle:'Ber to ako test osobnosti — nie deklaráciu.',
    options:[
      { value:'city',    label:'Mestská promenáda', sub:'Bistra, parkovanie pod kanceláriou', mood:'🌇' },
      { value:'highway', label:'Diaľnica do diaľky', sub:'Tempomat, hudba, podcast',          mood:'🛣️' },
      { value:'mountain',label:'Horská serpentína', sub:'Zatáčky a panoráma',                  mood:'⛰️' },
      { value:'dirt',    label:'Štrk a blato',       sub:'Žiadne značky, len stopy',           mood:'🏕️' },
    ],
  },
  {
    id:'vibe', kind:'single', key:'vibe',
    eyebrow:'05 · Charakter',
    title:'Aký pocit chceš za volantom?',
    subtitle:'Auto je rozšírenie tvojej osobnosti.',
    options:[
      { value:'comfort',  label:'V pokoji ako doma',  sub:'Mäkký podvozok, ticho',         mood:'🛋️' },
      { value:'sport',    label:'S vetrom vo vlasoch',sub:'Drive, zvuk, reakcie',          mood:'🏁' },
      { value:'practical',label:'Praktic, žiadne hlúposti', sub:'Spotreba, priestor, cena',mood:'🛠️' },
      { value:'wow',      label:'Wow efekt',          sub:'Nech sa otáčajú za tebou',     mood:'✨' },
    ],
  },
  {
    id:'fuel', kind:'single', key:'fuel',
    eyebrow:'06 · Pohon',
    title:'Čo by ťa malo pohýnať?',
    subtitle:'Voľba pohonu ovplyvní finálny výber.',
    options:[
      { value:'benzin',  label:'Benzín',     sub:'Klasika, čo nesklame', mood:'⛽' },
      { value:'diesel',  label:'Diesel',     sub:'Dlhé trasy, ťahanie',  mood:'🛢️' },
      { value:'hybrid',  label:'Hybrid',     sub:'To najlepšie z oboch',  mood:'🌿' },
      { value:'elektro', label:'Čistá elektrika', sub:'Ticho, plné krútenie', mood:'⚡' },
      { value:'any',     label:'Je mi to jedno', sub:'Hlavné je auto, nie palivo', mood:'🤷' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Animated scope mark — used on home & loading
// ─────────────────────────────────────────────────────────────────────────
function AnimatedScope({ size = 280, color = '#fff' }) {
  return (
    <div style={{position:'relative', width:size, height:size}}>
      {/* outer rotating ring with brackets */}
      <div style={{position:'absolute', inset:0, animation:'scope-rotate calc(22s * var(--motion)) linear infinite'}}>
        <svg viewBox="0 0 200 200" width={size} height={size}>
          {[
            'M 8 36 V 8 H 36',
            'M 164 8 H 192 V 36',
            'M 192 164 V 192 H 164',
            'M 36 192 H 8 V 164',
          ].map((d,i)=> <path key={i} d={d} stroke={color} strokeWidth="6" fill="none" strokeLinecap="square" />)}
        </svg>
      </div>
      {/* middle pulse ring */}
      <div style={{position:'absolute', inset:'14%', borderRadius:'50%',
        border:`3px solid ${color}`, animation:'scope-pulse calc(3s * var(--motion)) ease-in-out infinite'}} />
      {/* inner solid dot */}
      <div style={{position:'absolute', inset:'30%', borderRadius:'50%', background:color}} />
      {/* center crosshair */}
      <div style={{position:'absolute', inset:'38%', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <svg viewBox="0 0 30 30" width="36%" height="36%">
          <path d="M15 4 V26 M4 15 H26" stroke="var(--coral)" strokeWidth="3.5" strokeLinecap="square" />
        </svg>
      </div>
      {/* scan line */}
      <div style={{position:'absolute', top:'50%', left:0, right:0, height:2,
        background:`linear-gradient(90deg, transparent, ${color}, transparent)`,
        animation:'scope-scan calc(3.5s * var(--motion)) ease-in-out infinite',
        opacity:.6, pointerEvents:'none', transform:'translateY(-50%)'}} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header — always visible, brand + back + progress
// ─────────────────────────────────────────────────────────────────────────
function Header({ onHome, screen, quizStep, totalSteps, onBack, tone = 'light' }) {
  const logoColor = tone === 'light' ? '#fff' : tone === 'coral' ? 'var(--coral)' : 'var(--ink)';
  const fgColor   = tone === 'light' ? '#fff' : tone === 'coral' ? 'var(--ink)' : 'var(--ink)';
  const activeDot = tone === 'coral' ? 'var(--coral)' : (tone === 'light' ? '#fff' : 'var(--ink)');
  const inactiveDot = tone === 'light' ? 'rgba(255,255,255,.3)' : 'rgba(14,14,18,.12)';
  const backBg = tone === 'light' ? 'rgba(255,255,255,.15)' : 'transparent';
  return (
    <div data-screen-label="header" style={{
      position:'absolute', top:0, left:0, right:0, zIndex:10,
      padding:'18px clamp(18px, 4vw, 44px)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      gap:12
    }}>
      <button onClick={onHome} className="btn"
        style={{padding:0, background:'transparent', boxShadow:'none', borderRadius:0}}>
        <Logo color={logoColor} size={26} />
      </button>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        {screen === 'quiz' && (
          <div style={{display:'flex', gap:4}}>
            {Array.from({length: totalSteps}).map((_,i) => (
              <div key={i} style={{
                width: 22, height: 4, borderRadius: 4,
                background: i <= quizStep ? activeDot : inactiveDot,
                opacity: i === quizStep ? 1 : i < quizStep ? 1 : .8,
                transition:'all .3s'
              }}/>
            ))}
          </div>
        )}
        {onBack && (
          <button onClick={onBack} aria-label="Späť"
            style={{appearance:'none', border: tone==='coral' ? '1.5px solid var(--line)' : 0,
              background: backBg, backdropFilter:'blur(8px)',
              color: fgColor, width:40, height:40, borderRadius:999, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Home screen — hero with claim
// ─────────────────────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <div data-screen-label="01 home" style={{
      position:'absolute', inset:0, background:'var(--coral)', color:'#fff',
      overflow:'hidden'
    }}>
      {/* decorative reticle echoes in background */}
      <div style={{position:'absolute', top:'-12%', right:'-15%', opacity:.18, animation:'scope-rotate calc(60s * var(--motion)) linear infinite'}}>
        <Reticle size={520} color="#fff" stroke={2.5}/>
      </div>
      <div style={{position:'absolute', bottom:'-18%', left:'-8%', opacity:.12, animation:'scope-rotate calc(80s * var(--motion)) linear infinite reverse'}}>
        <Reticle size={400} color="#fff" stroke={2}/>
      </div>

      {/* content */}
      <div style={{position:'relative', height:'100%', display:'flex', flexDirection:'column',
        padding:'88px clamp(20px, 5vw, 80px) clamp(28px, 4vh, 56px)',
        maxWidth:1440, margin:'0 auto', boxSizing:'border-box'}}>

        <div className={mounted ? 'anim-slide-up' : ''} style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:'clamp(20px, 3vh, 36px)', minHeight:0}}>
          {/* eyebrow */}
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span style={{display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(0,0,0,.18)', padding:'8px 14px', borderRadius:999,
              fontSize:12, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase'}}>
              <span style={{width:6, height:6, background:'#fff', borderRadius:999,
                animation:'blink 2s ease-in-out infinite'}}/>
              Beta · Emil Frey Slovensko
            </span>
          </div>

          {/* claim */}
          <h1 className="hero" style={{margin:0, color:'#fff', maxWidth:1000}}>
            Nájdi auto,<br/>
            ktoré pasuje<br/>
            k <span style={{
              background:'#fff', color:'var(--coral)',
              padding:'.02em .26em .12em',
              borderRadius:'.16em',
              display:'inline-block', lineHeight:1,
            }}>tvojmu</span><br/>
            životu.
          </h1>

          <p style={{margin:0, fontSize:'clamp(15px, 1.8vw, 19px)', maxWidth:540,
            color:'rgba(255,255,255,.86)', lineHeight:1.45}}>
            Šesť otázok, jedna minúta. Z viac ako 70 modelov<br/>
            Peugeot, Citroën, Opel, Jeep, Fiat, Alfa Romeo, DS, Abarth a Leapmotor
            ti odporučíme to, ktoré ti sadne.
          </p>

          <div style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', marginTop:8}}>
            <button onClick={onStart} className="btn btn-white btn-lg"
              style={{boxShadow:'0 18px 40px rgba(0,0,0,.22)'}}>
              Spustiť dotazník
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div style={{display:'flex', alignItems:'center', gap:10, fontSize:14, color:'rgba(255,255,255,.85)'}}>
              <span style={{
                display:'inline-flex', width:38, height:38, borderRadius:999,
                background:'rgba(255,255,255,.18)', alignItems:'center', justifyContent:'center'
              }}>⏱</span>
              <span><strong style={{color:'#fff'}}>60 sekúnd</strong><br/>· 6 otázok</span>
            </div>
          </div>

          {/* small chips */}
          <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:8}}>
            {['Peugeot 208','Citroën C5','Jeep Avenger','Alfa Tonale','Leapmotor C10','Fiat 500'].map((m) => (
              <span key={m} style={{
                fontSize:13, fontWeight:500, padding:'8px 14px', borderRadius:999,
                background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.25)',
                color:'#fff', backdropFilter:'blur(4px)',
                display:'inline-flex'
              }}>{m}</span>
            ))}
          </div>
        </div>

        {/* footer hint */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
          fontSize:12, color:'rgba(255,255,255,.7)', letterSpacing:'.08em', textTransform:'uppercase'}}>
          <span>autoskop · v0.6</span>
          <span style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{width:18, height:1, background:'rgba(255,255,255,.5)'}}/>
            scroll
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Quiz screen
// ─────────────────────────────────────────────────────────────────────────
function QuizScreen({ question, value, onChange, onNext, onBack, step, total, direction }) {
  const isMulti = question.kind === 'multi';
  const isSlider = question.kind === 'slider';
  const canContinue = isMulti
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== null && value !== '';

  // animate slide-in on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); requestAnimationFrame(() => setMounted(true)); }, [question.id]);

  return (
    <div data-screen-label={`02 quiz ${step+1}`} style={{
      position:'absolute', inset:0, background:'var(--paper)', color:'var(--ink)',
      display:'flex', flexDirection:'column', overflow:'hidden'
    }}>
      {/* decorative reticle echo in coral, subtle */}
      <div style={{position:'absolute', top:'-18%', right:'-12%', opacity:.08, pointerEvents:'none',
        color:'var(--coral)',
        animation:'scope-rotate calc(80s * var(--motion)) linear infinite'}}>
        <Reticle size={460} color="var(--coral)" stroke={2}/>
      </div>

      <div style={{flex:1, overflow:'auto', paddingTop:84, paddingBottom:120,
        position:'relative'
      }} className="no-scrollbar">
        <div style={{maxWidth:880, margin:'0 auto', padding:'0 clamp(20px, 5vw, 56px)'}}>
          <div className="eyebrow"
               style={{color:'var(--coral)', marginBottom:14,
                 opacity: mounted ? 1 : 0, transform: mounted?'translateY(0)':'translateY(8px)',
                 transition:'opacity .4s, transform .4s'}}>
            {question.eyebrow}
          </div>
          <h2 className="h1" style={{margin:'0 0 10px', maxWidth:720, color:'var(--coral)',
            opacity: mounted ? 1 : 0, transform: mounted?'translateY(0)':'translateY(14px)',
            transition:'opacity .5s .05s, transform .5s .05s'}}>
            {question.title}
          </h2>
          <p className="body-l" style={{margin:'0 0 36px', maxWidth:560, color:'var(--muted)',
            opacity: mounted ? 1 : 0, transform: mounted?'translateY(0)':'translateY(14px)',
            transition:'opacity .5s .1s, transform .5s .1s'}}>
            {question.subtitle}
          </p>

          {isSlider ? (
            <SliderQuestion question={question} value={value ?? question.defaultValue} onChange={onChange} />
          ) : (
            <OptionGrid question={question} value={value} onChange={onChange} mounted={mounted} />
          )}
        </div>
      </div>

      {/* footer CTA */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        padding:'16px clamp(20px, 5vw, 56px) max(20px, env(safe-area-inset-bottom))',
        background:'linear-gradient(to top, var(--paper) 65%, rgba(250,247,242,0))',
        display:'flex', justifyContent:'space-between', alignItems:'center', gap:12
      }}>
        <button onClick={onBack} className="btn btn-ghost" style={{padding:'14px 22px'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Späť
        </button>
        <button onClick={onNext}
          className={`btn ${canContinue ? 'btn-coral' : 'btn-ghost'}`}
          disabled={!canContinue}
          style={{padding:'18px 28px', opacity: canContinue ? 1 : .55,
            transform: canContinue ? 'scale(1)' : 'scale(.98)'}}>
          {step === total - 1 ? 'Nájsť moje auto' : 'Pokračovať'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function OptionGrid({ question, value, onChange, mounted }) {
  const isMulti = question.kind === 'multi';
  return (
    <div style={{display:'grid', gap:12,
      gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 280px), 1fr))'}}>
      {question.options.map((opt, i) => {
        const selected = isMulti
          ? Array.isArray(value) && value.includes(opt.value)
          : value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => {
              if (isMulti) {
                const arr = Array.isArray(value) ? [...value] : [];
                const idx = arr.indexOf(opt.value);
                if (idx >= 0) arr.splice(idx, 1); else arr.push(opt.value);
                onChange(arr);
              } else {
                onChange(opt.value);
              }
            }}
            style={{
              appearance:'none', cursor:'pointer', textAlign:'left',
              border: selected ? '2px solid var(--coral)' : '2px solid var(--line)',
              background: selected ? 'var(--coral)' : '#fff',
              color: selected ? '#fff' : 'var(--ink)',
              borderRadius: 22, padding:'20px 22px',
              fontFamily:'inherit', position:'relative',
              transition:'all .3s cubic-bezier(.2,.7,.2,1)',
              transform: mounted ? `translateY(0) scale(${selected?1.02:1})` : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transitionDelay: `${0.12 + i*.05}s`,
              boxShadow: selected
                ? '0 16px 32px rgba(255,71,71,.32)'
                : '0 1px 0 rgba(14,14,18,.03)'
            }}>
            <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14}}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:32, lineHeight:1, marginBottom:14}}>{opt.mood}</div>
                <div style={{fontSize:20, fontWeight:600, lineHeight:1.15, marginBottom:4}}>
                  {opt.label}
                </div>
                {opt.sub && <div style={{fontSize:14, opacity:.75, lineHeight:1.35}}>{opt.sub}</div>}
              </div>
              <div style={{
                width:28, height:28, borderRadius:999, flexShrink:0,
                background: selected ? '#fff' : 'transparent',
                border: selected ? '2px solid #fff' : '2px solid currentColor',
                opacity: selected ? 1 : .25,
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {isMulti
                      ? <path d="M3 7 L6 10 L11 4" stroke="var(--coral)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                      : <circle cx="7" cy="7" r="3" fill="var(--coral)" />}
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SliderQuestion({ question, value, onChange }) {
  const v = value ?? question.defaultValue;
  const pct = (v - question.min) / (question.max - question.min);
  return (
    <div style={{padding:'20px 0'}}>
      <div className="display"
        style={{fontSize:'clamp(56px, 12vw, 110px)', fontWeight:800,
          letterSpacing:'-.04em', color:'var(--coral)', marginBottom:4,
          fontFeatureSettings:'"tnum"'}}>
        {formatEUR(v)}
      </div>
      <div style={{fontSize:15, color:'var(--muted)', marginBottom:34}}>
        Hľadáme autá od {formatEUR(question.min)} do {formatEUR(question.max)}.
      </div>

      <div style={{position:'relative', height:56,
        display:'flex', alignItems:'center'}}>
        {/* track */}
        <div style={{
          position:'absolute', left:0, right:0, height:8, borderRadius:999,
          background:'var(--line)'
        }}/>
        {/* filled */}
        <div style={{
          position:'absolute', left:0, height:8, borderRadius:999,
          width:`${pct*100}%`, background:'var(--coral)',
          transition:'width .2s'
        }}/>
        {/* thumb */}
        <div style={{
          position:'absolute', left:`calc(${pct*100}% - 18px)`, width:36, height:36,
          background:'var(--ink)', borderRadius:999, top:'50%', transform:'translateY(-50%)',
          boxShadow:'0 8px 20px rgba(14,14,18,.25)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', pointerEvents:'none',
          transition:'left .2s'
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3 L2 7 L5 11 M9 3 L12 7 L9 11" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input type="range"
          min={question.min} max={question.max} step={question.step}
          value={v}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{position:'absolute', inset:0, opacity:0, width:'100%', height:'100%', cursor:'pointer'}}
          aria-label="Rozpočet"/>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', fontSize:12,
        color:'var(--muted)', marginTop:10, letterSpacing:'.04em'}}>
        <span>{formatEUR(question.min)}</span>
        <span>{formatEUR(question.max)}+</span>
      </div>

      {/* quick presets */}
      <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:24}}>
        {[18000, 25000, 35000, 50000, 65000].map(p => (
          <button key={p} onClick={() => onChange(p)}
            className="pill"
            style={{cursor:'pointer',
              background: v === p ? 'var(--coral)' : '#fff',
              color: v === p ? '#fff' : 'var(--ink)',
              borderColor: v === p ? 'var(--coral)' : 'var(--line)',
            }}>
            {formatEUR(p)}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatEUR(n) {
  return `€${Math.round(n).toLocaleString('sk-SK').replace(/,/g,' ')}`;
}

// ─────────────────────────────────────────────────────────────────────────
// Loading / analyzing screen
// ─────────────────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const [pct, setPct] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const steps = [
    'Analyzujeme tvoj profil…',
    'Filtrujeme vyše 70 modelov…',
    'Zohľadňujeme tvoj rozpočet…',
    'Vyberáme finalistov…',
    'Hotovo!',
  ];
  useEffect(() => {
    const total = 2600;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const e = (t - start) / total;
      const p = Math.min(1, e);
      setPct(p);
      setStepIdx(Math.min(steps.length - 1, Math.floor(p * steps.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 380);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div data-screen-label="03 loading" style={{
      position:'absolute', inset:0, background:'var(--coral)', color:'#fff',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'40px 20px', gap:32
    }}>
      <AnimatedScope size={Math.min(280, window.innerWidth * .55)} />
      <div style={{textAlign:'center', maxWidth:480}}>
        <div className="display" style={{fontSize:'clamp(52px, 10vw, 92px)', fontWeight:800,
          fontFeatureSettings:'"tnum"', letterSpacing:'-.03em'}}>
          {Math.round(pct * 100)}<span style={{fontSize:'.5em', verticalAlign:'super', marginLeft:4}}>%</span>
        </div>
        <div style={{fontSize:18, fontWeight:500, marginTop:8, minHeight:'1.4em'}}>
          {steps[stepIdx]}
        </div>
      </div>
      <div style={{width:'min(440px, 86vw)', height:4, background:'rgba(255,255,255,.25)',
        borderRadius:999, overflow:'hidden'}}>
        <div style={{height:'100%', width:`${pct*100}%`, background:'#fff',
          borderRadius:999, transition:'width .12s linear'}}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Result screen — hero match + 2 alternatives
// ─────────────────────────────────────────────────────────────────────────
function ResultScreen({ matches, onCustomize, onSelectAlt, onRetake }) {
  const hero = matches[0].car;
  const alts = matches.slice(1, 3).map(m => m.car);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  return (
    <div data-screen-label="04 result" style={{
      position:'absolute', inset:0, background:'var(--paper)',
      overflow:'auto'
    }}>
      <div style={{paddingTop:84, paddingBottom:48, maxWidth:1280, margin:'0 auto',
        padding:'84px clamp(20px, 5vw, 60px) 48px'}}>

        {/* eyebrow */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14,
          opacity: mounted ? 1 : 0, transition:'opacity .5s'}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'var(--coral)', color:'#fff', padding:'8px 14px',
            borderRadius:999, fontSize:11, fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase'
          }}>
            <Reticle size={14} color="#fff" stroke={2}/>
            Tvoj match
          </div>
          <span style={{fontSize:13, color:'var(--muted)'}}>na základe tvojich odpovedí</span>
        </div>

        <h2 className="hero" style={{
          margin:'0 0 28px', fontSize:'clamp(40px, 8vw, 96px)',
          opacity: mounted ? 1 : 0, transform: mounted?'translateY(0)':'translateY(20px)',
          transition:'opacity .6s, transform .6s'
        }}>
          {hero.brand} <span style={{color:'var(--coral)'}}>{hero.model}</span>
        </h2>

        {/* hero card */}
        <HeroResultCard car={hero} onCustomize={onCustomize} mounted={mounted} matchPct={Math.round(96 - Math.random()*4)}/>

        {/* alternatives */}
        <div style={{marginTop:48, marginBottom:20, display:'flex',
          alignItems:'baseline', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
          <h3 className="h2" style={{margin:0}}>Alebo skús tieto.</h3>
          <button onClick={onRetake} className="btn btn-ghost" style={{padding:'12px 20px'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12 a9 9 0 0 1 9-9 m0 0 l-3 3 m3-3 l3 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Zopakovať dotazník
          </button>
        </div>
        <div style={{display:'grid', gap:16,
          gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 360px), 1fr))'}}>
          {alts.map((c, i) => (
            <AltCard key={c.id} car={c} onClick={() => onSelectAlt(c.id)} delay={i*.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroResultCard({ car, onCustomize, mounted, matchPct }) {
  return (
    <div className="card" style={{
      borderRadius:36, overflow:'hidden',
      boxShadow:'var(--shadow-lg)',
      display:'grid', gridTemplateColumns:'minmax(0,1.2fr) minmax(0,1fr)',
      minHeight:380,
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)',
      transition:'opacity .7s .1s, transform .7s .1s'
    }} className="card-grid-collapse">

      {/* left: car visual on coral */}
      <div style={{
        background:'var(--coral)', position:'relative', overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'clamp(24px, 4vw, 44px)', minHeight:280
      }}>
        {/* big reticle behind */}
        <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
          opacity:.18, animation:'scope-rotate calc(40s * var(--motion)) linear infinite'}}>
          <Reticle size={'min(60%, 360px)'} color="#fff" stroke={2.5}/>
        </div>
        {/* badge top-left */}
        <div style={{position:'absolute', top:24, left:24, display:'flex', gap:8}}>
          <span style={{
            background:'#fff', color:'var(--coral)', padding:'8px 14px', borderRadius:999,
            fontSize:12, fontWeight:700, letterSpacing:'.06em'}}>
            {car.badge}
          </span>
        </div>
        {/* match score */}
        <div style={{position:'absolute', top:24, right:24,
          display:'flex', alignItems:'center', gap:8, color:'#fff'}}>
          <div style={{fontSize:11, opacity:.85, letterSpacing:'.12em', textTransform:'uppercase'}}>Match</div>
          <div style={{fontSize:24, fontWeight:800, fontFeatureSettings:'"tnum"'}}>{matchPct}%</div>
        </div>
        {/* car */}
        <div className="anim-drive-in" style={{width:'100%', maxWidth:520}}>
          <CarIllustration shape={car.shape} color={car.color} accent={car.accent}
                           wheel={car.wheel} size={520}
                           style={{width:'100%', height:'auto', filter:'drop-shadow(0 14px 30px rgba(0,0,0,.25))'}}/>
        </div>
      </div>

      {/* right: details */}
      <div style={{padding:'clamp(28px, 4vw, 44px)', display:'flex', flexDirection:'column', gap:18}}>
        <div>
          <div className="eyebrow" style={{color:'var(--coral)'}}>{car.brand}</div>
          <div className="h2" style={{margin:'6px 0 4px'}}>{car.model}</div>
          <div className="body" style={{color:'var(--ink-2)', fontSize:16}}>{car.tagline}</div>
        </div>

        <div style={{
          padding:'18px 20px', background:'var(--coral-soft)', borderRadius:18,
          fontSize:15, lineHeight:1.5, color:'var(--ink)'}}>
          <div style={{fontSize:11, fontWeight:600, color:'var(--coral)',
            letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6}}>
            Prečo práve toto auto
          </div>
          {car.why}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          {Object.entries(car.spec).slice(0, 4).map(([k, v]) => (
            <div key={k} style={{padding:'10px 12px', background:'#FAF7F2', borderRadius:12}}>
              <div style={{fontSize:11, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>{k}</div>
              <div style={{fontSize:15, fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
          {car.fuels.map(f => <span key={f} className="pill">{f}</span>)}
        </div>

        <div style={{
          display:'flex', alignItems:'baseline', gap:10, marginTop:'auto',
          paddingTop:8, borderTop:'1px solid var(--line)'
        }}>
          <div>
            <div style={{fontSize:11, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>Cena od</div>
            <div style={{fontSize:28, fontWeight:800, letterSpacing:'-.02em'}}>{formatEUR(car.priceFrom)}</div>
          </div>
          <div style={{marginLeft:'auto', textAlign:'right'}}>
            <div style={{fontSize:11, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>Mesačne od</div>
            <div style={{fontSize:18, fontWeight:600}}>{formatEUR(car.monthly)}<span style={{fontSize:12, color:'var(--muted)', fontWeight:500}}>/mes</span></div>
          </div>
        </div>

        <button onClick={onCustomize} className="btn btn-coral btn-lg" style={{width:'100%', marginTop:4}}>
          Prispôsobiť & rezervovať skúšobnú jazdu
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function AltCard({ car, onClick, delay = 0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay*1000 + 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <button onClick={onClick} className="card"
      style={{
        appearance:'none', border:0, textAlign:'left', cursor:'pointer',
        padding:0, overflow:'hidden', borderRadius:24,
        background:'#fff', color:'inherit', fontFamily:'inherit',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition:'opacity .6s, transform .6s, box-shadow .25s',
        boxShadow:'var(--shadow-sm)'
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow-sm)'}
    >
      <div style={{background:'#FAF7F2', padding:20, position:'relative', minHeight:180,
        display:'flex', alignItems:'center', justifyContent:'center'}}>
        <CarIllustration shape={car.shape} color={car.color} accent={car.accent}
                         wheel={car.wheel} size={360}
                         style={{width:'100%', maxWidth:360, height:'auto'}}/>
        <span style={{
          position:'absolute', top:14, left:14, fontSize:11, fontWeight:700,
          color:'var(--coral)', background:'#fff', padding:'5px 10px', borderRadius:999, letterSpacing:'.06em'
        }}>{car.badge}</span>
      </div>
      <div style={{padding:'20px 22px'}}>
        <div className="eyebrow" style={{color:'var(--muted)'}}>{car.brand}</div>
        <div style={{fontSize:24, fontWeight:700, letterSpacing:'-.01em', marginTop:4}}>{car.model}</div>
        <div className="body" style={{fontSize:14, margin:'4px 0 14px'}}>{car.tagline}</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span style={{fontSize:18, fontWeight:700}}>{formatEUR(car.priceFrom)}</span>
          <span style={{fontSize:13, color:'var(--coral)', fontWeight:600,
            display:'inline-flex', alignItems:'center', gap:4}}>
            Vybrať
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Customize screen — pick exterior color & wheels
// ─────────────────────────────────────────────────────────────────────────
function CustomizeScreen({ car, customization, onChange, onContinue }) {
  const [tab, setTab] = useState('color');
  const color = customization.paint?.color || car.color;
  const wheel = customization.wheel || car.wheel;
  return (
    <div data-screen-label="05 customize" style={{
      position:'absolute', inset:0, background:'var(--paper)',
      display:'flex', flexDirection:'column'
    }}>
      {/* hero */}
      <div style={{
        background:'var(--coral)', color:'#fff',
        padding:'88px clamp(20px, 5vw, 60px) 28px',
        position:'relative', overflow:'hidden'
      }}>
        <div style={{position:'absolute', top:'-20%', right:'-10%', opacity:.16,
          animation:'scope-rotate calc(60s * var(--motion)) linear infinite'}}>
          <Reticle size={420} color="#fff" stroke={2}/>
        </div>
        <div style={{maxWidth:1280, margin:'0 auto', position:'relative'}}>
          <div className="eyebrow" style={{color:'rgba(255,255,255,.85)', marginBottom:8}}>Prispôsob si auto</div>
          <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:14, flexWrap:'wrap'}}>
            <div>
              <h2 className="h1" style={{margin:0, color:'#fff'}}>
                {car.brand} <em style={{fontStyle:'normal', opacity:.85}}>{car.model}</em>
              </h2>
              <div style={{fontSize:15, color:'rgba(255,255,255,.85)', marginTop:6, maxWidth:480}}>
                {car.tagline}
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11, opacity:.8, letterSpacing:'.08em', textTransform:'uppercase'}}>Tvoja konfigurácia od</div>
              <div style={{fontSize:36, fontWeight:800, letterSpacing:'-.02em'}}>{formatEUR(car.priceFrom + (customization.paint?.upcharge || 0))}</div>
            </div>
          </div>

          {/* car preview */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'18px 0 0', position:'relative'
          }}>
            <div key={`${color}-${wheel}`} className="anim-pop">
              <CarIllustration shape={car.shape} color={color}
                accent={car.accent} wheel={wheel} size={620}
                style={{maxWidth:'100%', width:'min(620px, 90vw)', height:'auto',
                  filter:'drop-shadow(0 24px 40px rgba(0,0,0,.30))'}}/>
            </div>
          </div>
        </div>
      </div>

      {/* tabs + options */}
      <div style={{flex:1, overflow:'auto', background:'var(--paper)'}} className="no-scrollbar">
        <div style={{maxWidth:1280, margin:'0 auto', padding:'24px clamp(20px, 5vw, 60px) 120px'}}>
          <div role="tablist" style={{display:'flex', gap:6, background:'#fff',
            padding:6, borderRadius:999, border:'1px solid var(--line)',
            width:'fit-content', marginBottom:24}}>
            {[
              { id:'color', label:'Farba' },
              { id:'wheel', label:'Disky' },
              { id:'summary', label:'Súhrn' },
            ].map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  appearance:'none', border:0, cursor:'pointer', fontFamily:'inherit',
                  padding:'10px 22px', borderRadius:999, fontWeight:600, fontSize:14,
                  background: tab === t.id ? 'var(--ink)' : 'transparent',
                  color: tab === t.id ? '#fff' : 'var(--ink)',
                  transition:'all .25s'
                }}>{t.label}</button>
            ))}
          </div>

          {tab === 'color' && (
            <ColorPicker car={car} value={customization.paint} onChange={(p) => onChange({ ...customization, paint: p })}/>
          )}
          {tab === 'wheel' && (
            <WheelPicker car={car} value={wheel} onChange={(w) => onChange({ ...customization, wheel: w })}/>
          )}
          {tab === 'summary' && (
            <Summary car={car} customization={customization} />
          )}
        </div>
      </div>

      {/* footer CTA */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        padding:'16px clamp(20px, 5vw, 60px) max(20px, env(safe-area-inset-bottom))',
        background:'rgba(250,247,242,.94)', backdropFilter:'blur(12px)',
        borderTop:'1px solid var(--line)',
        display:'flex', justifyContent:'space-between', alignItems:'center', gap:12
      }}>
        <div>
          <div style={{fontSize:11, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>Súčet</div>
          <div style={{fontSize:22, fontWeight:800, letterSpacing:'-.02em'}}>
            {formatEUR(car.priceFrom + (customization.paint?.upcharge || 0))}
          </div>
        </div>
        <button onClick={onContinue} className="btn btn-coral btn-lg">
          Rezervovať skúšobnú jazdu
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function ColorPicker({ car, value, onChange }) {
  const finishes = [
    { id:'solid',    label:'Solid',    upcharge:0 },
    { id:'metallic', label:'Metallic', upcharge:650 },
    { id:'pearl',    label:'Pearl',    upcharge:1190 },
  ];
  const finish = value?.finish || 'solid';
  const selectedColor = value?.color || car.color;
  const selectedId = value?.id || car.color;

  return (
    <div>
      <h3 className="h3" style={{margin:'0 0 14px'}}>Vyber farbu karosérie</h3>
      <div style={{display:'flex', flexWrap:'wrap', gap:14, marginBottom:28}}>
        {PAINT_OPTIONS.map(p => {
          const isSel = (value?.id || car.color) === p.id;
          return (
            <button key={p.id}
              onClick={() => onChange({
                id: p.id, color: p.color, label: p.label,
                finish, upcharge: finishes.find(f=>f.id===finish).upcharge
              })}
              style={{
                appearance:'none', cursor:'pointer', border:0, padding:0, fontFamily:'inherit',
                background:'transparent', textAlign:'center'
              }}>
              <div style={{
                width:64, height:64, borderRadius:999,
                background:`radial-gradient(circle at 30% 30%, ${lightenJs(p.color, .25)}, ${p.color} 60%, ${darkenJs(p.color, .15)})`,
                border: isSel ? '3px solid var(--ink)' : '3px solid transparent',
                boxShadow: isSel ? '0 0 0 3px #fff inset, 0 10px 24px rgba(0,0,0,.18)' : '0 4px 14px rgba(0,0,0,.10)',
                transition:'all .25s',
                transform: isSel ? 'scale(1.06)' : 'scale(1)'
              }}/>
              <div style={{fontSize:12, marginTop:8, fontWeight: isSel ? 600 : 500,
                color: isSel ? 'var(--ink)' : 'var(--muted)'}}>{p.label}</div>
            </button>
          );
        })}
      </div>

      <h3 className="h3" style={{margin:'0 0 14px'}}>Lak</h3>
      <div style={{display:'flex', flexWrap:'wrap', gap:10}}>
        {finishes.map(f => {
          const sel = finish === f.id;
          return (
            <button key={f.id}
              onClick={() => {
                const cur = value || { id: car.color, color: car.color, label: 'Default' };
                onChange({ ...cur, finish: f.id, upcharge: f.upcharge });
              }}
              style={{
                appearance:'none', cursor:'pointer', fontFamily:'inherit',
                padding:'14px 22px', borderRadius:999,
                background: sel ? 'var(--ink)' : '#fff',
                color: sel ? '#fff' : 'var(--ink)',
                border: sel ? '2px solid var(--ink)' : '2px solid var(--line)',
                fontWeight:600, fontSize:15,
                display:'inline-flex', gap:10, alignItems:'center',
                transition:'all .25s'
              }}>
              {f.label}
              {f.upcharge > 0 && <span style={{opacity:.6, fontWeight:500, fontSize:13}}>+{formatEUR(f.upcharge)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WheelPicker({ car, value, onChange }) {
  return (
    <div>
      <h3 className="h3" style={{margin:'0 0 14px'}}>Vyber štýl diskov</h3>
      <div style={{display:'grid', gap:14,
        gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 220px), 1fr))'}}>
        {WHEEL_OPTIONS.map(w => {
          const sel = value === w.id;
          return (
            <button key={w.id} onClick={() => onChange(w.id)}
              style={{
                appearance:'none', cursor:'pointer', fontFamily:'inherit', textAlign:'left',
                padding:20, borderRadius:22,
                background: sel ? 'var(--ink)' : '#fff',
                color: sel ? '#fff' : 'var(--ink)',
                border: sel ? '2px solid var(--ink)' : '2px solid var(--line)',
                transition:'all .25s',
                boxShadow: sel ? '0 16px 32px rgba(0,0,0,.18)' : 'none'
              }}>
              <div style={{
                background: sel ? 'rgba(255,255,255,.08)' : 'var(--paper)',
                borderRadius:14, padding:14, marginBottom:12,
                display:'flex', justifyContent:'center'
              }}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <Wheel cx={50} cy={50} r={42} style={w.id}
                         tireColor={sel ? '#0E0E12' : '#0E0E12'}
                         rimColor={sel ? '#F0EEE6' : '#E0DDD6'} />
                </svg>
              </div>
              <div style={{fontWeight:600, fontSize:17}}>{w.label}</div>
              <div style={{fontSize:13, opacity:.7, marginTop:2}}>{w.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Summary({ car, customization }) {
  const total = car.priceFrom + (customization.paint?.upcharge || 0);
  return (
    <div>
      <h3 className="h3" style={{margin:'0 0 14px'}}>Súhrn konfigurácie</h3>
      <div className="card" style={{padding:24}}>
        <Row k="Model" v={`${car.brand} ${car.model}`} />
        <Row k="Karoséria" v={car.spec.Body || '—'} />
        <Row k="Farba" v={customization.paint?.label || 'Štandard'} />
        <Row k="Lak" v={(customization.paint?.finish || 'solid').charAt(0).toUpperCase()+ (customization.paint?.finish || 'solid').slice(1)} />
        <Row k="Disky" v={WHEEL_OPTIONS.find(w => w.id === (customization.wheel || car.wheel)).label} />
        <Row k="Cena od" v={formatEUR(car.priceFrom)} />
        {customization.paint?.upcharge > 0 && <Row k="Príplatok za lak" v={`+${formatEUR(customization.paint.upcharge)}`}/>}
        <div style={{borderTop:'2px solid var(--ink)', marginTop:14, paddingTop:14,
          display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span style={{fontWeight:700, fontSize:18}}>Spolu</span>
          <span style={{fontSize:30, fontWeight:800, letterSpacing:'-.02em'}}>{formatEUR(total)}</span>
        </div>
      </div>
    </div>
  );
}
function Row({k, v}){
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline',
      padding:'10px 0', borderBottom:'1px solid var(--line)'}}>
      <span style={{color:'var(--muted)'}}>{k}</span>
      <span style={{fontWeight:600}}>{v}</span>
    </div>
  );
}

function lightenJs(hex, p){ return mixHex(hex, '#ffffff', p) }
function darkenJs(hex, p){ return mixHex(hex, '#000000', p) }
function mixHex(hex, target, p){
  const h = hex.replace('#','');
  const a = { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
  const t = target.replace('#','');
  const b = { r: parseInt(t.slice(0,2),16), g: parseInt(t.slice(2,4),16), b: parseInt(t.slice(4,6),16) };
  const m = (x,y) => Math.round(x + (y-x)*p);
  return `rgb(${m(a.r,b.r)},${m(a.g,b.g)},${m(a.b,b.b)})`;
}

// ─────────────────────────────────────────────────────────────────────────
// Test drive reservation form
// ─────────────────────────────────────────────────────────────────────────
function FormScreen({ car, customization, onSubmit }) {
  const [data, setData] = useState({ name:'', email:'', phone:'', slot:'' });
  const [touched, setTouched] = useState({});
  const errors = {
    name:  !data.name ? 'Vyplň meno' : '',
    email: !/^\S+@\S+\.\S+$/.test(data.email) ? 'Zadaj platný email' : '',
    phone: !/^[+0-9\s]{8,}$/.test(data.phone) ? 'Zadaj platné číslo' : '',
    slot:  !data.slot ? 'Vyber čas' : '',
  };
  const valid = Object.values(errors).every(e => !e);
  const slots = [
    'Zajtra dopoludnia', 'Zajtra popoludní',
    'Pozajtra dopoludnia', 'Pozajtra popoludní',
    'Tento víkend', 'Budúci týždeň',
  ];

  return (
    <div data-screen-label="06 form" style={{
      position:'absolute', inset:0, background:'var(--paper)',
      display:'flex', flexDirection:'column'
    }}>
      <div style={{flex:1, overflow:'auto', paddingBottom:140}} className="no-scrollbar">
        {/* coral hero band */}
        <div style={{
          background:'var(--coral)', color:'#fff',
          padding:'88px clamp(20px, 5vw, 56px) 36px',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{position:'absolute', top:'-22%', right:'-12%', opacity:.14,
            animation:'scope-rotate calc(80s * var(--motion)) linear infinite'}}>
            <Reticle size={420} color="#fff" stroke={2}/>
          </div>
          <div style={{maxWidth:880, margin:'0 auto', position:'relative'}}>
            <div className="eyebrow" style={{color:'rgba(255,255,255,.85)', marginBottom:14}}>Posledný krok</div>
            <h2 className="h1" style={{margin:'0 0 10px', color:'#fff'}}>Vyskúšaj svoje auto.</h2>
            <p className="body-l" style={{margin:0, maxWidth:520, color:'rgba(255,255,255,.85)'}}>
              Zarezervuj si nezáväznú skúšobnú jazdu. Ozveme sa ti do hodiny.
            </p>
          </div>
        </div>

        <div style={{maxWidth:880, margin:'0 auto', padding:'28px clamp(20px, 5vw, 56px) 0'}}>
          {/* car summary */}
          <div className="card" style={{
            display:'grid', gridTemplateColumns:'minmax(0,1fr) 130px', gap:14,
            padding:'16px 18px', alignItems:'center', marginBottom:24,
            border:'1.5px solid var(--coral)', background:'#fff'
          }}>
            <div>
              <div className="eyebrow" style={{color:'var(--coral)'}}>{car.brand}</div>
              <div style={{fontSize:20, fontWeight:700}}>{car.model}</div>
              <div style={{fontSize:13, color:'var(--muted)'}}>
                {customization.paint?.label || 'Štandard'} · {WHEEL_OPTIONS.find(w => w.id === (customization.wheel || car.wheel)).label} · od {formatEUR(car.priceFrom + (customization.paint?.upcharge || 0))}
              </div>
            </div>
            <div style={{background:'var(--coral-soft)', borderRadius:14, padding:6,
              display:'flex', alignItems:'center', justifyContent:'center', height:90}}>
              <CarIllustration shape={car.shape}
                color={customization.paint?.color || car.color}
                accent={car.accent}
                wheel={customization.wheel || car.wheel}
                size={150}
                style={{width:'100%', height:'auto'}}/>
            </div>
          </div>

          <div style={{display:'grid', gap:14}}>
            <Field label="Meno a priezvisko" placeholder="Andrej Vodička"
              value={data.name} onChange={v => setData({...data, name:v})}
              error={touched.name && errors.name}
              onBlur={() => setTouched({...touched, name:true})}/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}
              className="form-row">
              <Field label="Email" placeholder="andrej@gmail.com" type="email"
                value={data.email} onChange={v => setData({...data, email:v})}
                error={touched.email && errors.email}
                onBlur={() => setTouched({...touched, email:true})}/>
              <Field label="Telefón" placeholder="+421 9XX XXX XXX" type="tel"
                value={data.phone} onChange={v => setData({...data, phone:v})}
                error={touched.phone && errors.phone}
                onBlur={() => setTouched({...touched, phone:true})}/>
            </div>

            <div>
              <label style={{fontSize:13, color:'var(--muted)', fontWeight:500, marginBottom:8, display:'block'}}>
                Kedy ťa očakávame?
              </label>
              <div style={{display:'grid',
                gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap:8}}>
                {slots.map(s => {
                  const sel = data.slot === s;
                  return (
                    <button key={s} onClick={() => setData({...data, slot:s})}
                      style={{
                        appearance:'none', cursor:'pointer', fontFamily:'inherit',
                        padding:'14px 16px', borderRadius:14,
                        background: sel ? 'var(--ink)' : '#fff',
                        color: sel ? '#fff' : 'var(--ink)',
                        border: sel ? '2px solid var(--ink)' : '2px solid var(--line)',
                        fontWeight:600, fontSize:14,
                        textAlign:'left', transition:'all .2s'
                      }}>{s}</button>
                  );
                })}
              </div>
              {touched.slot && errors.slot && (
                <div style={{fontSize:12, color:'var(--coral)', marginTop:6}}>{errors.slot}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        padding:'16px clamp(20px, 5vw, 56px) max(20px, env(safe-area-inset-bottom))',
        background:'rgba(250,247,242,.94)', backdropFilter:'blur(12px)',
        borderTop:'1px solid var(--line)',
        display:'flex', justifyContent:'space-between', alignItems:'center', gap:12
      }}>
        <div style={{fontSize:12, color:'var(--muted)', maxWidth:280}}>
          Odoslaním súhlasíš so spracovaním údajov pre účely rezervácie.
        </div>
        <button onClick={() => {
          setTouched({ name:true, email:true, phone:true, slot:true });
          if (valid) onSubmit(data);
        }}
          className={`btn ${valid ? 'btn-coral' : 'btn-ghost'} btn-lg`}
          style={{opacity: valid ? 1 : .6}}>
          Odoslať rezerváciu
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12 L10 18 L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function Field({ label, error, value, onChange, onBlur, ...rest }) {
  return (
    <div>
      <label style={{fontSize:13, color:'var(--muted)', fontWeight:500, marginBottom:6, display:'block'}}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        style={{
          width:'100%', padding:'16px 18px', borderRadius:14,
          border: error ? '2px solid var(--coral)' : '2px solid var(--line)',
          background:'#fff', fontSize:16, fontFamily:'inherit', color:'var(--ink)',
          outline:'none', transition:'border-color .2s',
          boxSizing:'border-box'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--ink)'}
        {...rest}
      />
      {error && <div style={{fontSize:12, color:'var(--coral)', marginTop:6}}>{error}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Confirmation
// ─────────────────────────────────────────────────────────────────────────
function DoneScreen({ car, customization, formData, onHome }) {
  return (
    <div data-screen-label="07 confirmation" style={{
      position:'absolute', inset:0, background:'var(--coral)', color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center', overflow:'auto'
    }}>
      <div style={{position:'absolute', top:'-12%', left:'-10%', opacity:.16,
        animation:'scope-rotate calc(80s * var(--motion)) linear infinite'}}>
        <Reticle size={520} color="#fff" stroke={2}/>
      </div>
      <div style={{position:'absolute', bottom:'-18%', right:'-12%', opacity:.12,
        animation:'scope-rotate calc(100s * var(--motion)) linear infinite reverse'}}>
        <Reticle size={420} color="#fff" stroke={2}/>
      </div>

      <div style={{maxWidth:680, padding:'80px clamp(20px, 5vw, 40px)',
        position:'relative', textAlign:'center'}}>
        <div className="anim-pop" style={{
          width:88, height:88, borderRadius:999, background:'#fff', color:'var(--coral)',
          margin:'0 auto 24px', display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
            <path d="M5 13 L10 18 L20 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="hero anim-slide-up" style={{fontSize:'clamp(36px, 7vw, 72px)', margin:'0 0 14px'}}>
          Ďakujeme,<br/>{formData.name.split(' ')[0] || 'priateľ'}!
        </h2>
        <p style={{fontSize:18, lineHeight:1.5, opacity:.92, margin:'0 auto 28px', maxWidth:480}}>
          Tvoja rezervácia na skúšobnú jazdu <strong>{car.brand} {car.model}</strong> bola odoslaná.
          Ozveme sa ti do hodiny na <strong>{formData.phone}</strong>.
        </p>

        <div style={{background:'rgba(255,255,255,.16)', backdropFilter:'blur(6px)',
          borderRadius:22, padding:20, marginBottom:26, textAlign:'left',
          border:'1px solid rgba(255,255,255,.24)'}}>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <CarIllustration shape={car.shape}
              color={customization.paint?.color || car.color}
              accent={car.accent}
              wheel={customization.wheel || car.wheel}
              size={120}
              style={{flexShrink:0}}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85}}>Skúšobná jazda</div>
              <div style={{fontSize:20, fontWeight:700}}>{car.brand} {car.model}</div>
              <div style={{fontSize:13, opacity:.85}}>{formData.slot} · Emil Frey, Bratislava</div>
            </div>
          </div>
        </div>

        <button onClick={onHome} className="btn btn-white btn-lg">
          Späť na začiatok
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12 L12 4 L21 12 M5 11 V20 H19 V11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{fontSize:12, opacity:.7, marginTop:24, letterSpacing:'.06em'}}>
          Číslo rezervácie · #AS-{Math.floor(100000 + Math.random()*900000)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Root App with screen state machine
// ─────────────────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('home');
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matches, setMatches] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [customization, setCustomization] = useState({});
  const [formData, setFormData] = useState(null);

  const motion = MOTION_SCALE[tweaks.animation] || 1;
  useEffect(() => {
    document.documentElement.style.setProperty('--motion', String(motion));
  }, [motion]);

  // ── Navigation helpers
  const startQuiz = () => { setQuizStep(0); setAnswers({}); setScreen('quiz'); };
  const home = () => { setScreen('home'); setQuizStep(0); };
  const advanceQuiz = () => {
    if (quizStep < QUESTIONS.length - 1) setQuizStep(quizStep + 1);
    else {
      // compute matches and go to loading
      const ms = findMatches(answers);
      setMatches(ms);
      setSelectedCar(ms[0].car);
      setScreen('loading');
    }
  };
  const backInQuiz = () => {
    if (quizStep > 0) setQuizStep(quizStep - 1);
    else setScreen('home');
  };
  const headerBack = () => {
    if (screen === 'quiz') backInQuiz();
    else if (screen === 'result') { setScreen('quiz'); setQuizStep(QUESTIONS.length - 1); }
    else if (screen === 'customize') setScreen('result');
    else if (screen === 'form') setScreen('customize');
    else home();
  };

  const onLoadingDone = () => setScreen('result');
  const onResultCustomize = () => { setCustomization({}); setScreen('customize'); };
  const onResultSelectAlt = (id) => {
    const c = CARS.find(x => x.id === id);
    setSelectedCar(c);
    setCustomization({});
    setScreen('customize');
  };
  const onCustomizeContinue = () => setScreen('form');
  const onFormSubmit = (d) => { setFormData(d); setScreen('done'); };

  const headerTone = ['home', 'loading', 'done', 'form'].includes(screen) ? 'light' : 'coral';
  const showBack = ['quiz', 'result', 'customize', 'form'].includes(screen);

  return (
    <div style={{position:'fixed', inset:0, overflow:'hidden', isolation:'isolate'}}>
      <Header onHome={home} screen={screen} quizStep={quizStep}
        totalSteps={QUESTIONS.length}
        onBack={showBack ? headerBack : null}
        tone={headerTone}/>

      {/* Screen transitions */}
      <ScreenSwitch screen={screen}>
        {screen === 'home' && <HomeScreen onStart={startQuiz}/>}
        {screen === 'quiz' && (
          <QuizScreen
            key={`q-${quizStep}`}
            question={QUESTIONS[quizStep]}
            value={answers[QUESTIONS[quizStep].key]}
            onChange={(v) => setAnswers({ ...answers, [QUESTIONS[quizStep].key]: v })}
            onNext={advanceQuiz} onBack={backInQuiz}
            step={quizStep} total={QUESTIONS.length}/>
        )}
        {screen === 'loading' && <LoadingScreen onDone={onLoadingDone}/>}
        {screen === 'result' && matches && (
          <ResultScreen matches={matches}
            onCustomize={onResultCustomize}
            onSelectAlt={onResultSelectAlt}
            onRetake={() => { setScreen('quiz'); setQuizStep(0); }}/>
        )}
        {screen === 'customize' && selectedCar && (
          <CustomizeScreen car={selectedCar}
            customization={customization}
            onChange={setCustomization}
            onContinue={onCustomizeContinue}/>
        )}
        {screen === 'form' && selectedCar && (
          <FormScreen car={selectedCar} customization={customization}
            onSubmit={onFormSubmit}/>
        )}
        {screen === 'done' && selectedCar && formData && (
          <DoneScreen car={selectedCar} customization={customization}
            formData={formData} onHome={home}/>
        )}
      </ScreenSwitch>

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Animácie" />
        <TweakRadio label="Intenzita"
          value={tweaks.animation}
          options={['subtle','medium','bold']}
          onChange={(v) => setTweak('animation', v)} />
        <div style={{fontSize:11, color:'rgba(41,38,27,.6)', marginTop:6}}>
          Ovláda rýchlosť a expresivitu všetkých animácií.
        </div>
        <TweakSection label="Skratky" />
        <TweakButton label="Skočiť na výsledok"
          onClick={() => {
            setAnswers({ lifestyle:'fam', usage:['family','commute'], budget:35000,
                         road:'highway', vibe:'comfort', fuel:'hybrid' });
            const ms = findMatches({ lifestyle:'fam', usage:['family','commute'], budget:35000,
                         road:'highway', vibe:'comfort', fuel:'hybrid' });
            setMatches(ms);
            setSelectedCar(ms[0].car);
            setScreen('result');
          }} />
        <TweakButton label="Reštart"
          onClick={() => { setAnswers({}); setQuizStep(0); setScreen('home'); }} />
      </TweaksPanel>
    </div>
  );
}

// Simple screen switch — each screen has its own internal entrance animations
function ScreenSwitch({ screen, children }) {
  return (
    <div key={screen} style={{position:'absolute', inset:0}}>
      {children}
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
