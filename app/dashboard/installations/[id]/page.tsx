'use client';
import { DashboardHeaderInstallation } from '@/app/dashboard/installations/[id]/components/dashboard-header';
import {
  useInstallationStore,
  useInstallationSwitcherStore,
} from '@/app/services/stores';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
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
import ipaddr from 'ipaddr.js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AgentInstallation } from './components/agent-installation';
import { AutomationsDataTableProxy } from './components/automations/AutomationsDataTableProxy';
import { CPU } from './components/cpu';
import { Docker } from './components/docker';
import { InstallationOverviewChart } from './components/installation-overview-chart';
import { LogsDataTableProxy } from './components/logs/logs-data-table-proxy';
import { SceneDataTableProxy } from './components/scenes/scenes-data-table-proxy';
import { ScriptsDataTableProxy } from './components/scripts/scripts-data-table-proxy';
import { Storage } from './components/storage';
import { ZigbeeDataTableProxy } from './components/zigbee/zigbee-data-table-proxy';

import { updateInstallation } from '@/app/services/installations';
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
import * as z from 'zod';
import { Memory } from './components/memory';
import { Network } from './components/network';

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
        try {
          return new URL(i).protocol.toLowerCase() == 'https:';
        } catch {
          return false;
        }
      }, 'Only HTTPS URLs are allowed.')
      .refine(i => {
        try {
          const _ = ipaddr.parse(new URL(i).host);
          return false;
        } catch {
          return true;
        }
      }, 'IP addresses are not allowed.'),
  ]),
});

type UpdateInstallationFormValues = z.infer<typeof updateInstallationFormSchema>;

export default function DashboardInstallationPage({
  params,
}: {
  params: { id: string };
}) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [defaultTab, setDefaultTab] = useState<string>('overview');
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
    } else {
      setDefaultTab('overview');
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
      //setSheetOpen(false);
    }
  }

  let verification: {
    raw_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'EMPTY';
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

  const dockerEnabled =
    observations && observations.length > 0
      ? observations[0].agent_type != 'addon'
      : false;

  return (
    defaultTab != null &&
    origin != null && (
      <>
        <div className="flex-col">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <MainNav installationId={params.id} className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Tabs
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
                </TabsList>

                <AlertDialog>
                  <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="float-right">
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
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-8"
                        >
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
                                  verification.raw_status != 'EMPTY' && (
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
                          <Button type="submit" disabled={isUpdating}>
                            Save
                          </Button>
                        </form>
                      </Form>

                      <SheetFooter>
                        <SheetClose asChild>
                          <div className="grid grid-cols-1 py-4">
                            <AlertDialogTrigger asChild>
                              <Button type="reset" disabled={isUpdating}>
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
                <DashboardHeaderInstallation installationId={params.id} />
                <InstallationOverviewChart installationId={params.id} />
                <LogsDataTableProxy installationId={params.id} />
              </TabsContent>

              <TabsContent value="homeassistant" className="space-y-4">
                <TabGroup>
                  <TabList className="mt-8">
                    <Tab>Zigbee</Tab>
                    <Tab>Automations</Tab>
                    <Tab>Scene</Tab>
                    <Tab>Scripts</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <div className="mt-10">
                        <ZigbeeDataTableProxy installationId={params.id} />
                      </div>
                    </TabPanel>

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
            </Tabs>
          </div>
        </div>
      </>
    )
  );
}
