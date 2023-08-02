"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { useEffect } from "react";
import TimeAgo from "react-timeago";
import { useInstallationStore } from "@/app/services/stores";
import { Button } from "@/registry/new-york/ui/button";

export function DashboardHeaderInstallation({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(
    (state) => state.observations[installationId]
  );
  const highestStorage = useInstallationStore(
    (state) => state.highestStorageByInstallationId[installationId]
  );
  const fetchInstallations = useInstallationStore(
    (state) => state.fetchInstallations
  );
  const fetchObservationsForInstallation = useInstallationStore(
    (state) => state.fetchObservationsForInstallation
  );
  const haVersion = useInstallationStore(
    (state) => state.haVersion[installationId]
  );

  useEffect(() => {
    fetchInstallations()
      .then(() => fetchObservationsForInstallation(installationId))
      .catch((error) => console.error(error));
  }, [fetchInstallations, fetchObservationsForInstallation, installationId]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agent version</CardTitle>

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
            {observations && observations.length > 0
              ? observations[0].agent_version
              : "n/a"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HA version</CardTitle>

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
        <CardContent className="flex">
          <div className="text-2xl flex-1 font-bold inline">
            {haVersion ?? "n/a"}
          </div>
          <Button
            onClick={() => {
              window.open(
                "https://github.com/home-assistant/core/releases",
                "_blank"
              );
            }}
            className="inline flex-1 flex-auto"
            variant="outline"
          >
            Releases
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory</CardTitle>

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
            {observations && observations.length > 0
              ? (
                  observations[0].environment.memory.used /
                  1024 /
                  1024
                ).toPrecision(2) +
                "G / " +
                (
                  observations[0].environment.memory.total /
                  1024 /
                  1024
                ).toPrecision(2) +
                "G" +
                " "
              : "n/a"}

            <p className="text-sm font-normal inline">
              {observations?.length > 0
                ? Math.floor(
                    (observations[0].environment.memory.used /
                      observations[0].environment.memory.total) *
                      100
                  ) + "%"
                : ""}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage max</CardTitle>

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
            {highestStorage
              ? highestStorage?.used + " / " + highestStorage?.size
              : "n/a"}

            <p className="text-sm font-normal ml-2 inline">
              {highestStorage?.name ?? ""}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Architecture</CardTitle>

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
            {(observations && observations[0]?.environment.cpu.architecture) ??
              "n/a"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest activity</CardTitle>
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
            {observations && observations?.length > 0 ? (
              <TimeAgo date={observations[0]?.timestamp} />
            ) : (
              "n/a"
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
