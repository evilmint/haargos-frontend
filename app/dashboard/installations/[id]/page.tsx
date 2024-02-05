'use client';
import { useAddonsStore } from '@/app/services/stores/addons';
import { useInstallationStore } from '@/app/services/stores/installation';
import { useInstallationSwitcherStore } from '@/app/services/stores/installation-switcher';
import { useNotificationsStore } from '@/app/services/stores/notifications';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/default/ui/alert-dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AgentInstallation } from './components/agent-installation';
import { DashboardHeaderInstallation } from './components/dashboard-header-installation';
import { Docker } from './components/docker';
import { AutomationsDataTableProxy } from './components/homeassistant/automations/AutomationsDataTableProxy';
import { SceneDataTableProxy } from './components/homeassistant/scenes/scenes-data-table-proxy';
import { ScriptsDataTableProxy } from './components/homeassistant/scripts/scripts-data-table-proxy';
import { ZigbeeDataTableProxy } from './components/homeassistant/zigbee/zigbee-data-table-proxy';
import { CPU } from './components/host/cpu';
import { Storage } from './components/host/storage';
import { InstallationOverviewChart } from './components/installation-overview-chart';

import { updateInstallation } from '@/app/services/installations';
import { useOSStore } from '@/app/services/stores/os';
import { useSupervisorStore } from '@/app/services/stores/supervisor';
import { useTabStore } from '@/app/services/stores/tab';
import { HaargosInsights } from '@/components/insights';
import { isLocalDomain } from '@/lib/local-domain';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Input } from '@/registry/new-york/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Alarms } from './components/alarms/alarms';
import { AddonDataTableProxy } from './components/homeassistant/addons-data-table-proxy';
import { LogSwitcher } from './components/homeassistant/logs/log-switcher';
import { Memory } from './components/host/memory';
import { Network } from './components/host/network';
import { JobsDataTableProxy } from './components/jobs/job-data-table-proxy';
import { Notifications } from './components/notifications';
import { PageWrapper } from './components/page-wrapper';
import { Supervisor } from './components/supervisor';

const updateInstallationFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 32 characters.',
    }),
  instance: z.union([
    z.literal(''),
    z
      .string()
      .trim()
      .url()
      .refine(i => {
        const url = new URL(i);
        if (isLocalDomain(url)) {
          return true;
        }

        try {
          return url.protocol.toLowerCase() == 'https:';
        } catch {
          return false;
        }
      }, 'Only HTTPS URLs are allowed.'),
  ]),
});

type UpdateInstallationFormValues = z.infer<typeof updateInstallationFormSchema>;

