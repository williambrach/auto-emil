// cars.jsx — car catalog, illustrations and matching logic
// Exposes window.CARS, window.CarIllustration, window.findMatches,
// window.PAINT_OPTIONS, window.WHEEL_OPTIONS, window.Reticle.

// ─────────────────────────────────────────────────────────────────────────
// Brand reticle / scope mark — the autoskop logo motif
// ─────────────────────────────────────────────────────────────────────────
function Reticle({ size = 64, color = '#fff', stroke = 3, animated = false, style }) {
  const s = size,c = s / 2;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" style={style}
    className={animated ? 'anim-pulse' : undefined}>
      {/* 4 corner brackets */}
      {[
      'M2 14 V2 H14',
      'M50 2 H62 V14',
      'M62 50 V62 H50',
      'M14 62 H2 V50'].
      map((d, i) => <path key={i} d={d} stroke={color} strokeWidth={stroke} strokeLinecap="square" />)}
      {/* outer ring */}
      <circle cx={c} cy={c} r={20} stroke={color} strokeWidth={stroke} />
      {/* inner dot */}
      <circle cx={c} cy={c} r={8} fill={color} />
      {/* crosshair plus on the center */}
      <path d="M32 24 V40 M24 32 H40" stroke="#FF4747" strokeWidth={3} strokeLinecap="square" />
    </svg>);

}

// ─────────────────────────────────────────────────────────────────────────
// Logo wordmark — the actual autoskop SVG paths (viewBox 0 0 872 179).
// Uses currentColor so it can recolor for dark/light backgrounds.
// ─────────────────────────────────────────────────────────────────────────
function Logo({ color = '#fff', size = 32 }) {
  const w = size * (872 / 179),h = size;
  return (
    <svg viewBox="0 0 872 179" width={w} height={h} role="img" aria-label="autoskop"
    style={{ display: 'inline-block', flexShrink: 0, color }}>
      <g fill="currentColor">
        <path d="M104.911 39.2757V135.227H76.999V121.19C70.0737 131.108 60.8961 137.266 46.8351 137.266C17.6184 137.266 0 114.822 0 86.7681C0 58.714 16.2923 37.1953 46.2667 37.1953C59.1911 37.1953 70.4315 43.5627 76.999 52.3466V39.2547H104.911V39.2757ZM52.6447 114.654C66.3269 114.654 77.7568 105.87 77.7568 88.4703C77.7568 71.0704 67.0847 59.8488 51.908 59.8488C36.7313 59.8488 27.9327 72.1842 27.9327 86.9782C27.9327 101.772 37.2997 114.654 52.6658 114.654H52.6447Z" />
        <path d="M217.65 135.228H189.739V122.136C181.677 133.357 171.573 137.287 159.954 137.287C132.968 137.287 125.664 115.79 125.664 91.4549V39.2764H153.576V90.8875C153.576 104.169 158.438 114.276 171.384 114.276C184.329 114.276 189.739 103.979 189.739 90.7194V39.2764H217.65V135.228Z" />
        <path d="M276.276 39.2758H302.882V61.1517H276.276V106.038C276.276 110.157 277.96 114.465 283.391 114.465C288.821 114.465 290.695 109.968 290.695 105.492C290.695 102.697 289.937 98.7673 289.39 97.2543H311.492C313.176 100.806 313.744 105.303 313.744 108.665C313.744 122.871 304.377 137.287 281.707 137.287C264.846 137.287 248.364 131.298 248.364 103.433V61.1727H233.945V39.2968H250.427L254.742 15.7397H276.297V39.2968L276.276 39.2758Z" />
        <path d="M376.553 37.2163C404.654 37.2163 429.387 57.4111 429.387 87.1463C429.387 116.882 404.654 137.265 376.553 137.265C348.452 137.265 323.719 117.26 323.719 87.1463C323.719 57.0328 348.641 37.2163 376.553 37.2163ZM376.553 113.351C390.425 113.351 402.212 102.13 402.212 87.1674C402.212 72.2052 390.404 61.1726 376.553 61.1726C362.702 61.1726 350.894 72.2052 350.894 87.1674C350.894 102.13 362.892 113.351 376.553 113.351Z" />
        <path d="M460.099 101.373C462.899 112.406 472.645 115.768 480.328 115.768C486.516 115.768 492.873 113.33 492.873 108.476C492.873 105.303 491 103.054 485.759 101.184L468.898 94.081C446.038 86.0326 444.923 70.8812 444.923 66.5943C444.923 47.3242 461.973 37.2373 482.58 37.2373C493.631 37.2373 508.239 40.2213 517.249 57.4321L495.694 67.3508C493.252 59.6806 486.327 58.1886 482.012 58.1886C476.77 58.1886 471.34 61.1726 471.34 66.0479C471.34 70.1667 475.465 72.4153 480.328 74.2855L494.747 79.8964C517.417 86.4528 519.48 101.226 519.48 107.572C519.48 127.221 501.314 137.307 480.138 137.307C465.909 137.307 446.417 132.81 439.85 112.805L460.078 101.394L460.099 101.373Z" />
        <path d="M590.438 39.2758H621.36V43.0163L589.512 83.0486L602.057 103.054C606.372 109.59 609.74 111.649 615.171 111.649C617.234 111.649 622.096 110.703 625.485 108.287L635.968 127.935C627.359 135.605 618.35 137.287 610.856 137.287C599.995 137.287 590.059 133.735 582.376 122.703L563.074 91.6645V135.248H535.162V0H563.074V78.1733L590.438 39.2758Z" />
        <path d="M759.77 178.763V39.0384H787.681V53.076C794.606 43.1572 803.784 37 817.845 37C847.062 37 864.68 59.4433 864.68 87.4974C864.68 115.552 848.388 137.07 818.413 137.07C805.489 137.07 794.249 130.703 787.681 121.919V178.784H759.77V178.763ZM812.035 59.6114C798.353 59.6114 786.923 68.3954 786.923 85.7953C786.923 103.195 797.595 114.417 812.772 114.417C827.949 114.417 836.747 102.081 836.747 87.2873C836.747 72.4932 827.38 59.6114 812.014 59.6114H812.035Z" />
        <path d="M696.695 40.5767C723.344 40.5767 746.814 59.7417 746.814 87.9429C746.814 116.144 723.365 135.498 696.695 135.498C670.025 135.498 646.576 116.522 646.576 87.9429C646.576 59.3635 670.215 40.5767 696.695 40.5767ZM696.695 112.803C709.851 112.803 721.049 102.149 721.049 87.964C721.049 73.7793 709.851 63.2931 696.695 63.2931C683.539 63.2931 672.341 73.7583 672.341 87.964C672.341 102.17 683.707 112.803 696.695 112.803Z" />
        <path d="M708 85.752H686V88.752H708V85.752Z" />
        <path d="M699 76.752H696V97.752H699V76.752Z" />
        <path d="M648.155 53.5209H644.998V39H659.522V42.1521H648.155V53.5209Z" />
        <path d="M748.393 53.5209H745.235V42.1521H733.848V39H748.393V53.5209Z" />
        <path d="M748.393 137.074H733.848V133.922H745.235V122.574H748.393V137.074Z" />
      </g>
    </svg>);

}

