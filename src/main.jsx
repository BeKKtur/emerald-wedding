import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import Envelope from './components/Envelope/Envelope';
import Hero from './components/Hero/Hero';
import WeddingDate from './components/WeddingDate/WeddingDate';
import Timeline from './components/Timeline/Timeline';
import Venue from './components/Venue/Venue';
import Gallery from './components/Gallery/Gallery';
import FinalSection from './components/FinalSection/FinalSection';
import {wedding} from './config/wedding';
import './styles/main.css';
import './styles/envelope.css';
import './styles/refinements.css';

function App() {
  const [transitioning, setTransitioning] = useState(false);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    document.title = `${wedding.bride} & ${wedding.groom} — свадебное приглашение`;
    document.querySelector('meta[name="description"]').content = wedding.invitationText;
    document.body.style.overflow = ready ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [ready]);
  useEffect(() => {
    if (!transitioning) return;
    const groups = document.querySelectorAll('.reveal');
    const targets = [];
    groups.forEach(group => {
      group.classList.add('reveal-group');
      // Reveal each visual part in place, with a quiet stagger within its section.
      const children = group.querySelectorAll('h2, .ornament, .large-date, .calendar, .timeline-item, .venue-copy h3, .venue-copy > p, .map-button, .venue-photo, .gallery figure, .final-copy > p, .heart');
      children.forEach((child, i) => {
        child.classList.add('reveal-item');
        child.style.setProperty('--reveal-delay', `${Math.min(i, 4) * 85}ms`);
        targets.push(child);
      });
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: .12});
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [transitioning]);
  return <>
    {!ready && <Envelope onTransition={() => setTransitioning(true)} onComplete={() => setReady(true)} />}
    <main inert={!ready ? true : undefined} aria-hidden={!ready} className={`site ${transitioning ? 'is-entering' : ''} ${ready ? 'ready' : ''}`} style={{'--botanical': `url(${wedding.images.botanical})`}}>
      <nav>
        <a className="monogram" href="#home">{wedding.bride[0]} & {wedding.groom[0]}</a>
        <button className="menu-toggle" aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)} aria-label="Меню">{menu ? '×' : '☰'}</button>
        <div id="navigation" className={menu ? 'navigation open' : 'navigation'}>
          {[['date', wedding.labels.date], ['program', wedding.labels.timeline], ['venue', wedding.labels.venue], ['gallery', wedding.labels.gallery]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
        </div>
      </nav>
      <Hero /><WeddingDate /><Timeline /><Venue /><Gallery /><FinalSection />
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
