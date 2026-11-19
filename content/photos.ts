/**
 * Stock photography from Unsplash (Unsplash License: free for commercial use).
 * Used for atmosphere only: never captioned as a client project.
 * Sources live in scripts/photo-src; `npm run photos` rebuilds public/photos.
 */
export const photos = {
  scanner: {
    alt: "Terrestrial laser scanner on a tripod",
    credit: "Scott Blake",
    href: "https://unsplash.com/photos/1GW45VDkFI0",
  },
  surveyor: {
    alt: "Surveyor setting up a total station in the field",
    credit: "Nazmul Ahsan Meraz",
    href: "https://unsplash.com/photos/OIZPlqDEbPM",
  },
  pipeline: {
    alt: "Excavator laying a pipeline in an open trench",
    credit: "Roman Pentin",
    href: "https://unsplash.com/photos/T5QT2bmiD4E",
  },
  plant: {
    alt: "Pipework and valves inside an industrial plant",
    credit: "Ricardo Gomez Angel",
    href: "https://unsplash.com/photos/41X6FwTwPh4",
  },
  "design-team": {
    alt: "Engineers reviewing a building model on two monitors",
    credit: "Evgeniy Surzhan",
    href: "https://unsplash.com/photos/VFMhqkiL6E4",
  },
  "city-delhi": {
    alt: "Aerial view of high-rise buildings in Delhi",
    credit: "Anish Kumar",
    href: "https://unsplash.com/photos/WOMh7plpdVc",
  },
  "city-kolkata": {
    alt: "Aerial view of Kolkata with a park and a metro corridor",
    credit: "Rahul Chakraborty",
    href: "https://unsplash.com/photos/Y-jzNrG-_60",
  },
} as const;

export type PhotoName = keyof typeof photos;
