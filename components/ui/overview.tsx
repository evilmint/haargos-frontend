"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Volume",
    total: Math.floor(Math.random() * 20),
  },
  {
    name: "CPU",
    total: Math.floor(Math.random() * 20),
  },
  {
    name: "Memory",
    total: Math.floor(Math.random() * 20),
  },
  {
    name: "Logs",
    total: Math.floor(Math.random() * 20),
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#aa55ff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
