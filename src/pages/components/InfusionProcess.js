"use client";

const steps = [
  { id: "01", title: "Drink R & D", angle: -90 },
  { id: "02", title: "Branding", angle: -210 },
  { id: "03", title: "Retail Formats", angle: -270 },
  { id: "04", title: "Compliance", angle: -330 },
  { id: "05", title: "Manufacturing & Packaging", angle: -30 },
];

export default function InfusionProcess() {
  const centerX = 400;
  const centerY = 300;
  const radius = 200;

  return (
    <div className="w-full flex justify-center items-center py-10 bg-gray-100">
      <svg viewBox="0 0 800 600" className="w-full max-w-[900px] h-auto">

        {/* OUTER DASHED CIRCLE */}
        <circle
          cx={centerX}
          cy={centerY}
          r="120"
          fill="none"
          stroke="#166534"
          strokeDasharray="6,6"
          strokeWidth="2"
        />

        {/* INNER CIRCLE */}
        <circle
          cx={centerX}
          cy={centerY}
          r="90"
          fill="white"
          stroke="#166534"
          strokeWidth="2"
        />

        {/* CENTER TEXT */}
        <text x={centerX} y={centerY - 5} textAnchor="middle" fontSize="22" fill="#166534" fontWeight="bold">
          DS
        </text>
        <text x={centerX} y={centerY + 20} textAnchor="middle" fontSize="14" fill="#166534">
          BAVERAGES
        </text>

        {/* STEPS */}
        {steps.map((step, i) => {
          const rad = (step.angle * Math.PI) / 180;

          const x = centerX + radius * Math.cos(rad);
          const y = centerY + radius * Math.sin(rad);

          return (
            <g key={i} transform={`translate(${x}, ${y})`}>

              {/* BUBBLE */}
              <rect
                x="-110"
                y="-30"
                width="220"
                height="60"
                rx="30"
                fill="#166534"
              />

              {/* TEXT */}
              <text x="-90" y="-5" fill="white" fontSize="12">
                {step.id}.
              </text>
              <text x="-90" y="15" fill="white" fontSize="14" fontWeight="bold">
                {step.title}
              </text>

              {/* ICON CIRCLE */}
              <circle cx="80" cy="0" r="22" fill="white" />

            </g>
          );
        })}
      </svg>
    </div>
  );
}

