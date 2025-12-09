"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface ServicesChartProps {
  flightbookings: number
  umrahbookings: number
  carbookings: number
  hotelBookings: number
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-bold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ServicesChart({
  flightbookings,
  umrahbookings,
  carbookings,
  hotelBookings,
}: ServicesChartProps) {
  // Calculate total bookings
  const total = flightbookings + umrahbookings + carbookings + hotelBookings

  // ✅ Avoid division by zero
  if (total === 0) return <div className="text-center text-gray-500">No data available</div>

  // ✅ Keep `value` as a number (not string)
  const data = [
    {
      name: "Flights",
      value: (flightbookings / total) * 100,
      color: "#08428d",
      gradient: "from-[#08428d] to-[#0066cc]",
      count: flightbookings,
    },
    {
      name: "Hotels",
      value: (hotelBookings / total) * 100,
      color: "#10b981",
      gradient: "from-emerald-400 to-emerald-600",
      count: hotelBookings,
    },
    {
      name: "Cars",
      value: (carbookings / total) * 100,
      color: "#f59e0b",
      gradient: "from-amber-400 to-amber-600",
      count: carbookings,
    },
    {
      name: "Umrah",
      value: (umrahbookings / total) * 100,
      color: "#8b5cf6",
      gradient: "from-violet-400 to-violet-600",
      count: umrahbookings,
    },
  ]

  return (
    <div className="h-[400px] w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 rounded-2xl"></div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine
            label={renderCustomizedLabel}
            innerRadius={50}
            outerRadius={155}
            paddingAngle={3}
            dataKey="value"
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(16px)",
              padding: "16px",
            }}
            formatter={(value: any, name: any, props: any) => [
              <span key="value" className="font-bold">
                {`${value.toFixed(1)}% (${props.payload.count} bookings)`}
              </span>,
              <span key="name" className="font-semibold">
                {name}
              </span>,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend Section */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={`relative overflow-hidden flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${item.gradient} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 group cursor-pointer border border-white/20 shadow-lg hover:shadow-xl`}
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div
                className="w-5 h-5 rounded-full shadow-lg ring-2 ring-white"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {item.name}
                </span>
                <div className="text-xs text-gray-600 font-medium">{item.count} bookings</div>
              </div>
            </div>
            <div className="relative z-10">
              <span className="font-black text-lg text-gray-900 bg-white/80 px-3 py-1 rounded-xl shadow-sm">
                {item.value.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
