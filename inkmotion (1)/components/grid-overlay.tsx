"use client"

export function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="w-full h-full opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
