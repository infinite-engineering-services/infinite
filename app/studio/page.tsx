import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Studio from "./studio";

export const metadata: Metadata = {
  title: "Render studio",
  robots: { index: false, follow: false },
};

/** Dev-only: renders scenes for `npm run capture`. Returns 404 in production. */
export default function StudioPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Studio />;
}
