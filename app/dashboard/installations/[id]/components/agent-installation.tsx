'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { HALink } from '@/components/ha-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Checkbox } from '@/registry/new-york/ui/checkbox';
import { Input } from '@/registry/new-york/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { useEffect, useState } from 'react';
import Code from './code';

export function AgentInstallation({ installationId }: { installationId: string }) {
  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == installationId,
  );
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  const commandAmd64 = process.env.NEXT_PUBLIC_INSTALL_AGENT_COMMAND_AMD64 ?? '';
  const commandi386 = process.env.NEXT_PUBLIC_INSTALL_AGENT_COMMAND_I386 ?? '';

  const [inputToken, setInput] = useState<string>('');
  const [dockerAllowed, setDockerAllowed] = useState<boolean>(true);

  const onChange = (event: any) => {
    const token = event.target.value.trim();
    setInput(token);
  };

  const onDockerChange = (event: any) => {
    setDockerAllowed(event.target.getAttribute('data-state') != 'checked');
  };

  const dockerCompose = `version: '3'
services:
  haargos:
    image: haargos/aarch64:latest-docker
    environment:
      DEBUG: false # adjust to your needs
      HAARGOS_AGENT_TOKEN: ${installation?.agent_token ?? 'Your agent token here'}
      LONG_LIVED_ACCESS_TOKEN: ${
        inputToken && inputToken.length > 0
          ? inputToken
          : 'Your long lived access token here'
      }
    volumes:
      - ./config:/config # Mapping the local config directory to the container's /config${
        dockerAllowed
          ? '\n      - /var/run/docker.sock:/var/run/docker.sock # (optional) Map docker socket to gain more insights'
          : ''
      }
    restart: unless-stopped`;

  const addonRepo = 'https://github.com/haargos/ha-addons/';

  return (
    installation && (
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Install Haargos on {installation.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <h5>Agent token</h5>
          <Code>{installation.agent_token}</Code>

          <TabGroup>
            <TabList className="mt-8">
              <Tab>Home Assistant Add-on</Tab>
              <Tab>Docker Compose</Tab>
              <Tab>Standalone</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="mt-10">
                  <ol className="ml-6 space-y-2 list-decimal">
                    <li>
                      Add custom Haargos repository to your Home Assistant
                      <br />
                      {installation?.urls.instance?.success_url && (
                        <HALink
                          installationName={installation?.name}
                          actionName="Add addon repository"
                          instanceHost={installation.urls.instance.success_url}
                          domain="supervisor_add_addon_repository"
                          queryParams={{ repository_url: addonRepo }}
                        />
                      )}
                    </li>

                    <li>Refresh your addons list</li>
                    <li>Install the Haargos add-on</li>
                    <li>Enter the agent token in Configuration tab</li>
                    <li>Start the add-on</li>
                  </ol>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-10">
                  <p>
                    1. Choose the right Haargos image for your host's architecture in{' '}
                    <a
                      target="_blank"
                      className="text-blue-600"
                      href="https://hub.docker.com/repositories/haargos"
                    >
                      Docker Hub
                    </a>
                  </p>
                  <br />
                  <p>
                    2. Integrate the Haargos image into a docker-compose.yml or run
                    directly via docker. You can use he example contents provided below.
                    You can grab your own Long-Lived Access Token in your Home Assistant
                    user's profile.
                    <br />
                    <br />
                    {installation?.urls.instance?.success_url && (
                      <HALink domain="profile" />
                    )}
                  </p>
                  <br />
                  <p>3. Include your custom data optionally</p>
                  <div className="mt-4 block">
                    <span className="inline">
                      Include docker socket volume mapping to provide more docker
                      insights:{' '}
                    </span>
                    <Checkbox checked={dockerAllowed} onClick={onDockerChange} />
                  </div>
                  <div className="mt-4 block">
                    <span className="inline">
                      Include long lived access token (we don't store it):{' '}
                    </span>
                    <Input
                      type="search"
                      placeholder="Access token"
                      value={inputToken ?? ''}
                      onChange={onChange}
                      className="inline md:w-[100px] lg:w-[300px]"
                    />
                  </div>
                  <br />
                  <p>4. Run Haargos</p>
                  <strong className="mt-6 block">docker-compose.yml</strong>
                  <Code>{dockerCompose}</Code>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-10">
                  <h5 className="mt-6">Install Linux amd64</h5>
                  <Code>{commandAmd64}</Code>

                  <h5 className="mt-6">Install Linux i386</h5>
                  <Code>{commandi386}</Code>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </CardContent>
      </Card>
    )
  );
}
