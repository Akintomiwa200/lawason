import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 8,
          color: "#16a34a",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        GM
      </div>
    ),
    size,
  );
}
