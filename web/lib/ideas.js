// Data for the /birthday-party-ideas/<city>/ pages.
// Activity groups are matched on venue categories (tags). A venue can appear in
// more than one group. Group blurbs are general descriptions of the kind of party,
// not claims about any one venue.
import { venues, getVenuesByCity, venueScore, formatDate, formatMonthYear } from './venues';
import { citySlug } from './util';

export const IDEA_CITIES = ['toronto', 'mississauga', 'vaughan', 'whitby'];

// Ideas pages that cover more than one listed city. Only these pages widen their venue set.
export const IDEA_AREAS = {
  toronto: ['Toronto', 'North York', 'Scarborough', 'East York', 'Etobicoke'],
};

// Venues for an ideas page. Toronto includes the City of Toronto areas, and each row keeps its own city.
export function ideaVenues(slug) {
  const areas = IDEA_AREAS[slug];
  if (!areas) return getVenuesByCity(slug);
  const slugs = areas.map(citySlug);
  return venues
    .filter((v) => slugs.includes(citySlug(v.city)))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.reviews - a.reviews);
}

// Distinct city names on an ideas page, in list order. Pages with one city do not show area labels.
export const ideaAreas = (slug) => [...new Set(ideaVenues(slug).map((v) => v.city))];

export const ACTIVITY_GROUPS = [
  {
    id: 'playgrounds',
    title: 'Indoor playgrounds and play centres',
    keywords: [{ word: 'indoor playground', match: /indoor playground|playground/i }, { word: 'soft play', match: /soft play/i }, { word: 'play centre', match: /play cent(re|er)/i }],
    match: /indoor playground|playground|children's club|recreation center/i,
    blurb:
      'Soft play structures, slides and climbing areas under one roof, with a private party room for food and presents. Works for mixed ages, and suits a party where the kids mostly run around.',
  },
  {
    id: 'active',
    title: 'Trampoline, gymnastics, climbing and bowling',
    keywords: [{ word: 'trampoline', match: /trampoline/i }, { word: 'gymnastics', match: /gymnastics|\bgym\b/i }, { word: 'climbing', match: /climbing/i }, { word: 'bowling', match: /bowling/i }],
    match: /trampoline|gymnastics|climbing|\bgym\b|high ropes|sports complex|bowling/i,
    blurb:
      'Timed jump sessions, climbing walls or lanes, usually run by staff who brief the group on the rules first. A good match for kids who want to be active and for groups old enough to follow a safety briefing.',
  },
  {
    id: 'arcade',
    title: 'Laser tag, VR and arcades',
    keywords: [{ word: 'laser tag', match: /laser tag/i }, { word: 'vr', match: /\bvr\b|virtual reality/i }, { word: 'arcade', match: /arcade/i }],
    match: /laser tag|video arcade|virtual reality|\bvr\b/i,
    blurb:
      'Game-based parties with timed sessions and game credits. Many kids in this group are school age or older. Check whether the package includes food and whether the venue has adult areas.',
  },
  {
    id: 'arts',
    title: 'Arts, crafts and pottery',
    keywords: [{ word: 'pottery', match: /pottery|ceramic/i }, { word: 'painting', match: /painting/i }, { word: 'arts and crafts', match: /arts? and crafts?/i }, { word: 'craft', match: /\bcraft/i }],
    match: /art studio|art school|art cafe|art center|pottery|painting studio|ceramic/i,
    blurb:
      'Kids paint, make something or throw pottery, and take their work home. A calmer option for smaller groups and for kids who prefer making to running around.',
  },
  {
    id: 'entertainers',
    title: 'Entertainers and performers',
    keywords: [{ word: 'magician', match: /magician/i }, { word: 'entertainer', match: /entertainer/i }, { word: 'balloons', match: /balloon/i }, { word: 'bouncy castle', match: /bouncy castle/i }],
    match: /entertainer|magician|balloon artist|bouncy castle|party equipment/i,
    blurb:
      'A performer runs the games, magic or characters, so the host has less to set up. Ask whether the performer travels to your home or to a rented hall, and what equipment is included.',
  },
  {
    id: 'amusement',
    title: 'Amusement parks and attractions',
    keywords: [{ word: 'amusement park', match: /amusement park/i }, { word: 'rides', match: /\brides?\b/i }],
    match: /amusement park|tourist attraction/i,
    blurb:
      'Rides, themed attractions or a large indoor destination with party packages. Visits are longer and busier than a party room, so plan for the day.',
  },
  {
    id: 'food-play',
    title: 'Family restaurants and play cafes',
    // Anchored so that "Art cafe" stays in the arts group.
    keywords: [{ word: 'restaurant', match: /restaurant/i }, { word: 'pizza', match: /pizza/i }, { word: 'cafe', match: /\bcafe\b/i }],
    match: /^(family restaurant|pizza[a-z ]*|coffee shop|cafe)$/i,
    blurb:
      'A party where food is part of the package, usually with a play area close to the table. A simpler option for younger kids. Confirm what food and drink the package includes.',
  },
  {
    id: 'animals',
    title: 'Animals, reptiles and hands-on science',
    keywords: [{ word: 'animals', match: /animal/i }, { word: 'reptiles', match: /reptile/i }, { word: 'zoo', match: /\bzoo\b/i }],
    match: /zoo|reptile|animal/i,
    blurb:
      'Visits with animals or live demonstrations. Handling rules and group sizes differ by venue, so ask before you book.',
  },
  {
    id: 'spa',
    title: 'Spa and beauty parties',
    keywords: [{ word: 'spa', match: /\bspa\b/i }, { word: 'makeup', match: /make-?up/i }, { word: 'pamper', match: /pamper/i }],
    match: /\bspa\b/i,
    blurb:
      'Themed spa or beauty parties for younger girls and tweens, with hosted activities such as crafts and treatments. Check the age range the venue lists.',
  },
];

