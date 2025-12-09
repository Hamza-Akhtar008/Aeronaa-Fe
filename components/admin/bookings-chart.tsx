"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

type MonthRevenue = {
  month: string
  totalAmount: string
}

interface RevenueChartProps {
  monthRevenue: MonthRevenue[] | null | undefined
}

export default function RevenueChart({ monthRevenue }: RevenueChartProps) {
  try {
    // Handle null/undefined/empty
    if (!monthRevenue || monthRevenue.length === 0) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-2xl">
          <p className="text-gray-500 font-medium">No revenue data available</p>
        </div>
      )
    }

    // Transform API data → chart format safely
    const data = monthRevenue
      .map(item => {
        try {
          return {
            month: new Date(item.month + "-01").toLocaleString("en-US", {
              month: "short",
              year: "numeric"
            }),
            revenue: Number(item.totalAmount) || 0,
          }
        } catch {
          return null
        }
      })
      .filter(Boolean) as { month: string; revenue: number }[]

    if (data.length === 0) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-2xl">
          <p className="text-gray-500 font-medium">Invalid revenue data</p>
        </div>
      )
    }

    return (
      <div className="h-[400px] w-full relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#08428d]/5 to-[#00b4d8]/5 rounded-2xl"></div>
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 30, right: 40, left: 20, bottom: 30 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#6B7280", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#6B7280", fontWeight: 600 }}
              dx={-10}
              tickFormatter={(value) => new Intl.NumberFormat("en-US").format(value)}
            />
            
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US").format(value)
              }
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "20px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                backdropFilter: "blur(16px)",
                padding: "16px",
              }}
              labelStyle={{ color: "#08428d", fontWeight: "bold", fontSize: "16px" }}
              itemStyle={{ fontWeight: "600" }}
            />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{ fill: "#10b981", strokeWidth: 4, r: 6, stroke: "#fff" }}
              activeDot={{ r: 10, stroke: "#10b981", strokeWidth: 4, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 flex gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">Revenue</span>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("RevenueChart rendering error:", error)
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-red-50 rounded-2xl">
        <p className="text-red-600 font-medium">Error rendering revenue chart</p>
      </div>
    )
  }
}
