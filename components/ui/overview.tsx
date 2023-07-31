"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useState, useEffect } from "react";
import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";
import { Observation, ObservationApiResponse } from "@/app/types";

export function Overview() {
  const [, setInstallations] = useState<any[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);

    useEffect(() => {
    const fetchInstallations = async () => {
      const installations = await (await getInstallations()).json();

      const sorted = installations.body.items.sort((b: any, a: any) => (new Date(a.last_agent_connection).getTime() - new Date(b.last_agent_connection).getTime()))

      setInstallations(sorted)

      const observations = await (await getObservations(sorted[0].id)).json() as ObservationApiResponse;
      setObservations(observations.body.items);
    }
    fetchInstallations();
  }, []);

  const cpuIssueCount = observations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("high_cpu_usage") ? 1 : 0);
  }, 0);

  const volumeIssueCount = observations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("high_volume_usage") ? 1 : 0);
  }, 0);

  const memoryIssueCount = observations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes("high_memory_usage") ? 1 : 0);
  }, 0);

  const logIssueCount = observations.reduce((a: any, i: any) => {
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
