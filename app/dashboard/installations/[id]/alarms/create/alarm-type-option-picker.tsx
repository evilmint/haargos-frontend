'use client';
import { useAddonsStore } from '@/app/services/stores/addons';
import { AddonsApiResponseAddon, AlarmType } from '@/app/types';
import { Input } from '@/components/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

export interface AlarmTypeOptionPickerProps {
  alarm: AlarmType;
  installationId: string;
}

export function AlarmTypeOptionPicker(params: AlarmTypeOptionPickerProps) {
  const isAddonOptionPickerAvailable = params.alarm.category == 'ADDON';

  return (
    <div className="mb-8 w-full">
      <h2 className="mb-4 text-2xl font-semibold">Options</h2>

      {isAddonOptionPickerAvailable && (
        <AddonPicker installationId={params.installationId} />
      )}

      {params.alarm.datapoints != 'NONE' && (
        <div className="mt-2">
          <div className="flex w-[470px]">
            <p className="w-[240px] mt-2 font-medium">
              {params.alarm.datapoints == 'MISSING' ? 'Missing datapoints' : 'Datapoints'}
            </p>

            <Input type="number" defaultValue={1} max={5} min={1} />
          </div>
        </div>
      )}

      <NotificationMethodPicker />
    </div>
  );
}

export interface AddonOptionPickerProps {
  installationId: string;
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

  useEffect(() => {
    asyncFetch();
  }, [getAccessTokenSilently, fetchAddonsForInstallation, props.installationId, user]);

  const [selected, setSelected] = useState<AddonsApiResponseAddon[]>([]);

  return (
    <div className="flex">
      <p className="mr-3 mt-3 font-medium">Addons</p>
      <Listbox multiple={true} value={selected} onChange={setSelected}>
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

function NotificationMethodPicker() {
  const notificationMethods: { name: string }[] = [{ name: 'E-mail' }];
  const [selectedNotificationMethod, setSelectedNotificationMethod] = useState(
    notificationMethods[0],
  );

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
