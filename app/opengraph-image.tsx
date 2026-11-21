import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.name}: Scan. Model. Map.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/infinite-logo-dark.png"))).toString("base64")}`;
  const bars = [
    ["#FF5A3C", "SCAN"],
    ["#5CC8D7", "MODEL"],
    ["#F2C230", "MAP"],
  ];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0E1411",
        color: "#EDEFE6",
        padding: 72,
        backgroundImage:
          "linear-gradient(to right, #1E2823 1px, transparent 1px), linear-gradient(to bottom, #1E2823 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
        <img src={logo} alt="" width={262} height={124} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 90,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#FF5A3C" }}>Scan.</span>
        <span style={{ color: "#5CC8D7" }}>Model.</span>
        <span style={{ color: "#F2C230" }}>Map.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ fontSize: 26, color: "#9AA59C", maxWidth: 760 }}>
          Laser scanning · Scan-to-BIM · CAD · GIS · Gas pipeline &amp; CGD
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {bars.map(([c, l]) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                color: "#9AA59C",
              }}
            >
              <div style={{ width: 28, height: 6, background: c }} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
