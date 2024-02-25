'use client';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

export function NotificationMethodPicker(props: {
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
      <div className="flex flex-col md:flex-row max-w-[470px]">
        <p className="max-w-[240px] mt-2 font-medium">Notification method</p>

        <Listbox
          value={selectedNotificationMethod}
          onChange={setSelectedNotificationMethod}
        >
          <div className="max-w-[400px] relative mt-1">
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
