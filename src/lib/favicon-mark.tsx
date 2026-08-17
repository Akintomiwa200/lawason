import type { CSSProperties } from "react";

const plate = "#16a34a";
const lampBody = "#0a0a0a";
const lampCore = "#ffffff";

export function FaviconMark({
  size,
  rounded = true,
}: {
  size: number;
  rounded?: boolean;
}) {
  const u = size / 32;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: plate,
        borderRadius: rounded ? Math.round(8 * u) : 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={
          {
            position: "absolute",
            top: `${7.2 * u}px`,
            width: `${22 * u}px`,
            height: `${22 * u}px`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.06) 100%)",
            clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
          } as CSSProperties
        }
      />
      <div
        style={{
          position: "absolute",
          top: `${5.2 * u}px`,
          width: `${9.2 * u}px`,
          height: `${9.2 * u}px`,
          borderRadius: 999,
          background: lampBody,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: `${3.4 * u}px`,
            height: `${3.4 * u}px`,
            borderRadius: 999,
            background: lampCore,
          }}
        />
      </div>
    </div>
  );
}
