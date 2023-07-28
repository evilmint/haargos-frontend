"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getObservations } from "../../services/observations";
import { getInstallations } from "../../services/installations";
import { getUserMe } from "../../services/users";
import { useRouter } from "next/navigation";
import TimeAgo from "react-timeago";
import { Logs } from "@/components/ui/logs";

import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";

import { Log } from "../../types.d";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { MainNav } from "@/components/ui/main-nav";
import { Overview } from "@/components/ui/overview";
import { Installations } from "@/components/ui/installations";
import { Search } from "@/components/ui/search";
import TeamSwitcher from "@/components/ui/team-switcher";
import { UserNav } from "@/components/ui/user-nav";

function wrapSquareBracketsWithEm(inputString: string) {
  const regex = /\[([^\]]+)\]/g;
  return inputString.replace(regex, '<p class="text-xs">[$1]</p>');
}

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [observations, setObservations] = useState<any[]>([]);
  const [user, setUser] = useState<any>([]);
  const [installations, setInstallations] = useState<any>([]);
  const [installation, setInstallation] = useState<any>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [highestStorage, setHighestStorage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserMe = async () => {
      const userMe = await (await getUserMe()).json();
      setUser(userMe.body);
    };
    fetchUserMe();
  }, []);

  useEffect(() => {
    const fetchInstallations = async () => {
      const installations: any = await (await getInstallations()).json();

      const installation = installations.body.items.filter(
        (i: any) => i.id == params.id
      )[0];
      const observations = await (await getObservations(params.id)).json();
      const itemsArray = observations.body.items;

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
      let overallHighestUseStorage: any = 0;
      let overallHighestUsePercentage = -1;

      // Loop through all items and find the highest use storage
      itemsArray.forEach((item: any) => {
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

      setHighestStorage(
        overallHighestUseStorage.name +
          " " +
          overallHighestUseStorage.use_percentage
      );

      setObservations(observations.body.items);
      setInstallation(installation);
      setInstallations(installations.body.items);

      let logString = "";

      for (const item of observations.body.items) {
        logString += item.logs;
        console.log(logString);
      }

      let logs = logString.split("\n");

      const resultArray: Log[] = [];

      for (const log of logs) {
        const parts = log.split(/\s+/);

        if (parts.length < 5) {
          continue;
        }
  
        const time = new Date(parts[0] + "T" + parts[1]+"Z").toLocaleString();
        const logType = parts[2][0];
        const thread = parts[3].replace('(', '').replace(')', '');
        const restOfLog = parts.slice(4).join(" ");

        resultArray.push({
          time: time,
          type: logType,
          thread: thread,
          log: wrapSquareBracketsWithEm(restOfLog),
        });
      }

      setLogs(resultArray);
    };
    fetchInstallations();
  }, []);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav user={user} />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div> */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="environment">
                Environment
              </TabsTrigger>
              <TabsTrigger value="reports">
                Docker
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
  
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {observations.length > 0 &&
                        observations[0].environment.cpu.architecture}
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
                      <TimeAgo
                        date={
                          observations.length > 0 && observations[0].timestamp
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Installations</CardTitle>
                    <CardDescription>Client installations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Installations installations={installations} />
                  </CardContent>
                </Card>
                <Card className="col-span-8">
                  <CardHeader>
                    <CardTitle>Issues ({logs.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Logs logs={logs} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Installations</CardTitle>
                    <CardDescription>Client installations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Installations installations={installations} />
                  </CardContent>
                </Card>
                <Card className="col-span-8">
                  <CardHeader>
                    <CardTitle>Issues ({logs.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Logs logs={logs} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