// ─────────────────────────────────────────────────────────────────────────
// Wheel illustrations — multiple styles, used inside CarIllustration
// ─────────────────────────────────────────────────────────────────────────
const WHEEL_OPTIONS = [
{ id: 'sport', label: 'Sport', desc: 'Päťlúčové, dynamické' },
{ id: 'classic', label: 'Classic', desc: 'Sedem lúčov, elegancia' },
{ id: 'turbine', label: 'Turbine', desc: 'Aero, hladká plocha' },
{ id: 'offroad', label: 'All-Terrain', desc: 'Hrubý dezén, dobrodružstvo' }];


function Wheel({ cx, cy, r, style = 'sport', tireColor = '#0E0E12', rimColor = '#E0DDD6' }) {
  // Tire (outer) + rim (inner) + style-specific spokes
  const rimR = r * 0.72;
  const hubR = r * 0.18;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={tireColor} />
      <circle cx={cx} cy={cy} r={rimR} fill={rimColor} />
      {style === 'sport' && [0, 72, 144, 216, 288].map((deg) =>
      <rect key={deg} x={cx - 1.4} y={cy - rimR + 1} width={2.8} height={rimR - hubR - 1}
      fill="#3a3a44" transform={`rotate(${deg} ${cx} ${cy})`} rx={1} />
      )}
      {style === 'classic' && [0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((deg) =>
      <rect key={deg} x={cx - 1.2} y={cy - rimR + 1.5} width={2.4} height={rimR - hubR - 1.5}
      fill="#46464f" transform={`rotate(${deg} ${cx} ${cy})`} rx={1} />
      )}
      {style === 'turbine' && [0, 60, 120, 180, 240, 300].map((deg) =>
      <path key={deg} d={`M ${cx} ${cy - rimR + 1.5} Q ${cx + rimR * .35} ${cy - rimR * .5} ${cx + hubR * .6} ${cy + hubR * .3} L ${cx - hubR * .6} ${cy + hubR * .3} Z`}
      fill={rimColor} stroke="#878686" strokeWidth=".4"
      transform={`rotate(${deg} ${cx} ${cy})`} opacity=".96" />
      )}
      {style === 'offroad' &&
      <>
          {[...Array(16)].map((_, i) =>
        <rect key={i} x={cx - 3} y={cy - r + 1} width={6} height={4}
        fill="#1a1a22" transform={`rotate(${i * 22.5} ${cx} ${cy})`} rx={1} />
        )}
          {[0, 72, 144, 216, 288].map((deg) =>
        <rect key={deg} x={cx - 2} y={cy - rimR + 2} width={4} height={rimR - hubR - 2}
        fill="#2a2a33" transform={`rotate(${deg} ${cx} ${cy})`} rx={1} />
        )}
        </>
      }
      <circle cx={cx} cy={cy} r={hubR} fill="#1a1a22" />
      <circle cx={cx} cy={cy} r={hubR * .4} fill="#444" />
    </g>);

}

