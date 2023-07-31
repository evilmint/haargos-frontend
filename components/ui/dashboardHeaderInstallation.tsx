"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { useState, useEffect } from "react";
import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";
import TimeAgo from "react-timeago";

export function DashboardHeaderInstallation() {
  const [, setInstallations] = useState<any>([]);
  const [highestStorage, setHighestStorage] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchInstallations = async () => {
      const installations = await (await getInstallations()).json();

      const sorted = installations.body.items.sort(
        (b: any, a: any) =>
          new Date(a.last_agent_connection).getTime() -
          new Date(b.last_agent_connection).getTime()
      );

      setInstallations(sorted);

      const observations = await (await getObservations(sorted[0].id)).json();
      setObservations(observations.body.items);

            // Function to find the storage entry with the highest use percentage in an array
            function findHighestUseStorage(storageArray: any) {
              let highestUsePercentage = -1;
              let highestUseStorage = null;
      
              storageArray.forEach((storage: any) => {
                const usePercentage = parseInt(
                  storage.use_percentage.replace("%", "")
                );
                if (usePercentage > highestUsePercentage) {
                  highestUsePercentage = usePercentage;
                  highestUseStorage = storage;
                }
              });
      
              return highestUseStorage;
            }
      
            // Initialize variables to store the overall highest use storage
            let overallHighestUseStorage: any = null;
            let overallHighestUsePercentage = -1;

            // Loop through all items and find the highest use storage
            observations.body.items.forEach((item: any) => {
              const storageArray = item.environment.storage;
              const highestUseStorage: any = findHighestUseStorage(storageArray);
      
              if (highestUseStorage) {
                const highestUsePercentage = parseInt(
                  highestUseStorage.use_percentage.replace("%", "")
                );
      
                if (highestUsePercentage > overallHighestUsePercentage) {
                  overallHighestUsePercentage = highestUsePercentage;
                  overallHighestUseStorage = highestUseStorage;
                }
              }
            });
      
            if (overallHighestUseStorage != null) {
              setHighestStorage(
                overallHighestUseStorage.name +
                  " " +
                  overallHighestUseStorage.use_percentage
              );
            }
      
      
    };
    fetchInstallations();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Agent version
        </CardTitle>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {observations.length > 0 ? observations[0].agent_version : "n/a"}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Memory
        </CardTitle>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {observations.length > 0
            ? Math.floor(
                (observations[0].environment.memory.used /
                  observations[0].environment.memory.total) *
                  100
              ) + "%"
            : "n/a"}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Storage max
        </CardTitle>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-muted-foreground"
        >
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {highestStorage ?? "n/a"}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Architecture
        </CardTitle>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {observations[0]?.environment.cpu.architecture ?? "n/a"}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Latest activity
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {observations.length > 0 ? (
            <TimeAgo date={observations[0].timestamp} />
          ) : (
            "n/a"
          )}
        </div>
      </CardContent>
    </Card>
  </div>
  );
}
