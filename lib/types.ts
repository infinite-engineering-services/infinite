import type { PhotoName } from "@/content/photos";

/** Pipeline stage, also the stage colour. `build` is the technology family. */
export type Stage = "scan" | "model" | "map" | "build";

export type ServiceGroup = "engineering" | "technology";

/** Original line illustrations in components/brand/service-art.tsx. */
export type ArtName =
  | "steel"
  | "cad3d"
  | "asbuilt"
  | "photogrammetry"
  | "lidar"
  | "utility"
  | "telecom"
  | "cyclone"
  | "web"
  | "mobile"
  | "iot"
  | "sap"
  | "sas"
  | "ai"
  | "cloud"
  | "security"
  | "testing"
  | "marketing"
  | "game"
  | "xr";

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
  | "network"
  | "camera"
  | "mountain"
  | "box"
  | "beam"
  | "tornado"
  | "plug"
  | "tower"
  | "code"
  | "smartphone"
  | "cpu"
  | "gamepad"
  | "glasses"
  | "brain"
  | "chart"
  | "database"
  | "cloud"
  | "shield"
  | "bug"
  | "megaphone"
  | "factory"
  | "pickaxe"
  | "landmark";

export interface Service {
  slug: string;
  group: ServiceGroup;
  /** Category within the group (menus, index, atlas). */
  category: string;
  stage: Stage;
  icon: IconName;
  title: string;
  /** Short name for menus, footer and the atlas. */
  label: string;
  short: string;
  summary: string;
  deliverables: string[];
  inputs: string[];
  outputs: string[];
  software: string[];
  accuracy: string;
  turnaround: string;
  keywords: string[];
  /** Every offering in this service, grouped. Rendered as the "Full scope" section. */
  scope?: { title: string; items: string[] }[];
  /** Typical applications and sectors. */
  applications?: string[];
  /** Key-facts strip; defaults to accuracy / turnaround / software. */
  facts?: [string, string][];
  /** Deliverable image: a render in public/renders or an SVG in public/art. */
  media?: { src: string; alt: string; svg?: boolean };
  /** Line illustration used when there is no render. */
  art?: ArtName;
  /** Stock photo for the service page hero (atmosphere only). */
  photo?: PhotoName;
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

