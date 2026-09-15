export interface Service {
  slug: string;
  title: string;
  desc: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}

export const FLAGSHIP_SLUG = 'construction';

export const SERVICES: Service[] = [
  {
    slug: 'construction',
    title: 'Pre & Post-Construction Cleaning',
    desc: 'Built for contractor schedules: we prep sites before work begins and deliver the final-detail polish that gets your project signed off on the walkthrough.',
    bullets: [
      'Construction debris removal and disposal',
      'Dust, dirt, and residue cleanup on all surfaces',
      'Window, fixture, and hardware detailing',
      'Floor care — tile, concrete, hardwood, carpet',
      'Final punch-list cleaning for project walkthrough',
    ],
    image: 'draft/construction.svg',
    imageAlt: 'Post-construction cleaning crew detailing a newly built Orlando property',
  },
  {
    slug: 'commercial',
    title: 'Commercial Cleaning',
    desc: 'Offices, retail spaces, warehouses, and facilities cleaned on your schedule with zero disruption to your operations.',
    bullets: [
      'Daily, weekly, and custom cleaning schedules',
      'Restroom, breakroom, and common area sanitization',
      'Floor care — vacuuming, mopping, carpet cleaning',
      'Trash removal and recycling management',
    ],
    image: 'draft/commercial.svg',
    imageAlt: 'Professional commercial office cleaning in Orlando FL',
  },
  {
    slug: 'residential',
    title: 'Residential Cleaning',
    desc: 'Your home deserves more than a surface wipe — every room covered with the same meticulous standard we bring to commercial and construction jobs.',
    bullets: [
      'Recurring weekly, bi-weekly, or monthly service',
      'Kitchen and bathroom deep sanitization',
      'Dusting, vacuuming, mopping all surfaces',
      'Custom checklist to match your priorities',
    ],
    image: 'draft/residential.svg',
    imageAlt: 'Residential home cleaning service in Orlando FL',
  },
  {
    slug: 'airbnb',
    title: 'Airbnb & Vacation Rental Cleaning',
    desc: 'Guest expectations are high and turnover windows are tight — fast, thorough cleans that earn five-star reviews and keep your listing competitive.',
    bullets: [
      'Same-day turnovers available',
      'Linen replacement and bed-making',
      'Kitchen and bathroom sanitization',
      'Restocking supplies and guest-ready presentation',
    ],
    image: 'draft/airbnb.svg',
    imageAlt: 'Airbnb vacation rental turnover cleaning in Orlando FL',
  },
  {
    slug: 'movein',
    title: 'Move-In / Move-Out Cleaning',
    desc: "Moving is stressful enough — we handle the cleaning so you don't have to, whether you're leaving a spotless impression or starting fresh.",
    bullets: [
      'Full top-to-bottom deep clean',
      'Inside cabinets, closets, and appliances',
      'Baseboard, window, and fixture detailing',
      'Deposit-ready or move-in-ready standards',
    ],
    image: 'draft/movein.svg',
    imageAlt: 'Move-in move-out cleaning service in Orlando FL',
  },
  {
    slug: 'deep',
    title: 'Deep Cleaning',
    desc: "When a standard clean isn't enough — intensive top-to-bottom service that tackles buildup, grime, and the hidden areas regular cleaning misses.",
    bullets: [
      'Intensive scrubbing of all surfaces',
      'Behind and under furniture and appliances',
      'Grout, tile, and hard-water stain treatment',
      'Top-to-bottom detail in every room',
    ],
    image: 'draft/deep.svg',
    imageAlt: 'Deep cleaning service detailing a kitchen in Orlando FL',
  },
];