export default function DashboardInstallationPage({
  params,
}: {
  params: { id: string };
}) {
  const notifications = useNotificationsStore(
    state => state.notificationsByInstallationId[params.id],
  );
  const addons = useAddonsStore(state => state.addonsByInstallationId[params.id]);
  const supervisor = useSupervisorStore(
    state => state.supervisorByInstallationId[params.id],
  );
  const os = useOSStore(state => state.osByInstallationId[params.id]);

  const [origin, setOrigin] = useState<string | null>(null);
  const defaultTab = useTabStore(state => state.currentTab);
  const setDefaultTab = useTabStore(state => state.setCurrentTab);
  const observations = useInstallationStore(state => state.observations[params.id]);
  const deleteInstallation = useInstallationStore(state => state.deleteInstallation);
  const router = useRouter();

  const clearInstallation = useInstallationSwitcherStore(
    state => state.clearInstallation,
  );

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setOrigin(window.location.origin);

    if (window.location.hash != null && window.location.hash.length > 0) {
      setDefaultTab(window.location.hash.slice(1));
    }
  }, [setDefaultTab, setOrigin]);

  useEffect(() => {
    const onHashChanged = () => {
      const newHash = window.location.hash.slice(1);
      setDefaultTab(newHash?.length > 0 ? newHash : 'overview');
    };

    window.addEventListener('hashchange', onHashChanged);

    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, []);

  const deleteOnClick = async (installationId: string) => {
    const token = await getAccessTokenSilently();
    await deleteInstallation(token, installationId);
    clearInstallation();

    toast.success('Installation has been deleted.');
    router.push('/dashboard');
  };

  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == params.id,
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isUpdating, setUpdating] = useState<boolean>(false);

  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, true);
    } catch (error) {
      console.log(error);
    }
  };
  const { ...form } = useForm<UpdateInstallationFormValues>({
    resolver: zodResolver(updateInstallationFormSchema),
  });

  useEffect(() => {
    const defaultValues: Partial<UpdateInstallationFormValues> = {
      name: installation?.name ?? '',
      instance: installation?.urls.instance?.url ?? '',
    };
    form.reset(defaultValues);
  }, [installation]);

  async function onSubmit(data: UpdateInstallationFormValues) {
    setUpdating(true);

    try {
      const accessToken = await getAccessTokenSilently();
      await updateInstallation(
        accessToken,
        params.id,
        data.instance ?? '',
        data.name,
        installation?.notes ?? '',
      );

      asyncFetch();
    } catch (error) {
      setAlertOpen(true);
    } finally {
      setUpdating(false);
      toast.success('Installation has been updated.');
      //setSheetOpen(false);
    }
  }

  let verification: {
    raw_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'EMPTY' | 'PRIVATE';
    status: string;
    subdomain?: string;
    verification_value?: string;
  } | null;

  switch (installation?.urls.instance?.verification_status) {
    case 'SUCCESS':
      verification = {
        raw_status: installation.urls.instance?.verification_status,
        status: 'Verified',
      };
      break;

    case 'FAILED':
      verification = {
        raw_status: installation.urls.instance?.verification_status,
        status: 'DNS verification failed',
      };
      break;
    case 'PENDING':
      verification = {
        raw_status: installation.urls.instance?.verification_status,
        status: 'DNS verification pending',
        subdomain: installation.urls.instance?.subdomain,
        verification_value: installation.urls.instance?.subdomain_value,
      };
      break;
  }

  if (installation?.urls.instance?.url_type == 'PRIVATE') {
    verification = {
      raw_status: 'PRIVATE',
      status: 'Private URL',
    };
  }

  const supervisorUpdateCount =
    (supervisor?.update_available ? 1 : 0) + (os?.update_available ? 1 : 0);

  const dockerEnabled =
    observations && observations.length > 0
      ? observations[0].agent_type != 'addon'
      : false;

  const notificationsEnabled = true;
  const hasSupervisor =
    observations && observations.length > 0
      ? observations[0].agent_type == 'addon'
      : false;

  return (
    defaultTab != null &&
    origin != null && (
      <>
        <PageWrapper installationId={params.id}>
          <Tabs
            defaultValue={defaultTab}
            value={defaultTab}
            onValueChange={value => {
              window.location.hash = `#${value}`;
            }}
            className="space-y-4"
          >
            <div className="flex-col flex-1">
              <TabsList>
                <TabsTrigger value="install">
                  <Icons.cog6tooth className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="homeassistant">Home Assistant</TabsTrigger>
                <TabsTrigger value="host">Host</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="alarms">Alarms</TabsTrigger>
              </TabsList>

              <AlertDialog>
                <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="lg:float-right mt-4 lg:mt-0 mb-0">
                      <Icons.cog6tooth />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Installation</SheetTitle>
                      <SheetDescription>
                        Make changes to your installation here.
                      </SheetDescription>
                    </SheetHeader>

                    <br />

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Installation name</FormLabel>
                              <FormControl>
                                <Input placeholder="My Parents' Home" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="instance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instance URL</FormLabel>
                              {verification?.raw_status == 'SUCCESS' && (
                                <Badge
                                  className="ml-2"
                                  color="green"
                                  icon={Icons.shieldCheck}
                                >
                                  Verified
                                </Badge>
                              )}
                              {verification?.raw_status == 'PRIVATE' && (
                                <Badge className="ml-2" color="gray">
                                  Private address
                                </Badge>
                              )}
                              <FormControl>
                                <Input
                                  placeholder="https://my.homeassistant.url"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is the URL of your HomeAssistant instance. Leave
                                blank if not applicable.
                              </FormDescription>

                              <FormMessage />
                              <br />

                              {verification &&
                                verification.raw_status != 'SUCCESS' &&
                                verification.raw_status != 'EMPTY' &&
                                verification.raw_status != 'PRIVATE' && (
                                  <h3 className="font-semibold text-large">
                                    DNS verification{' '}
                                    <Badge
                                      color={
                                        verification.raw_status == 'PENDING'
                                          ? 'yellow'
                                          : 'red'
                                      }
                                    >
                                      {verification && verification.raw_status}
                                    </Badge>
                                  </h3>
                                )}
                              {verification?.raw_status == 'PENDING' && (
                                <>
                                  <FormLabel>Subdomain</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="https://my.homeassistant.url"
                                      readOnly
                                      value={verification.subdomain}
                                    />
                                  </FormControl>

                                  <FormLabel>Value</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="https://my.homeassistant.url"
                                      readOnly
                                      value={verification.verification_value}
                                    />
                                  </FormControl>
                                </>
                              )}
                            </FormItem>
                          )}
                        />
                        <Button
                          className="bg-sr-600 hover:bg-sr-700"
                          type="submit"
                          disabled={isUpdating}
                        >
                          Save
                        </Button>
                      </form>
                    </Form>

                    <SheetFooter>
                      <SheetClose asChild>
                        <div className="grid grid-cols-1 py-4">
                          <AlertDialogTrigger asChild>
                            <Button
                              className="bg-sr-600 hover:bg-sr-700"
                              type="reset"
                              disabled={isUpdating}
                            >
                              Delete installation
                            </Button>
                          </AlertDialogTrigger>
                        </div>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      installation and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteOnClick(params.id);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <TabsContent value="install" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <AgentInstallation installationId={params.id} />
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <HaargosInsights installationId={params.id} />
              <DashboardHeaderInstallation installationId={params.id} />
              <InstallationOverviewChart installationId={params.id} />
              <LogSwitcher installationId={params.id} />
            </TabsContent>

            <TabsContent value="homeassistant" className="space-y-4">
              <TabGroup className="sm:max-md:block">
                <TabList className="md:mt-8 sm:max-md:block">
                  <Tab className="sm:max-md:w-[100%] sm:max-md:ml-4">Zigbee</Tab>

                  <Tab className="sm:max-md:w-[100%]">
                    Notifications{' '}
                    {notifications?.length > 0 ? (
                      <Badge size="xs" className="text-xl w-5 h-5">
                        {notifications.length}
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </Tab>

                  {hasSupervisor ? (
                    <Tab className="sm:max-md:w-[100%]">
                      Supervisor{' '}
                      {supervisorUpdateCount > 0 ? (
                        <Badge size="xs" className="text-xl w-5 h-5">
                          {supervisorUpdateCount}
                        </Badge>
                      ) : (
                        <></>
                      )}
                    </Tab>
                  ) : (
                    <></>
                  )}
                  {hasSupervisor ? (
                    <Tab className="sm:max-md:w-[100%]">
                      Addons{' '}
                      {addons?.filter(a => a.update_available).length > 0 ? (
                        <Badge size="xs" className="text-xl w-5 h-5">
                          {addons.filter(a => a.update_available).length}
                        </Badge>
                      ) : (
                        <></>
                      )}
                    </Tab>
                  ) : (
                    <></>
                  )}
                  <Tab className="sm:max-md:w-[100%]">Automations</Tab>
                  <Tab className="sm:max-md:w-[100%]">Scenes</Tab>
                  <Tab className="sm:max-md:w-[100%]">Scripts</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="mt-10">
                      <ZigbeeDataTableProxy installationId={params.id} />
                    </div>
                  </TabPanel>

                  {notificationsEnabled ? (
                    <TabPanel>
                      <div className="mt-10">
                        <Notifications installationId={params.id} />
                      </div>
                    </TabPanel>
                  ) : (
                    <></>
                  )}

                  {hasSupervisor ? (
                    <TabPanel>
                      <div className="mt-10">
                        <Supervisor installationId={params.id} />
                      </div>
                    </TabPanel>
                  ) : (
                    <></>
                  )}

                  {hasSupervisor ? (
                    <TabPanel>
                      <div className="mt-10">
                        <AddonDataTableProxy installationId={params.id} />
                      </div>
                    </TabPanel>
                  ) : (
                    <></>
                  )}

                  <TabPanel>
                    <div className="mt-10">
                      <AutomationsDataTableProxy installationId={params.id} />
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="mt-10">
                      <SceneDataTableProxy installationId={params.id} />
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="mt-10">
                      <ScriptsDataTableProxy installationId={params.id} />
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </TabsContent>

            <TabsContent value="host" className="space-y-4">
              <TabGroup>
                <TabList className="mt-8">
                  <Tab>CPU</Tab>
                  <Tab>Memory</Tab>
                  <Tab>Network</Tab>
                  <Tab>Storage</Tab>
                  {dockerEnabled ? <Tab>Docker</Tab> : <></>}
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="mt-10">
                      <CPU installationId={params.id} />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="mt-10">
                      <Memory installationId={params.id} />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="mt-10">
                      <Network installationId={params.id} />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="mt-10">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Storage installationId={params.id} />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="mt-10">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Docker installationId={params.id} />
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <JobsDataTableProxy installationId={params.id} />
            </TabsContent>

            <TabsContent value="alarms" className="space-y-4">
              <Alarms installationId={params.id} />
            </TabsContent>
          </Tabs>
        </PageWrapper>
      </>
    )
  );
}