// Age bands. A venue appears under a band only when its own listing text (summary,
// overview or party details) states an age range or age wording that covers that band.
// Each row is checked at render time: if the quoted phrase is not in the venue's text,
// the row is ignored, so stale editorial rows drop out instead of showing unsupported ages.
export const AGE_BANDS = [
  { id: 'toddlers', title: 'Toddlers (1 to 4)' },
  { id: 'kids', title: 'Kids (5 to 9)' },
  { id: 'tweens', title: 'Tweens and teens (10 and up)' },
];

export const AGE_EVIDENCE = [
  { slug: 'krafty-kids-corporate-holiday-parties-creative-kids-events', band: 'toddlers', phrase: 'Toddler art parties are for ages 18 months to 3 years' },
  { slug: 'bloom-grow-play-space', band: 'toddlers', phrase: 'for children ages 0 to 5' },
  { slug: 'mighty-jungle-indoor-playground', band: 'toddlers', phrase: 'best suited for children ages 1 to 10' },
  { slug: 'mighty-jungle-indoor-playground', band: 'kids', phrase: 'best suited for children ages 1 to 10' },
  { slug: 'funday-family-centre-indoor-playground', band: 'toddlers', phrase: 'ages 0 to 12' },
  { slug: 'funday-family-centre-indoor-playground', band: 'kids', phrase: 'ages 0 to 12' },
  { slug: 'funday-family-centre-indoor-playground', band: 'tweens', phrase: 'ages 0 to 12' },
  { slug: 'magic-moments-playground-birthday-parties', band: 'toddlers', phrase: 'aged 6 months to 17' },
  { slug: 'magic-moments-playground-birthday-parties', band: 'kids', phrase: 'aged 6 months to 17' },
  { slug: 'magic-moments-playground-birthday-parties', band: 'tweens', phrase: 'aged 6 months to 17' },
  { slug: 'legoland-discovery-centre-toronto', band: 'kids', phrase: 'for children ages 3 to 10' },
  { slug: 'aspire-climbing-whitby', band: 'kids', phrase: 'Birthday parties for children ages 6 to 12' },
  { slug: 'aspire-climbing-whitby', band: 'tweens', phrase: 'Birthday parties for children ages 6 to 12' },
  { slug: 'pixel-pulse-playzone', band: 'kids', phrase: 'aimed at kids 7 and up' },
  { slug: 'pixel-pulse-playzone', band: 'tweens', phrase: 'no upper age limit' },
  { slug: 'artventures-toronto-parliament', band: 'tweens', phrase: 'tween parties and sweet 16 parties' },
  { slug: 'glama-gal-kids-spa-vaughan', band: 'tweens', phrase: "kids' and tween spa" },
  { slug: 'the-rec-room-roundhouse', band: 'tweens', phrase: 'Kids & Teens birthday packages' },
];

