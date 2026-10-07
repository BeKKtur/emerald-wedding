import React from 'react';
import {wedding,photos} from '../../config/wedding';import {Heading} from '../shared';
export default function Gallery(){return <section className="emerald gallery-section" id="gallery"><div className="section-inner reveal"><Heading>{wedding.labels.gallery}</Heading><div className="gallery">{photos.map(photo=><figure key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" width="1254" height="1254" decoding="async"/></figure>)}</div><div className="gallery-decoration" aria-hidden="true">· ◇ ·</div></div></section>}
