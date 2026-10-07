import React from 'react';
import {wedding, dateParts} from '../config/wedding';
export function Ornament(){return <div className="ornament" aria-hidden="true"><span/>◇<span/></div>}
export function Heading({children}){return <><h2>{children}</h2><Ornament/></>}
export function Invitation(){return <><p className="eyebrow">{wedding.labels.intro}</p><Ornament/><h1 className="names"><span>{wedding.bride}</span><em>&</em><span>{wedding.groom}</span></h1><p className="numeric-date">{dateParts().numeric}</p><p className="eyebrow wedding-day">{wedding.labels.day}</p><Ornament/><p className="invitation-text">{wedding.invitationText}</p></>}
