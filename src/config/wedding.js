// ========================================
// ДАННЫЕ КЛИЕНТА — МЕНЯТЬ ВСЁ ЗДЕСЬ
// ========================================
import hero from '../assets/images/garden-hd.webp';
import gardenMobile from '../assets/images/garden-mobile-hd.webp';
import footer from '../assets/images/garden-hd.webp';
import venuePhoto from '../assets/images/venue-hd.webp';
import velvet from '../assets/images/velvet-hd.webp';
import botanical from '../assets/images/paper-hd.webp';
import flowers from '../assets/images/flowers-hd.webp';
import table from '../assets/images/table-hd.webp';
import rings from '../assets/images/rings-hd.webp';
import paper from '../assets/images/paper-hd.webp';
export const wedding = {
  bride: 'Amina', groom: 'Mirlan',
  // ISO-дата управляет календарём, датой и днём недели автоматически.
  date: '2026-10-15',
  guestTime: '16:00', ceremonyTime: '17:00', endTime: '23:00',
  venue: 'Riviera Hall', address: 'г. Алматы, ул. Достык, 210',
  mapUrl: 'https://2gis.kz/almaty/search/Достык%20210',
  invitationText: 'Мы будем счастливы разделить этот особенный день вместе с вами.',
  finalText: 'Будем счастливы\nвидеть вас!',
  venueText: 'Пространство, где сбываются красивые истории.',
  venuePhotoAlt: 'Атмосферная иллюстрация свадебной террасы и ресторана',
  labels: {intro: 'Мы женимся', day: 'Wedding Day', open: 'Нажмите, чтобы открыть приглашение', date: 'Дата нашей свадьбы', timeline: 'Программа дня', venue: 'Место проведения', gallery: 'Атмосфера нашего дня', map: 'Открыть в 2ГИС', love: 'С любовью,'},
  program: [
    {timeKey: 'guestTime', title: 'Сбор гостей', description: 'Приветственный фуршет, знакомства и тёплая атмосфера.', icon: 'glasses'},
    {timeKey: 'ceremonyTime', title: 'Начало торжества', description: 'Церемония, банкет и самые трогательные моменты.', icon: 'rings'},
    {timeKey: 'endTime', title: 'Завершение вечера', description: 'Танцы, улыбки и незабываемые эмоции.', icon: 'party'},
  ],
  images: {hero, heroMobile: gardenMobile, footer, footerMobile: gardenMobile, venue: venuePhoto, velvet, botanical, paper},
};
export const photos = [
  {src: flowers, alt: 'Белые цветы и зелень в свадебной композиции'},
  {src: table, alt: 'Праздничная сервировка со свечами'},
  {src: rings, alt: 'Золотые свадебные кольца на шёлке с белыми цветами'},
];
export function dateParts() {
  const [year, month, day] = wedding.date.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return {date, year, month, day, monthName: date.toLocaleDateString('ru-RU', {month: 'long'}), weekday: date.toLocaleDateString('ru-RU', {weekday: 'long'}), numeric: `${String(day).padStart(2, '0')} · ${String(month).padStart(2, '0')} · ${year}`};
}
