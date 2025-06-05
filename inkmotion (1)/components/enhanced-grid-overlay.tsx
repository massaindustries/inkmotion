"use client"

export function EnhancedGridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Radial gradient mask for the grid */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          mask: "radial-gradient(ellipse at center, black 0%, transparent 40%)",
          WebkitMask: "radial-gradient(ellipse at center, black 0%, transparent 40%)",
        }}
      />

      {/* Additional subtle grid overlay */}
      <div
        className="w-full h-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  )
}
