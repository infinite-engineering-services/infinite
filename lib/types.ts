import type { PhotoName } from "@/content/photos";

export type Stage = "scan" | "model" | "map";

export type IconName =
  | "scan"
  | "drafting"
  | "cuboid"
  | "map"
  | "layers"
  | "flame"
  | "building"
  | "globe"
  | "radar"
  | "network";

export interface Service {
  slug: string;
  stage: Stage;
  icon: IconName;
  title: string;
  short: string;
  summary: string;
  deliverables: string[];
  inputs: string[];
  outputs: string[];
  software: string[];
  accuracy: string;
  turnaround: string;
  keywords: string[];
  /** Deliverable image: a render in public/renders or an SVG in public/art. */
  media: { src: string; alt: string; svg?: boolean };
  /** Stock photo for the service page hero (atmosphere only). */
  photo: PhotoName;
  placeholder?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  sector: string;
  location: string;
  stages: Stage[];
  services: string[]; // service slugs
  scope: string;
  metric: { label: string; value: string };
  software: string[];
  turnaround: string;
  summary: string;
  challenge: string;
  approach: string[];
  results: string[];
  specs: { label: string; value: string }[];
  art: "facade" | "plan" | "network" | "hca" | "hospital" | "city";
  placeholder?: boolean;
}

export interface Industry {
  slug: string;
  name: string;
  icon: IconName;
  featured?: boolean;
  pitch: string;
  points: string[];
  services: string[];
  photo: PhotoName;
}

export interface Testimonial {
  quote: string;
  role: string;
  org: string;
  placeholder?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

