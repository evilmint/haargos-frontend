'use client';
import { useAddonsStore } from '@/app/services/stores/addons';
import {
  AddonsApiResponseAddon,
  AlarmType,
  UserAlarmConfigurationConfiguration,
} from '@/app/types';
import { Input } from '@/registry/new-york/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ChangeEventHandler, Fragment, useEffect, useState } from 'react';

export interface AlarmTypeOptionPickerProps {
  alarm: AlarmType;
  installationId: string;
  initialAlarmOptions?: UserAlarmConfigurationConfiguration;
  onAlarmOptionsChanged: (options: any) => void;
}

export function AlarmTypeOptionPicker(params: AlarmTypeOptionPickerProps) {
  const isAddonOptionPickerAvailable = params.alarm.category == 'ADDON';

  const [selectedOptions, setSelectedOptions] =
    useState<UserAlarmConfigurationConfiguration>({
      addons: params.initialAlarmOptions?.addons ?? [],
      datapointCount: params.initialAlarmOptions?.datapointCount ?? 1,
      notificationMethod: params.initialAlarmOptions?.notificationMethod ?? 'E-mail', // Default value, adjust if needed
    });

  useEffect(() => {
    params.onAlarmOptionsChanged(selectedOptions);
  }, [selectedOptions]);

  // Handlers to update the state
  const handleAddonsSelected = (addons: AddonsApiResponseAddon[]) => {
    const mappedAddons = addons.map(a => {
      return {
        slug: a.slug,
      };
    });

    setSelectedOptions(prevOptions => ({ ...prevOptions, addons: mappedAddons }));
  };

  const handleDataPointsChange: ChangeEventHandler<HTMLInputElement> = h => {
    console.log(h.target.value);
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      datapointCount: parseInt(h.target.value),
    }));
  };

  const handleNotificationMethodChange = (method: 'E-mail') => {
    setSelectedOptions(prevOptions => ({ ...prevOptions, notificationMethod: method }));
  };

  return (
    <div className="mb-8 w-full">
      <h2 className="mb-4 text-2xl font-semibold">Options</h2>

      {isAddonOptionPickerAvailable && (
        <AddonPicker
          initialAddons={params.initialAlarmOptions?.addons}
          onAddonsSelected={handleAddonsSelected}
          installationId={params.installationId}
        />
      )}

      {params.alarm.datapoints != 'NONE' && (
        <div className="mt-2">
          <div className="flex w-[470px]">
            <p className="w-[240px] mt-2 font-medium">
              {params.alarm.datapoints == 'MISSING' ? 'Missing datapoints' : 'Datapoints'}
            </p>

            <Input
              type="number"
              defaultValue={params.initialAlarmOptions?.datapointCount ?? 1}
              max={5}
              min={1}
              onChange={handleDataPointsChange}
            />
          </div>
        </div>
      )}

      <NotificationMethodPicker
        onNotificationMethodChange={handleNotificationMethodChange}
      />
    </div>
  );
}

export interface AddonOptionPickerProps {
  installationId: string;
  initialAddons?: { slug: string }[] | undefined;
  onAddonsSelected: (addons: AddonsApiResponseAddon[]) => void;
}

function AddonPicker(props: AddonOptionPickerProps) {
  const addons =
    useAddonsStore(state => state.addonsByInstallationId[props.installationId]) ?? [];
  const fetchAddonsForInstallation = useAddonsStore(state => state.fetchAddons);
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchAddonsForInstallation(props.installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  const initialAddonSlugs = (props.initialAddons ?? []).map(a => a.slug);
  const [initialAddonsSet, setInitialAddons] = useState<boolean>(false);
  const [selected, setSelected] = useState<AddonsApiResponseAddon[]>(
    addons.filter(a => initialAddonSlugs.includes(a.slug)),
  );

  useEffect(() => {
    asyncFetch();
  }, [getAccessTokenSilently, fetchAddonsForInstallation, props.installationId, user]);

  useEffect(() => {
    if (initialAddonsSet) {
      return;
    }

    if (addons.length > 0) {
      setSelected(addons.filter(a => initialAddonSlugs.includes(a.slug)));
      setInitialAddons(true);
    }
  }, [addons]);

  const setSelectedAddons = (addons: AddonsApiResponseAddon[]) => {
    setSelected(addons);
    props.onAddonsSelected(addons);
  };

  return (
    <div className="flex">
      <p className="mr-3 mt-3 font-medium">Addons</p>
      <Listbox multiple={true} value={selected} onChange={setSelectedAddons}>
        <div className="w-[400px] relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
            <span className="block truncate">
              {selected.length > 0
                ? selected.map(s => s.name).join(', ')
                : 'Pick an addon...'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {addons.map((addon, addonIdx) => (
                <Listbox.Option
                  key={addonIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-sr-100 text-gray-900' : 'text-gray-900'
                    }`
                  }
                  value={addon}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {addon.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sr-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

function NotificationMethodPicker(props: {
  onNotificationMethodChange: (method: 'E-mail') => void;
}) {
  const notificationMethods: { name: 'E-mail' }[] = [{ name: 'E-mail' }];
  const [selectedNotificationMethod, setSelectedNotificationMethod] = useState<{
    name: 'E-mail';
  }>(notificationMethods[0]);

  useEffect(() => {
    props.onNotificationMethodChange(selectedNotificationMethod.name);
  }, [selectedNotificationMethod]);

  return (
    <div className="mt-2">
      <div className="flex w-[470px]">
        <p className="w-[240px] mt-2 font-medium">Notification method</p>

        <Listbox
          value={selectedNotificationMethod}
          onChange={setSelectedNotificationMethod}
        >
          <div className="w-[400px] relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
              <span className="block truncate">{selectedNotificationMethod.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute dark:bg-gray-800 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {notificationMethods.map((notificationMethod, addonIdx) => (
                  <Listbox.Option
                    key={addonIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 dark:text-gray-200 pr-4 ${
                        active
                          ? 'dark:bg-sr-600 bg-sr-100 text-gray-900'
                          : 'text-gray-900'
                      }`
                    }
                    value={notificationMethod}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {notificationMethod.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sr-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
}
