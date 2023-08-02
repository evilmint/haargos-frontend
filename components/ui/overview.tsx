"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useEffect } from "react";
import { useInstallationStore } from "@/app/services/stores";

export function Overview() {
  const installations = useInstallationStore((state) => state.installations);
  const observations = useInstallationStore((state) => state.observations);
  const fetchInstallations = useInstallationStore((state) => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore((state) => state.fetchObservationsForInstallation);

  useEffect(() => {
    fetchInstallations()
      .then(() => Promise.all(installations.map(({ id }) => fetchObservationsForInstallation(id))))
      .catch((error) => console.error(error));
  }, [fetchInstallations, fetchObservationsForInstallation, installations]);
 
  const allObservations = Object.values(observations).flat();

  const cpuIssueCount = allObservations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("high_cpu_usage") ? 1 : 0);
  }, 0);

  const volumeIssueCount = allObservations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("high_volume_usage") ? 1 : 0);
  }, 0);

  const memoryIssueCount = allObservations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("high_memory_usage") ? 1 : 0);
  }, 0);

  const logIssueCount = allObservations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("logs") ? 1 : 0);
  }, 0);


  const data = [
    {
      name: "Volume",
      total: volumeIssueCount,
    },
    {
      name: "CPU",
      total: cpuIssueCount,
    },
    {
      name: "Memory",
      total: memoryIssueCount,
    },
    {
      name: "Logs",
      total: logIssueCount,
    },
  ];

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
          allowDecimals={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip cursor={false} />
        <Bar dataKey="total" fill="#aa55ff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
