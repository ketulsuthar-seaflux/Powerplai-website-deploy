import { Helmet } from '@dr.pogodin/react-helmet';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Zap, BarChart3, Users, Shield, Mail } from 'lucide-react';

// ─── Token map (mirrors the kit's CSS vars, adapted to brand palette) ──────────
const T = {
  bg: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceBlue: '#0E1E3A',
  border: '#2A2A2A',
  borderSubtle: '#1E1E1E',
  chalk: '#F5F5F5',
  chalkSecondary: '#d4d4d4',
  chalkTertiary: '#8a8a8a',
  volt: '#FF6B00',       // brand orange mapped to --volt-primary
  blue: '#1A3A6B',       // brand blue as secondary surface
  blueLight: '#1E4080',
  displayFont: "'Bebas Neue', 'Arial Narrow', sans-serif",
  bodyFont: 'Inter, system-ui, sans-serif',
  ease: 'cubic-bezier(0.4,0,0.2,1)',
};

// ─── Reusable styled components ────────────────────────────────────────────────

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: T.bodyFont,
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        color: T.volt,
        display: 'block',
        marginBottom: '20px',
      }}
    >
      {children}
    </span>
  );
}

function DisplayHeadline({
  children,
  size = 'lg',
  color = T.chalk,
  style = {},
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: React.CSSProperties;
}) {
  const sizes = {
    sm: 'clamp(36px, 4.5vw, 60px)',
    md: 'clamp(48px, 6vw, 80px)',
    lg: 'clamp(64px, 8vw, 112px)',
    xl: 'clamp(96px, 16vw, 200px)',
  };
  return (
    <h2
      style={{
        fontFamily: T.displayFont,
        fontSize: sizes[size],
        fontWeight: 400,
        letterSpacing: '0.01em',
        lineHeight: 0.88,
        color,
        textTransform: 'uppercase' as const,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

function FactRow({
  label,
  value,
  sub,
  voltValue = false,
}: {
  label: string;
  value: string;
  sub?: string;
  voltValue?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '24px',
        padding: '24px 0',
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <span
        style={{
          fontFamily: T.bodyFont,
          fontSize: '12px',
          fontWeight: 400,
          color: T.chalkTertiary,
          textTransform: 'lowercase' as const,
          lineHeight: 1.5,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ textAlign: 'right' }}>
        <span
          style={{
            fontFamily: T.displayFont,
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 1,
            color: voltValue ? T.volt : T.chalk,
            textTransform: 'uppercase' as const,
            whiteSpace: 'nowrap' as const,
            display: 'block',
          }}
        >
          {value}
        </span>
        {sub && (
          <span
            style={{
              display: 'block',
              fontFamily: T.bodyFont,
              fontSize: '11px',
              color: T.chalkTertiary,
              marginTop: '4px',
              textTransform: 'lowercase' as const,
            }}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function PillButton({
  children,
  href,
  filled = false,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  filled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '9999px',
    padding: '16px 32px',
    fontFamily: T.bodyFont,
    fontWeight: 700,
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    transition: `background 150ms ${T.ease}, color 150ms ${T.ease}, border-color 150ms ${T.ease}`,
    border: `2px solid ${T.volt}`,
    background: hovered || filled ? T.volt : 'transparent',
    color: hovered || filled ? T.bg : T.volt,
  };
  return (
    <a
      href={href || '#'}
      style={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

// ─── AI HUD Overlay ────────────────────────────────────────────────────────────

const hudData = [
  {
    metrics: [
      { label: 'Bat Speed', value: '118', unit: 'km/h', delta: '+4.2%' },
      { label: 'Strike Rate', value: '142', unit: '', delta: '+11%' },
      { label: 'Shot Predict', value: '94', unit: '%', delta: 'accuracy' },
    ],
    tags: ['BIOMECH SCAN', 'SHOT TRAJECTORY', 'IMPACT ZONE'],
  },
  {
    metrics: [
      { label: 'Raid Score', value: '87', unit: 'pts', delta: '+9.1%' },
      { label: 'Tackle Force', value: '340', unit: 'N', delta: 'peak' },
      { label: 'Agility Index', value: '96', unit: '%', delta: 'elite tier' },
    ],
    tags: ['MOTION TRACK', 'FORCE VECTOR', 'ZONE CONTROL'],
  },
  {
    metrics: [
      { label: 'Serve Speed', value: '214', unit: 'km/h', delta: '+2.8%' },
      { label: 'Spin Rate', value: '2840', unit: 'rpm', delta: 'topspin' },
      { label: 'Win Prob', value: '73', unit: '%', delta: 'live model' },
    ],
    tags: ['BALL TRACK', 'SPIN ANALYSIS', 'MATCH INTEL'],
  },
];

function AiHudOverlay({ active }: { active: number }) {
  const data = hudData[active];
  const mono: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    letterSpacing: '0.04em',
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── Top-right: scanning reticle + tags ── */}
      <div
        style={{
          position: 'absolute',
          top: '88px',
          right: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
          opacity: 0.72,
        }}
      >
        {/* Reticle SVG */}
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          {/* Corner brackets */}
          <path d="M4 16 L4 4 L16 4" stroke={T.volt} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 4 L52 4 L52 16" stroke={T.volt} strokeWidth="2" strokeLinecap="round" />
          <path d="M52 40 L52 52 L40 52" stroke={T.volt} strokeWidth="2" strokeLinecap="round" />
          <path d="M16 52 L4 52 L4 40" stroke={T.volt} strokeWidth="2" strokeLinecap="round" />
          {/* Centre cross */}
          <line x1="28" y1="22" x2="28" y2="34" stroke={T.volt} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="28" x2="34" y2="28" stroke={T.volt} strokeWidth="1.5" strokeLinecap="round" />
          {/* Centre dot */}
          <circle cx="28" cy="28" r="2" fill={T.volt} />
        </svg>

        {/* AI tags */}
        {data.tags.map((tag) => (
          <div
            key={tag}
            style={{
              ...mono,
              fontSize: '9px',
              fontWeight: 700,
              color: T.volt,
              background: 'rgba(13,13,13,0.65)',
              border: `1px solid ${T.volt}55`,
              padding: '3px 8px',
              borderRadius: '2px',
              textTransform: 'uppercase' as const,
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* ── Right-side metric panel ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '48px',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          opacity: 0.82,
        }}
      >
        {data.metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: 'rgba(13,13,13,0.7)',
              border: `1px solid ${T.border}`,
              borderLeft: `2px solid ${T.volt}`,
              padding: '10px 14px',
              minWidth: '160px',
            }}
          >
            <div
              style={{
                ...mono,
                fontSize: '9px',
                color: T.chalkTertiary,
                textTransform: 'uppercase' as const,
                marginBottom: '4px',
              }}
            >
              {m.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span
                style={{
                  ...mono,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: T.chalk,
                  lineHeight: 1,
                }}
              >
                {m.value}
              </span>
              {m.unit && (
                <span style={{ ...mono, fontSize: '11px', color: T.chalkTertiary }}>
                  {m.unit}
                </span>
              )}
            </div>
            <div
              style={{
                ...mono,
                fontSize: '9px',
                color: T.volt,
                marginTop: '3px',
                textTransform: 'lowercase' as const,
              }}
            >
              {m.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom-left: scan line + AI label ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          opacity: 0.6,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '1px',
            background: T.volt,
          }}
        />
        <span
          style={{
            ...mono,
            fontSize: '9px',
            color: T.volt,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
          }}
        >
          AI · LIVE ANALYSIS
        </span>
        {/* Blinking dot */}
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: T.volt,
            display: 'inline-block',
            animation: 'hudBlink 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── SVG scan lines across image ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
        preserveAspectRatio="none"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={`${(i / 18) * 100}%`}
            x2="100%"
            y2={`${(i / 18) * 100}%`}
            stroke={T.volt}
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Blink keyframe injected via style tag */}
      <style>{`
        @keyframes hudBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

// ─── Section: Hero ─────────────────────────────────────────────────────────────

const heroSlides = [
  {
    src: '/airo-assets/images/pages/home/hero-cricket',
    alt: 'Cricket batsman in action',
    sport: 'Cricket',
  },
  {
    src: '/airo-assets/images/pages/home/hero-kabaddi',
    alt: 'Kabaddi player in a tackle',
    sport: 'Kabaddi',
  },
  {
    src: '/airo-assets/images/pages/home/hero-tennis',
    alt: 'Tennis player in action on court',
    sport: 'Tennis',
  },
];

function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      aria-label="PowerplAI Sports — The Future of Sport"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '640px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== active}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: i === active ? 1 : 0,
            transition: 'opacity 900ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: 'none',
            }}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to top, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.25) 55%, rgba(13,13,13,0.1) 100%)',
        }}
      />

      {/* AI Data HUD overlay */}
      <AiHudOverlay active={active} />

      {/* Orange floor line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: T.volt,
          zIndex: 5,
        }}
      />

      {/* Content — bottom anchored */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          paddingTop: 'calc(64px + 48px)',
          paddingBottom: '80px',
          paddingLeft: '48px',
          paddingRight: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.2 }}
          style={{
            fontFamily: T.bodyFont,
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.08em',
            color: T.chalk,
            display: 'block',
            marginBottom: '24px',
          }}
        >
          The Future of Sport
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.35 }}
          style={{
            fontFamily: T.displayFont,
            fontSize: 'clamp(80px, 14vw, 180px)',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 0.88,
            color: T.chalk,
            textTransform: 'uppercase' as const,
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          Unlocking<br />
          <span style={{ color: T.volt }}>Sports</span><br />
          Intelligence
        </motion.h1>

        {/* Slide indicator dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '40px',
          }}
        >
          {heroSlides.map((slide, i) => (
            <button
              key={slide.sport}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: i === active ? '36px' : '14px',
                  height: '3px',
                  borderRadius: '2px',
                  background: i === active ? T.volt : 'rgba(255,255,255,0.3)',
                  transition: 'width 400ms cubic-bezier(0.4,0,0.2,1), background 400ms',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Stamp */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '48px',
          zIndex: 3,
          fontFamily: 'monospace',
          fontSize: '10px',
          color: T.chalkTertiary,
          background: 'rgba(13,13,13,0.75)',
          padding: '3px 8px',
          borderRadius: '2px',
          lineHeight: 1.4,
        }}
      >
        powerplai.sports / 2026
      </span>
    </section>
  );
}

// ─── Section: Pitch / Why Sports Tech Matters ──────────────────────────────────

function PitchSection() {
  const facts = [
    { label: 'global sports tech market', value: '$40B+', sub: 'projected by 2030', volt: false },
    { label: 'ai adoption in elite sport', value: '78%', sub: 'of top-tier clubs using ai tools', volt: true },
    { label: 'avg performance improvement', value: '23%', sub: 'with data-driven coaching', volt: false },
    { label: 'injury reduction rate', value: '31%', sub: 'via predictive analytics', volt: true },
  ];

  return (
    <section
      id="why"
      aria-labelledby="pitch-heading"
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: 'clamp(80px, 12vw, 140px) 48px',
        display: 'grid',
        gridTemplateColumns: '55fr 45fr',
        gap: 'clamp(48px, 7vw, 96px)',
        alignItems: 'start',
        background: T.bg,
      }}
    >
      {/* Left: editorial */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <SectionEyebrow>Why Sports Tech Matters</SectionEyebrow>
        <DisplayHeadline size="lg" style={{ marginBottom: '40px' }}>
          Technology<br />
          Is the New<br />
          Competitive<br />
          Edge
        </DisplayHeadline>

        <p
          style={{
            fontFamily: T.bodyFont,
            fontSize: '16px',
            color: T.chalkSecondary,
            lineHeight: 1.7,
            maxWidth: '65ch',
            marginBottom: '20px',
          }}
        >
          POWERPLAI SPORTS was born from the belief that sport's greatest competitive advantages are often hidden in plain sight—within data, patterns, and insights that traditional approaches overlook. Drawing inspiration from the analytics revolution that transformed global sport, we harness AI and advanced performance intelligence to enable smarter decisions, uncover untapped value, and redefine how sporting success is built.
        </p>

        <PillButton href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
          Explore Our Vision <ArrowRight size={16} />
        </PillButton>
      </motion.div>

      {/* Right: fact stack */}
      <motion.aside
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.15 }}
        aria-label="Sports technology at a glance"
        style={{ paddingTop: 'clamp(96px, 9vw, 136px)' }}
      >
        {facts.map((f) => (
          <FactRow key={f.label} label={f.label} value={f.value} sub={f.sub} voltValue={f.volt} />
        ))}
        <div style={{ borderTop: `1px solid ${T.border}` }} />
      </motion.aside>
    </section>
  );
}

// ─── Section: About ────────────────────────────────────────────────────────────

const teamMembers = [
  { name: 'Abhishek Binayykia', role: 'Founder & Chief Executive Officer', initials: 'AB' },
  { name: 'Ashish Shah', role: 'Advisor', initials: 'AS' },
  { name: 'Shweta Gandre', role: 'Director', initials: 'SG' },
  { name: 'TBD', role: 'Head of Product', initials: 'TBD' },
];

const pillars = [
  {
    icon: <Zap size={24} color={T.volt} />,
    title: 'Decision Intelligence',
    body: 'Applying the principles of modern sports analytics to uncover hidden value, evaluate opportunities, and optimize decisions across talent identification, player acquisition, performance, strategy, and commercial operations.',
  },
  {
    icon: <BarChart3 size={24} color={T.volt} />,
    title: 'Data Analytics',
    body: 'Deep statistical modelling and predictive analytics that turn raw data into decisive competitive advantage.',
  },
  {
    icon: <Users size={24} color={T.volt} />,
    title: 'Fan Engagement',
    body: 'Immersive digital experiences that deepen the connection between athletes, clubs, and their global fanbase.',
  },
  {
    icon: <Shield size={24} color={T.volt} />,
    title: 'Injury Prevention',
    body: 'Predictive health monitoring that identifies risk before it becomes injury, keeping athletes on the field.',
  },
];

function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}
    >
      {/* What We Do */}
      <div style={{ padding: 'clamp(80px, 10vw, 120px) 48px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
          style={{ marginBottom: '64px' }}
        >
          <SectionEyebrow>About Us</SectionEyebrow>
          <DisplayHeadline size="lg" style={{ marginBottom: '24px' }}>
            <span id="about-heading">What We Do</span>
          </DisplayHeadline>
          <p
            style={{
              fontFamily: T.bodyFont,
              fontSize: '16px',
              color: T.chalkSecondary,
              lineHeight: 1.7,
              maxWidth: '70ch',
            }}
          >
            PowerplAI Sports is a sports technology venture building the next generation of AI-powered tools for athletes, coaches, and sports organisations. We combine deep domain expertise in sport science with cutting-edge machine learning to deliver measurable performance gains.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2px',
            background: T.border,
            border: `1px solid ${T.border}`,
          }}
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const, delay: i * 0.08 }}
              style={{
                background: T.surface,
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: `${T.volt}18`,
                  border: `1px solid ${T.volt}40`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </div>
              <div
                style={{
                  fontFamily: T.displayFont,
                  fontSize: '22px',
                  letterSpacing: '0.01em',
                  color: T.chalk,
                  textTransform: 'uppercase' as const,
                  lineHeight: 1,
                }}
              >
                {p.title}
              </div>
              <p
                style={{
                  fontFamily: T.bodyFont,
                  fontSize: '14px',
                  color: T.chalkTertiary,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leadership Team */}
      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: 'clamp(64px, 8vw, 100px) 48px',
          background: T.surfaceBlue,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
          style={{ marginBottom: '48px' }}
        >
          <SectionEyebrow>Leadership</SectionEyebrow>
          <DisplayHeadline size="md">The Team</DisplayHeadline>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2px',
            background: `${T.blueLight}60`,
          }}
        >
          {teamMembers.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const, delay: i * 0.08 }}
              style={{
                background: T.surfaceBlue,
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderTop: `3px solid ${T.volt}`,
              }}
            >
              {/* Avatar placeholder */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${T.volt}20`,
                  border: `2px solid ${T.volt}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: T.displayFont,
                  fontSize: '22px',
                  color: T.volt,
                  letterSpacing: '0.05em',
                }}
              >
                {m.initials}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: T.displayFont,
                    fontSize: '20px',
                    letterSpacing: '0.01em',
                    color: T.chalk,
                    textTransform: 'uppercase' as const,
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontFamily: T.bodyFont,
                    fontSize: '12px',
                    fontWeight: 500,
                    color: T.chalkTertiary,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                  }}
                >
                  {m.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Products ─────────────────────────────────────────────────────────

function ProductsSection() {
  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      style={{
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
        padding: 'clamp(80px, 12vw, 140px) 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: T.displayFont,
          fontSize: 'clamp(120px, 20vw, 280px)',
          color: `${T.volt}06`,
          lineHeight: 1,
          letterSpacing: '0.01em',
          textTransform: 'uppercase' as const,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap' as const,
        }}
      >
        SOON
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}
      >
        <SectionEyebrow>Products</SectionEyebrow>
        <DisplayHeadline size="xl" color={T.chalk} style={{ marginBottom: '32px', whiteSpace: 'normal' as const }}>
          Something<br />
          <span style={{ color: T.volt }}>Powerful</span><br />
          Is Coming
        </DisplayHeadline>

        <p
          style={{
            fontFamily: T.bodyFont,
            fontSize: '18px',
            color: T.chalkSecondary,
            lineHeight: 1.7,
            maxWidth: '60ch',
            marginBottom: '48px',
          }}
        >
          We're building a suite of AI-powered sports technology products that will transform how athletes train, how coaches strategise, and how fans experience sport. Details coming soon — stay tuned.
        </p>

        {/* Teaser cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2px',
            background: T.border,
            marginBottom: '48px',
            maxWidth: '700px',
          }}
        >
          {['Decision AI', 'Analytics Suite', 'Fan Platform'].map((name) => (
            <div
              key={name}
              style={{
                background: T.surface,
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '3px',
                  background: T.volt,
                  borderRadius: '2px',
                }}
              />
              <div
                style={{
                  fontFamily: T.displayFont,
                  fontSize: '20px',
                  color: T.chalk,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontFamily: T.bodyFont,
                  fontSize: '12px',
                  color: T.chalkTertiary,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                }}
              >
                Coming Soon
              </div>
            </div>
          ))}
        </div>

        <PillButton
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Register Interest <ChevronRight size={16} />
        </PillButton>
      </motion.div>
    </section>
  );
}

// ─── Section: Contact ──────────────────────────────────────────────────────────

function ContactSection() {
  const [submitted] = useState(false);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        background: T.surfaceBlue,
        borderTop: `1px solid ${T.border}`,
        padding: 'clamp(80px, 10vw, 120px) 48px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(48px, 7vw, 96px)',
          alignItems: 'start',
        }}
      >
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          <SectionEyebrow>Contact Us</SectionEyebrow>
          <DisplayHeadline size="lg" style={{ marginBottom: '32px' }}>
            Let's Build<br />
            The Future<br />
            Together
          </DisplayHeadline>
          <p
            style={{
              fontFamily: T.bodyFont,
              fontSize: '16px',
              color: T.chalkSecondary,
              lineHeight: 1.7,
              maxWidth: '50ch',
            }}
          >
            Whether you're an athlete, a sports organisation, an investor, or a technology partner — we want to hear from you. Reach out and let's explore what's possible.
          </p>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.15 }}
        >
          {submitted ? (
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.volt}40`,
                borderRadius: '4px',
                padding: '48px 40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: T.displayFont,
                  fontSize: '32px',
                  color: T.volt,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.01em',
                  marginBottom: '12px',
                }}
              >
                Message Received
              </div>
              <p style={{ fontFamily: T.bodyFont, fontSize: '15px', color: T.chalkSecondary, lineHeight: 1.6 }}>
                Thanks for reaching out. We'll be in touch shortly.
              </p>
            </div>
          ) : (
            // <form
            //   onSubmit={handleSubmit}
            //   style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            //   noValidate
            // >
            //   <div>
            //     <label htmlFor="contact-name" style={labelStyle}>Full Name</label>
            //     <input
            //       id="contact-name"
            //       type="text"
            //       required
            //       placeholder="Your name"
            //       value={formState.name}
            //       onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            //       style={inputStyle}
            //       onFocus={(e) => (e.currentTarget.style.borderColor = T.volt)}
            //       onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            //     />
            //   </div>
            //   <div>
            //     <label htmlFor="contact-email" style={labelStyle}>Email Address</label>
            //     <input
            //       id="contact-email"
            //       type="email"
            //       required
            //       placeholder="you@example.com"
            //       value={formState.email}
            //       onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            //       style={inputStyle}
            //       onFocus={(e) => (e.currentTarget.style.borderColor = T.volt)}
            //       onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            //     />
            //   </div>
            //   <div>
            //     <label htmlFor="contact-message" style={labelStyle}>Message</label>
            //     <textarea
            //       id="contact-message"
            //       required
            //       rows={5}
            //       placeholder="Tell us about your project or enquiry…"
            //       value={formState.message}
            //       onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            //       style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '140px' }}
            //       onFocus={(e) => (e.currentTarget.style.borderColor = T.volt)}
            //       onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            //     />
            //   </div>
            //   <button
            //     type="submit"
            //     style={{
            //       display: 'inline-flex',
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //       gap: '10px',
            //       background: T.volt,
            //       border: `2px solid ${T.volt}`,
            //       color: T.bg,
            //       borderRadius: '9999px',
            //       padding: '18px 36px',
            //       fontFamily: T.bodyFont,
            //       fontWeight: 700,
            //       fontSize: '13px',
            //       textTransform: 'uppercase' as const,
            //       letterSpacing: '0.05em',
            //       cursor: 'pointer',
            //       transition: `background 150ms ${T.ease}, color 150ms ${T.ease}`,
            //       width: '100%',
            //     }}
            //     onMouseEnter={(e) => {
            //       e.currentTarget.style.background = 'transparent';
            //       e.currentTarget.style.color = T.volt;
            //     }}
            //     onMouseLeave={(e) => {
            //       e.currentTarget.style.background = T.volt;
            //       e.currentTarget.style.color = T.bg;
            //     }}
            //   >
            //     Send Message <ArrowRight size={16} />
            //   </button>
            // </form>
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${T.volt}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: T.bodyFont,
                    fontSize: '14px',
                    color: T.chalkSecondary,
                    marginTop: '8px',
                    lineHeight: 1.5,
                  }}
                >
                  For partnerships, technology enquiries, or corporate development queries, reach out directly.
                </p>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${T.border}`,
                  paddingTop: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: T.bodyFont,
                    fontSize: '12px',
                    color: T.chalkTertiary,
                    textTransform: 'lowercase' as const,
                  }}
                >
                  email address
                </span>
                <a
                  href="mailto:abhishek@powerplaisports.com"
                  style={{
                    fontFamily: 'JetBrains Mono, Consolas, monospace',
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    color: T.volt,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    transition: `color 150ms ${T.ease}, transform 150ms ${T.ease}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.chalk;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.volt;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <Mail size={18} />
                  abhishek@powerplaisports.com
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>PowerplAI Sports — The Future of Sport</title>
        <meta
          name="description"
          content="PowerplAI Sports harnesses artificial intelligence to transform athletic performance, analytics, and fan engagement. The future of sport starts here."
        />
        <meta property="og:title" content="PowerplAI Sports — The Future of Sport" />
        <meta
          property="og:description"
          content="AI-powered sports technology for athletes, coaches, and organisations. Performance intelligence, analytics, and fan engagement."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />
      <PitchSection />
      <AboutSection />
      <ProductsSection />
      <ContactSection />
    </>
  );
}
