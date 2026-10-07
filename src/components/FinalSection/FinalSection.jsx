import React from 'react';
import {wedding} from '../../config/wedding';import {Ornament} from '../shared';
export default function FinalSection(){return <footer style={{'--footer-image':`url(${wedding.images.footer})`,'--footer-mobile-image':`url(${wedding.images.footerMobile})`}}><div className="final-copy reveal"><Ornament/><h2>{wedding.finalText}</h2><p>{wedding.labels.love}</p><p className="signature">{wedding.bride} & {wedding.groom}</p><span className="heart" aria-hidden="true">♡</span></div></footer>}