// ─────────────────────────────────────────────────────────────────────────
// Body silhouettes per car shape
// All cars share a 480x220 viewBox. Wheels at y=170, r=24.
// Body color, accent (trim/headlight) and window color are themable.
// ─────────────────────────────────────────────────────────────────────────
function CarIllustration({ shape = 'hatch', color = '#FF4747', wheel = 'sport',
  accent = '#0E0E12', size = 480, style }) {
  const window = '#1A1A22';
  const trim = '#0E0E12';
  const wheelTrack = 360; // horizontal distance between wheels
  const wheelY = 170;
  const wheelR = 24;
  const baseId = `g-${shape}-${color.replace('#', '')}`;

  const Lights = ({ x, color, w = 10, h = 8 }) =>
  <rect x={x} y={120} width={w} height={h} rx={2} fill={color} />;


  // Each shape returns its body JSX, given a left wheel cx (lwx) and right (rwx)
  const lwx = 70;
  const rwx = lwx + wheelTrack;

  let body;
  if (shape === 'small') {
    // Fiat 500 / Abarth — short, tall, round
    body =
    <g>
        {/* under-body shadow */}
        <ellipse cx="240" cy="195" rx="170" ry="10" fill="rgba(0,0,0,.18)" />
        {/* main body */}
        <path d="M 70 170
                 C 55 170, 50 145, 70 130
                 C 78 110, 90 90, 130 80
                 Q 200 56, 280 60
                 C 330 64, 380 90, 408 130
                 C 425 140, 425 165, 410 170
                 Z"











      fill={`url(#${baseId})`} stroke={trim} strokeWidth=".8" />
        {/* windows */}
        <path d="M 132 92 Q 200 70, 280 76 L 340 110 L 145 110 Z" fill={window} />
        <line x1="232" y1="76" x2="232" y2="110" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
        {/* door line */}
        <path d="M 230 110 L 230 165" stroke={trim} strokeOpacity=".25" strokeWidth="1.4" />
        {/* head/tail lights */}
        <rect x="395" y="125" width="14" height="8" rx="3" fill={accent} />
        <rect x="71" y="125" width="14" height="6" rx="2" fill="#fff" opacity=".9" />
      </g>;

  } else if (shape === 'hatch') {
    // Peugeot 208 / Opel Corsa / Citroen C3 — sleek compact
    body =
    <g>
        <ellipse cx="240" cy="195" rx="200" ry="10" fill="rgba(0,0,0,.18)" />
        <path d="M 50 170
                 C 40 168, 36 152, 50 138
                 L 90 128
                 C 110 96, 140 84, 200 78
                 Q 280 72, 340 86
                 L 380 110
                 L 420 130
                 C 440 134, 442 162, 425 170
                 Z"















      fill={`url(#${baseId})`} stroke={trim} strokeWidth=".8" />
        {/* windshield + windows */}
        <path d="M 108 122 L 130 92 Q 200 80, 290 86 L 332 102 L 360 122 Z" fill={window} />
        <line x1="222" y1="84" x2="222" y2="122" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <line x1="280" y1="86" x2="280" y2="122" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        {/* door */}
        <path d="M 218 122 L 218 165" stroke={trim} strokeOpacity=".25" strokeWidth="1.4" />
        {/* trim line */}
        <path d="M 60 142 L 420 142" stroke="rgba(0,0,0,.18)" strokeWidth=".8" />
        {/* lights */}
        <path d="M 420 132 L 433 134 L 432 144 L 420 142 Z" fill={accent} />
        <path d="M 50 138 L 65 140 L 64 148 L 50 148 Z" fill="#fff" opacity=".95" />
      </g>;

  } else if (shape === 'sedan') {
    // Alfa Giulia — sport sedan
    body =
    <g>
        <ellipse cx="240" cy="196" rx="215" ry="9" fill="rgba(0,0,0,.18)" />
        <path d="M 40 170
                 C 30 166, 28 148, 44 138
                 L 90 128
                 C 110 102, 145 92, 200 86
                 Q 270 82, 320 92
                 L 380 116
                 L 430 130
                 C 446 134, 446 162, 430 170
                 Z"















      fill={`url(#${baseId})`} stroke={trim} strokeWidth=".8" />
        <path d="M 108 124 L 140 100 Q 200 90, 270 94 L 320 112 L 360 124 Z" fill={window} />
        <line x1="218" y1="92" x2="218" y2="124" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <line x1="280" y1="98" x2="280" y2="124" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <path d="M 218 124 L 218 165" stroke={trim} strokeOpacity=".25" strokeWidth="1.4" />
        {/* trim chrome line */}
        <path d="M 50 142 L 430 142" stroke="rgba(255,255,255,.2)" strokeWidth=".8" />
        <path d="M 50 138 L 90 138" stroke="#fff" strokeWidth="1" opacity=".8" />
        <path d="M 422 130 L 440 134 L 438 144 L 420 142 Z" fill={accent} />
        <rect x="42" y="138" width="12" height="6" rx="1" fill="#fff" opacity=".95" />
      </g>;

  } else if (shape === 'suv') {
    // Peugeot 3008 / Alfa Tonale / DS 7 / Opel Mokka / Avenger
    body =
    <g>
        <ellipse cx="240" cy="196" rx="208" ry="10" fill="rgba(0,0,0,.18)" />
        <path d="M 50 170
                 C 38 168, 34 142, 52 126
                 L 86 116
                 C 102 84, 132 70, 190 64
                 Q 270 60, 330 76
                 L 380 100
                 L 422 124
                 C 444 128, 446 160, 428 170
                 Z"















      fill={`url(#${baseId})`} stroke={trim} strokeWidth=".8" />
        {/* windows */}
        <path d="M 104 120 L 130 78 Q 200 68, 290 74 L 340 96 L 370 120 Z" fill={window} />
        <line x1="218" y1="72" x2="218" y2="120" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <line x1="280" y1="74" x2="280" y2="120" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        {/* black cladding lower edge */}
        <path d="M 56 152 L 422 152 L 425 168 L 54 168 Z" fill={trim} opacity=".88" />
        {/* door */}
        <path d="M 218 120 L 218 152" stroke={trim} strokeOpacity=".3" strokeWidth="1.4" />
        {/* light fang */}
        <path d="M 420 124 L 438 128 L 438 142 L 422 142 Z" fill={accent} />
        <path d="M 52 126 L 72 130 L 72 140 L 56 138 Z" fill="#fff" opacity=".95" />
      </g>;

  } else if (shape === 'largeSuv') {
    // Peugeot 5008 / Jeep Compass — long family SUV
    body =
    <g>
        <ellipse cx="240" cy="196" rx="225" ry="10" fill="rgba(0,0,0,.18)" />
        <path d="M 30 170
                 C 18 168, 14 142, 32 126
                 L 70 116
                 C 84 82, 110 68, 170 60
                 Q 260 56, 340 70
                 L 400 92
                 L 440 122
                 C 460 126, 462 160, 444 170
                 Z"















      fill={`url(#${baseId})`} stroke={trim} strokeWidth=".8" />
        <path d="M 88 120 L 112 74 Q 200 62, 300 70 L 358 94 L 388 120 Z" fill={window} />
        <line x1="200" y1="64" x2="200" y2="120" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <line x1="270" y1="66" x2="270" y2="120" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <line x1="328" y1="76" x2="328" y2="120" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <path d="M 40 152 L 442 152 L 446 168 L 36 168 Z" fill={trim} opacity=".88" />
        <path d="M 200 120 L 200 152" stroke={trim} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M 270 120 L 270 152" stroke={trim} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M 438 122 L 456 126 L 456 142 L 440 142 Z" fill={accent} />
        <path d="M 32 126 L 52 130 L 52 140 L 36 138 Z" fill="#fff" opacity=".95" />
      </g>;

  } else if (shape === 'offroad') {
    // Jeep Wrangler / Compass-rugged — boxy upright
    body =
    <g>
        <ellipse cx="240" cy="200" rx="215" ry="10" fill="rgba(0,0,0,.18)" />
        {/* high stance — wheels visible bigger */}
        <path d="M 60 175
                 L 60 132
                 L 76 120
                 L 100 70
                 L 380 70
                 L 402 120
                 L 420 132
                 L 420 175
                 Z"















      fill={`url(#${baseId})`} stroke={trim} strokeWidth=".8" />
        {/* windows */}
        <rect x="104" y="78" width="282" height="40" fill={window} />
        <line x1="180" y1="78" x2="180" y2="118" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
        <line x1="244" y1="78" x2="244" y2="118" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
        <line x1="310" y1="78" x2="310" y2="118" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
        {/* grille (7-slot Jeep) */}
        <rect x="64" y="128" width="22" height="34" fill="#0a0a10" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) =>
      <rect key={i} x={67 + i * 3.1} y="130" width="1.6" height="30" fill={color} opacity=".7" />)}
        {/* round headlights */}
        <circle cx="74" cy="134" r="4.5" fill="#fff" opacity=".95" />
        {/* tail lights */}
        <rect x="408" y="128" width="12" height="20" rx="1" fill={accent} />
        {/* body cladding bottom */}
        <path d="M 60 158 L 420 158 L 420 175 L 60 175 Z" fill={trim} opacity=".85" />
      </g>;

  }

  return (
    <svg viewBox="0 0 480 220" width={size} height={size * 220 / 480} style={style}>
      <defs>
        {/* paint gradient — gives metallic feel */}
        <linearGradient id={baseId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={lighten(color, 0.18)} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={darken(color, 0.18)} />
        </linearGradient>
      </defs>
      {body}
      {/* wheels */}
      <Wheel cx={lwx} cy={wheelY + (shape === 'offroad' ? 2 : 0)} r={shape === 'offroad' ? 30 : wheelR} style={wheel} />
      <Wheel cx={rwx} cy={wheelY + (shape === 'offroad' ? 2 : 0)} r={shape === 'offroad' ? 30 : wheelR} style={wheel} />
    </svg>);

}