const venueText = (v) => [v.summary, v.overview, v.partyDetails].filter(Boolean).join(' | ');

export const venueAgeBands = (v) => {
  const text = venueText(v).toLowerCase();
  return AGE_EVIDENCE.filter(
    (e) => e.slug === v.slug && text.includes(e.phrase.toLowerCase())
  ).map((e) => e.band);
};

// Groups a city's venues by activity. Returns only groups with at least one venue.
export function ideaGroups(citySlug) {
  const list = ideaVenues(citySlug).sort((a, b) => venueScore(b) - venueScore(a));
  return ACTIVITY_GROUPS.map((g) => ({
    ...g,
    venues: list.filter((v) => (v.tags || []).some((t) => g.match.test(t))),
  })).filter((g) => g.venues.length > 0);
}

// Facts for a city, all computed from venue rows.
export function cityFacts(citySlug) {
  const list = ideaVenues(citySlug);
  const priced = list.filter((v) => v.fromPrice).sort((a, b) => a.fromPrice - b.fromPrice);
  const sizes = list
    .map((v) => ({ v, m: /up to (\d+) kids/i.exec(v.partyDetails || '') }))
    .filter((x) => x.m)
    .map((x) => ({ v: x.v, n: parseInt(x.m[1], 10) }))
    .sort((a, b) => a.n - b.n);
  const dates = list.map((v) => v.lastVerified).filter(Boolean).sort();
  const lastIso = dates.length ? dates[dates.length - 1] : null;
  const indoorGroups = new Set(['playgrounds', 'active', 'arcade']);
  const indoor = ideaGroups(citySlug).filter((g) => indoorGroups.has(g.id));
  const indoorVenues = new Set(indoor.flatMap((g) => g.venues.map((v) => v.slug)));
  return {
    count: list.length,
    priced,
    sizes,
    lastIso,
    lastLabel: formatDate(lastIso),
    monthYear: formatMonthYear(lastIso),
    indoorCount: indoorVenues.size,
  };
}

export const ageVenues = (citySlug, band) =>
  ideaVenues(citySlug).filter((v) => venueAgeBands(v).includes(band));

const AGE_WORDS = { toddlers: 'toddler', kids: 'kids', tweens: 'teens' };

// Search words for one venue: the keyword words its own text supports, age words from
// validated AGE_EVIDENCE rows only, and budget words for the lowest price bucket.
// Group titles are not included, so a title such as "Laser tag, VR and arcades" cannot
// make every arcade match a "laser tag" search.
export function ideaSearchTerms(venue) {
  const tags = venue.tags || [];
  const text = [venue.name, ...tags, venue.summary, venue.overview, venue.partyDetails]
    .filter(Boolean)
    .join(' | ');
  const out = new Set();
  // Each keyword is checked against the venue's own text, whatever group its category falls in.
  for (const g of ACTIVITY_GROUPS) {
    g.keywords.filter((k) => k.match.test(text)).forEach((k) => out.add(k.word));
  }
  venueAgeBands(venue).forEach((band) => {
    if (AGE_WORDS[band]) out.add(AGE_WORDS[band]);
  });
  if (venue.priceBucket === '<250') {
    out.add('cheap');
    out.add('budget');
  }
  return [...out];
}

// Idea tags for one venue: the title of each activity group it matches, plus the search terms.
export function ideaTagsFor(venue) {
  const tags = venue.tags || [];
  const titles = ACTIVITY_GROUPS.filter((g) => tags.some((t) => g.match.test(t))).map((g) =>
    g.title.toLowerCase()
  );
  return [...titles, ...ideaSearchTerms(venue)];
}
