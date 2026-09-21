export const SITE_NAME = 'Luxury Duo Cleaning LLC';
export const PHONE_DISPLAY = '(407) 555-1234';
export const PHONE_HREF = 'tel:+14075551234';
export const EMAIL = 'info@luxuryduocleaning.com';
export const AREA = 'Serving Any Area in Central Florida';
export const HOURS = 'Mon — Sat: 7AM — 7PM';
export const INSTAGRAM = '#';

export function link(path: string): string {
  const base: string = import.meta.env.BASE_URL;
  return base + path.replace(/^\//, '');
}
