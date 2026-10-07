import React from 'react';
import {wedding} from '../../config/wedding';import {Invitation} from '../shared';
export default function Hero(){return <header className="hero" id="home" style={{'--hero-image':`url(${wedding.images.hero})`,'--hero-mobile-image':`url(${wedding.images.heroMobile})`}}><div className="hero-copy"><Invitation/></div><a className="scroll-cue" href="#date" aria-label="Перейти к дате свадьбы">⌄</a></header>}
