export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We've used Luxury Duo for three post-construction cleanups now. They're fast, thorough, and they actually understand what a jobsite needs. Always on schedule.",
    name: 'Jake Rivera',
    role: 'Rivera General Contracting',
    initials: 'JR',
  },
  {
    quote:
      "Our Airbnb guests consistently mention how clean the place is. Luxury Duo handles turnovers quickly and we haven't had a single complaint since switching.",
    name: 'Maria Perez',
    role: 'Vacation Rental Owner, Kissimmee',
    initials: 'MP',
  },
  {
    quote:
      "Best commercial cleaning crew we've hired in Orlando. Professional, reliable, and their attention to detail is unmatched. Highly recommend for any business.",
    name: 'Derek Kim',
    role: 'Facility Manager, Orlando Business Park',
    initials: 'DK',
  },
  {
    quote:
      'They cleaned our entire house before we moved in and it felt brand new. Every cabinet, every closet, every window track. Worth every penny.',
    name: 'Sarah Lawson',
    role: 'Homeowner, Winter Park',
    initials: 'SL',
  },
  {
    quote:
      "Our office building requires nightly cleaning and Luxury Duo has been flawless for over a year. They're part of the team at this point.",
    name: 'Angela Torres',
    role: 'Office Manager, Downtown Orlando',
    initials: 'AT',
  },
  {
    quote:
      'We needed a deep clean before listing our home for sale. The team was incredible — the house looked better than when we first moved in. Our realtor was impressed.',
    name: 'Carlos Mendez',
    role: 'Homeowner, Lake Nona',
    initials: 'CM',
  },
];