function lighten(hex, p) {return mixWith(hex, '#ffffff', p);}
function darken(hex, p) {return mixWith(hex, '#000000', p);}
function mixWith(hex, target, p) {
  const a = hexToRgb(hex),b = hexToRgb(target);
  const r = Math.round(a.r + (b.r - a.r) * p);
  const g = Math.round(a.g + (b.g - a.g) * p);
  const bl = Math.round(a.b + (b.b - a.b) * p);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

// ─────────────────────────────────────────────────────────────────────────
// Paint options for customization
// ─────────────────────────────────────────────────────────────────────────
const PAINT_OPTIONS = [
{ id: 'pearl-white', label: 'Pearl White', color: '#F5F2EC' },
{ id: 'jet-black', label: 'Jet Black', color: '#15161A' },
{ id: 'storm-grey', label: 'Storm Grey', color: '#7C7E86' },
{ id: 'ocean-blue', label: 'Ocean Blue', color: '#1E4DA1' },
{ id: 'rosso', label: 'Rosso Passione', color: '#D7202A' },
{ id: 'mint', label: 'Mint Fresh', color: '#9FD8C2' },
{ id: 'sand', label: 'Desert Sand', color: '#C6A576' }];


// ─────────────────────────────────────────────────────────────────────────
// Car catalog
// ─────────────────────────────────────────────────────────────────────────
const CARS = [
{
  id: 'fiat-500', brand: 'Fiat', model: '500', tagline: 'Mestská ikona s talianskou dušou',
  shape: 'small', color: '#F5DC4A', accent: '#0E0E12', wheel: 'classic',
  priceFrom: 14990, monthly: 139,
  fuels: ['Benzín', 'Hybrid', 'Elektro'],
  badge: 'Mestský favorit',
  why: 'Malé, šikovné a charakterné. Ako stvorené pre úzke uličky a štýlové parkovanie.',
  spec: { 'Body': 'Mestský hatch', 'Spotreba': '4.6 l/100km', 'Dojazd EV': '320 km', 'Sedadlá': '4' },
  traits: { fam: 0, sng: 3, act: 1, urb: 3, commute: 3, family: 0, business: 1, offroad: 0, leisure: 3,
    city: 3, highway: 1, mountain: 0, dirt: 0, comfort: 2, sport: 1, practical: 2, wow: 2,
    benzin: 2, diesel: 0, hybrid: 2, elektro: 3 }
},
{
  id: 'peugeot-208', brand: 'Peugeot', model: '208', tagline: 'Sebavedomý hatch s leví drzosťou',
  shape: 'hatch', color: '#1E4DA1', accent: '#FFD93B', wheel: 'sport',
  priceFrom: 17890, monthly: 179,
  fuels: ['Benzín', 'Hybrid', 'Elektro'],
  badge: 'Bestseller',
  why: 'Vyladený podvozok, kockové LED svetlá a i-Cockpit, ktorý ťa pohltí.',
  spec: { 'Body': '5-dverový hatch', 'Spotreba': '5.1 l/100km', 'Výkon': '100–156 k', 'Sedadlá': '5' },
  traits: { fam: 1, sng: 3, act: 2, urb: 3, commute: 3, family: 1, business: 2, offroad: 0, leisure: 2,
    city: 3, highway: 2, mountain: 1, dirt: 0, comfort: 2, sport: 2, practical: 3, wow: 2,
    benzin: 3, diesel: 1, hybrid: 3, elektro: 3 }
},
{
  id: 'citroen-c3', brand: 'Citroën', model: 'C3', tagline: 'Pohodlie nad všetko ostatné',
  shape: 'hatch', color: '#9FD8C2', accent: '#D7202A', wheel: 'classic',
  priceFrom: 15290, monthly: 145,
  fuels: ['Benzín', 'Elektro'],
  badge: 'Komfort šampión',
  why: 'Advanced Comfort® sedadlá a tlmiče. Cesta plná dier sa zrazu vyhladí.',
  spec: { 'Body': 'Mestský crossover', 'Spotreba': '5.3 l/100km', 'Dojazd EV': '320 km', 'Sedadlá': '5' },
  traits: { fam: 2, sng: 2, act: 2, urb: 3, commute: 3, family: 2, business: 1, offroad: 0, leisure: 2,
    city: 3, highway: 2, mountain: 1, dirt: 0, comfort: 3, sport: 0, practical: 3, wow: 2,
    benzin: 3, diesel: 0, hybrid: 1, elektro: 3 }
},
{
  id: 'peugeot-3008', brand: 'Peugeot', model: '3008', tagline: 'Štýlové SUV s hybridnou DNA',
  shape: 'suv', color: '#15161A', accent: '#FFD93B', wheel: 'turbine',
  priceFrom: 32990, monthly: 299,
  fuels: ['Hybrid', 'Plug-in', 'Elektro'],
  badge: 'Top hybrid',
  why: 'Veľký i-Cockpit, hybridné srdce a kabína, v ktorej sa nechce vystúpiť.',
  spec: { 'Body': 'Stredné SUV', 'Spotreba': '5.4 l/100km', 'Výkon': '136–225 k', 'Sedadlá': '5' },
  traits: { fam: 3, sng: 2, act: 2, urb: 2, commute: 3, family: 3, business: 3, offroad: 1, leisure: 3,
    city: 2, highway: 3, mountain: 2, dirt: 1, comfort: 3, sport: 2, practical: 3, wow: 3,
    benzin: 1, diesel: 1, hybrid: 3, elektro: 3 }
},
{
  id: 'peugeot-5008', brand: 'Peugeot', model: '5008', tagline: 'Sedem miest, nekonečno scenárov',
  shape: 'largeSuv', color: '#7C7E86', accent: '#FFD93B', wheel: 'turbine',
  priceFrom: 38990, monthly: 359,
  fuels: ['Hybrid', 'Elektro'],
  badge: 'Pre veľkú rodinu',
  why: 'Až sedem miest, masívny kufor a moderný interiér s panoramatickým displejom.',
  spec: { 'Body': 'Veľké SUV', 'Spotreba': '5.6 l/100km', 'Kufor': '780 L', 'Sedadlá': '7' },
  traits: { fam: 3, sng: 0, act: 2, urb: 1, commute: 2, family: 3, business: 3, offroad: 1, leisure: 3,
    city: 1, highway: 3, mountain: 2, dirt: 1, comfort: 3, sport: 1, practical: 3, wow: 2,
    benzin: 1, diesel: 1, hybrid: 3, elektro: 3 }
},
{
  id: 'jeep-avenger', brand: 'Jeep', model: 'Avenger', tagline: 'Mestský dobrodruh v kompaktnom balení',
  shape: 'suv', color: '#C6A576', accent: '#D7202A', wheel: 'offroad',
  priceFrom: 24990, monthly: 229,
  fuels: ['Benzín', 'Hybrid', 'Elektro'],
  badge: 'Auto roka 2023',
  why: 'Pravý Jeep look, kompaktné rozmery, vysoký sed. Vyrazí kamkoľvek.',
  spec: { 'Body': 'Mestské SUV', 'Spotreba': '5.7 l/100km', 'Dojazd EV': '400 km', 'Sedadlá': '5' },
  traits: { fam: 2, sng: 3, act: 3, urb: 3, commute: 3, family: 2, business: 1, offroad: 2, leisure: 3,
    city: 3, highway: 2, mountain: 2, dirt: 2, comfort: 2, sport: 2, practical: 3, wow: 3,
    benzin: 2, diesel: 1, hybrid: 3, elektro: 3 }
},
{
  id: 'jeep-wrangler', brand: 'Jeep', model: 'Wrangler', tagline: 'Legenda, ktorá pozná všetky chodníky',
  shape: 'offroad', color: '#2A6F4B', accent: '#FFD93B', wheel: 'offroad',
  priceFrom: 62990, monthly: 599,
  fuels: ['Benzín', 'Plug-in'],
  badge: 'Hard-core 4x4',
  why: 'Skutočná offroadová DNA: redukcia, uzávierky a strecha, ktorá sa dá zložiť.',
  spec: { 'Body': 'Off-road 4x4', 'Spotreba': '10.1 l/100km', 'Brod': '760 mm', 'Sedadlá': '5' },
  traits: { fam: 1, sng: 3, act: 3, urb: 1, commute: 1, family: 1, business: 1, offroad: 3, leisure: 3,
    city: 1, highway: 2, mountain: 3, dirt: 3, comfort: 1, sport: 2, practical: 1, wow: 3,
    benzin: 3, diesel: 0, hybrid: 2, elektro: 0 }
},
{
  id: 'alfa-tonale', brand: 'Alfa Romeo', model: 'Tonale', tagline: 'Talianska vášeň v SUV šate',
  shape: 'suv', color: '#D7202A', accent: '#15161A', wheel: 'sport',
  priceFrom: 42990, monthly: 419,
  fuels: ['Hybrid', 'Plug-in'],
  badge: 'Najsexi SUV',
  why: 'Trojlístok v DNA, podvozok, ktorý baví, a interiér s talianskym šarmom.',
  spec: { 'Body': 'Sport SUV', 'Spotreba': '1.4 l/100km PHEV', 'Výkon': '160–280 k', 'Sedadlá': '5' },
  traits: { fam: 2, sng: 3, act: 2, urb: 2, commute: 2, family: 2, business: 3, offroad: 0, leisure: 3,
    city: 2, highway: 3, mountain: 3, dirt: 0, comfort: 2, sport: 3, practical: 2, wow: 3,
    benzin: 1, diesel: 0, hybrid: 3, elektro: 1 }
},
{
  id: 'alfa-giulia', brand: 'Alfa Romeo', model: 'Giulia', tagline: 'Klasický sedan s pulzujúcim srdcom',
  shape: 'sedan', color: '#15161A', accent: '#D7202A', wheel: 'sport',
  priceFrom: 54990, monthly: 529,
  fuels: ['Benzín', 'Diesel'],
  badge: 'Driver\'s choice',
  why: 'Zadný náhon, perfektne vyvážené šasi a motor, ktorý si zamiluješ.',
  spec: { 'Body': 'Sport sedan', 'Výkon': '200–520 k', '0–100': '5.7 s', 'Sedadlá': '5' },
  traits: { fam: 1, sng: 3, act: 1, urb: 2, commute: 2, family: 1, business: 3, offroad: 0, leisure: 2,
    city: 2, highway: 3, mountain: 3, dirt: 0, comfort: 2, sport: 3, practical: 1, wow: 3,
    benzin: 3, diesel: 2, hybrid: 0, elektro: 0 }
},
{
  id: 'abarth-500e', brand: 'Abarth', model: '500e', tagline: 'Štipľavá elektrina v talianskom obale',
  shape: 'small', color: '#9FD8C2', accent: '#D7202A', wheel: 'sport',
  priceFrom: 33990, monthly: 319,
  fuels: ['Elektro'],
  badge: 'Hot hatch EV',
  why: 'Skutočne nahnevaný malý štír. Soundgenerator robí ten správny zvuk.',
  spec: { 'Body': 'Hot hatch EV', 'Výkon': '155 k', 'Dojazd': '265 km', 'Sedadlá': '4' },
  traits: { fam: 0, sng: 3, act: 2, urb: 3, commute: 2, family: 0, business: 1, offroad: 0, leisure: 3,
    city: 3, highway: 2, mountain: 3, dirt: 0, comfort: 1, sport: 3, practical: 1, wow: 3,
    benzin: 0, diesel: 0, hybrid: 0, elektro: 3 }
},
{
  id: 'ds-7', brand: 'DS', model: 'DS 7', tagline: 'Francúzska elegancia s premium ambíciou',
  shape: 'suv', color: '#15161A', accent: '#C6A576', wheel: 'turbine',
  priceFrom: 48990, monthly: 469,
  fuels: ['Hybrid', 'Plug-in'],
  badge: 'Premium',
  why: 'Nappa koža, šachovnicová grilová svetelná stena, jazda ako v salóne.',
  spec: { 'Body': 'Premium SUV', 'Spotreba': '1.5 l/100km PHEV', 'Výkon': '180–360 k', 'Sedadlá': '5' },
  traits: { fam: 2, sng: 2, act: 1, urb: 2, commute: 3, family: 2, business: 3, offroad: 0, leisure: 3,
    city: 2, highway: 3, mountain: 2, dirt: 0, comfort: 3, sport: 2, practical: 2, wow: 3,
    benzin: 0, diesel: 0, hybrid: 3, elektro: 1 }
},
{
  id: 'leapmotor-c10', brand: 'Leapmotor', model: 'C10', tagline: 'Veľké EV SUV za rozumné peniaze',
  shape: 'suv', color: '#F5F2EC', accent: '#1E4DA1', wheel: 'turbine',
  priceFrom: 36990, monthly: 329,
  fuels: ['Elektro', 'REEV'],
  badge: 'Smart EV',
  why: 'Priestranné, ticho jazdiace SUV s dlhým dojazdom a moderným kokpitom.',
  spec: { 'Body': 'Stredné EV SUV', 'Dojazd': '420 km', 'Výkon': '218 k', 'Sedadlá': '5' },
  traits: { fam: 3, sng: 2, act: 2, urb: 2, commute: 3, family: 3, business: 2, offroad: 1, leisure: 2,
    city: 3, highway: 3, mountain: 2, dirt: 1, comfort: 3, sport: 1, practical: 3, wow: 2,
    benzin: 0, diesel: 0, hybrid: 2, elektro: 3 }
},
{
  id: 'opel-mokka', brand: 'Opel', model: 'Mokka', tagline: 'Vizuál, ktorý sa nedá prehliadnuť',
  shape: 'suv', color: '#FF8C2A', accent: '#15161A', wheel: 'sport',
  priceFrom: 23990, monthly: 219,
  fuels: ['Benzín', 'Elektro'],
  badge: 'Štýl & cena',
  why: 'Vizier predok, digitálny kokpit a kompaktné rozmery do mesta.',
  spec: { 'Body': 'Crossover', 'Spotreba': '5.5 l/100km', 'Dojazd EV': '406 km', 'Sedadlá': '5' },
  traits: { fam: 2, sng: 3, act: 2, urb: 3, commute: 3, family: 2, business: 2, offroad: 0, leisure: 2,
    city: 3, highway: 2, mountain: 1, dirt: 0, comfort: 2, sport: 2, practical: 3, wow: 3,
    benzin: 3, diesel: 0, hybrid: 1, elektro: 3 }
}];


// ─────────────────────────────────────────────────────────────────────────
// Matching — score each car against the user's answers
// answers shape: { lifestyle, usage[], budget, road, vibe, fuel }
// ─────────────────────────────────────────────────────────────────────────
function findMatches(a) {
  const W = { lifestyle: 1.4, usage: 1.2, budget: 1.6, road: 1.1, vibe: 1.3, fuel: 1.0 };
  const scored = CARS.map((c) => {
    let s = 0;
    if (a.lifestyle && c.traits[a.lifestyle] != null) s += c.traits[a.lifestyle] * W.lifestyle;
    if (Array.isArray(a.usage)) a.usage.forEach((u) => {if (c.traits[u] != null) s += c.traits[u] * W.usage;});
    if (a.road && c.traits[a.road] != null) s += c.traits[a.road] * W.road;
    if (a.vibe && c.traits[a.vibe] != null) s += c.traits[a.vibe] * W.vibe;
    if (a.fuel && a.fuel !== 'any' && c.traits[a.fuel] != null) s += c.traits[a.fuel] * W.fuel;
    // budget: closer is better; harsher penalty when over budget
    if (a.budget) {
      const over = c.priceFrom - a.budget;
      if (over <= 0) s += 4 * W.budget;else
      if (over <= 5000) s += 2 * W.budget;else
      if (over <= 12000) s += 0;else
      s -= Math.min(8, (over - 12000) / 4000) * W.budget;
    }
    return { car: c, score: s };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored;
}

Object.assign(window, { CARS, CarIllustration, findMatches, PAINT_OPTIONS, WHEEL_OPTIONS, Reticle, Logo, Wheel });