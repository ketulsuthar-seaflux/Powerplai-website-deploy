import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * PowerplAI Sports — fixed nav header
 * Transparent over hero, solid once scrolled past hero.
 * Smooth-scroll anchors for single-page layout.
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    function onScroll() {
      if (!hero) {
        setIsScrolled(window.scrollY > 80);
        return;
      }
      const bottom = hero.getBoundingClientRect().bottom;
      setIsScrolled(bottom <= 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#products', label: 'Products' },
    { href: '#contact', label: 'Contact Us' },
  ];

  function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileOpen(false);
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 48px)',
        background: isScrolled ? 'rgba(13,13,13,0.96)' : 'rgba(13,13,13,0)',
        borderBottom: isScrolled
          ? '1px solid #2A2A2A'
          : '1px solid transparent',
        backdropFilter: isScrolled ? 'blur(4px)' : 'none',
        transition:
          'background 300ms cubic-bezier(0.4,0,0.2,1), border-color 300ms cubic-bezier(0.4,0,0.2,1)',
      }}
      aria-label="Main navigation"
    >
      {/* Logo — transparent PNG, constrained so it never overlaps nav */}
      <a
        href="#hero"
        onClick={(e) => scrollTo(e, '#hero')}
        style={{
          textDecoration: 'none',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="PowerplAI Sports home"
      >
        <img
          src="/airo-assets/images/logo/horizontal"
          alt="PowerplAI Sports — Unlocking Sports Intelligence"
          style={{
            height: 'clamp(28px, 4vw, 36px)',
            width: 'auto',
            maxWidth: '160px',
            objectFit: 'contain',
            objectPosition: 'left center',
            display: 'block',
            flexShrink: 0,
          }}
        />
      </a>

      {/* Desktop nav */}
      <nav
        className="hidden md:flex"
        style={{ alignItems: 'center', gap: '36px' }}
        aria-label="Site sections"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => scrollTo(e, link.href)}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#d4d4d4',
              textDecoration: 'none',
              transition: 'color 150ms cubic-bezier(0.4,0,0.2,1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#d4d4d4')}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <a
        href="#contact"
        onClick={(e) => scrollTo(e, '#contact')}
        className="hidden md:inline-flex"
        style={{
          alignItems: 'center',
          background: 'transparent',
          border: '2px solid #FF6B00',
          color: '#FF6B00',
          borderRadius: '9999px',
          padding: '10px 22px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition:
            'background 150ms cubic-bezier(0.4,0,0.2,1), color 150ms cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FF6B00';
          e.currentTarget.style.color = '#0D0D0D';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#FF6B00';
        }}
      >
        Get in Touch
      </a>

      {/* Mobile toggle */}
      <button
        className="md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileOpen}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#ffffff',
          padding: '8px',
        }}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(13,13,13,0.98)',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            gap: '32px',
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#d4d4d4',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '2px solid #FF6B00',
              color: '#FF6B00',
              borderRadius: '9999px',
              padding: '14px 28px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              marginTop: '8px',
            }}
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
}
