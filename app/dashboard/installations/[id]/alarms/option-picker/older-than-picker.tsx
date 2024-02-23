'use client';
import { OlderThanOption, TimeComponent } from '@/app/types';
import { Input } from '@/components/ui/input';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

export interface OlderThanPickerProps {
  initialOlderThanOption?: OlderThanOption | undefined;
  onOlderThanSelected: (olderThanOption: OlderThanOption) => void;
}

export function OlderThanPicker(props: OlderThanPickerProps) {
  type ValueType = { name: TimeComponent };

  const [selectedTimeComponent, setSelectedTimeComponent] = useState<ValueType | null>({
    name: props.initialOlderThanOption?.timeComponent ?? 'Days',
  });
  const [selectedTimeValue, setSelectedTimeValue] = useState<number>(
    props.initialOlderThanOption?.componentValue ?? 1,
  );
  const [value, setValue] = useState<number>(
    props.initialOlderThanOption?.componentValue ?? 1,
  );

  const setSelectedTimeComponentValue = (value: ValueType) => {
    setSelectedTimeComponent(value);
  };

  // onOlderThanSelected
  useEffect(() => {
    if (!selectedTimeComponent) {
      return;
    }

    props.onOlderThanSelected({
      timeComponent: selectedTimeComponent.name,
      componentValue: selectedTimeValue,
    });
  }, [selectedTimeComponent, selectedTimeValue]);

  useEffect(() => {
    if (!selectedTimeComponent) {
      return;
    }

    if (selectedTimeValue > getTimeComponentMax(selectedTimeComponent)) {
      setSelectedTimeValue(getTimeComponentMax(selectedTimeComponent));
      setValue(getTimeComponentMax(selectedTimeComponent));
    }
  }, [selectedTimeComponent]);

  const values: ValueType[] = [
    {
      name: 'Minutes',
    },
    {
      name: 'Hours',
    },
    {
      name: 'Days',
    },
    {
      name: 'Months',
    },
  ];

  const inputMax = getTimeComponentMax(selectedTimeComponent);

  return (
    <div className="flex">
      <p className="mr-3 mt-3 font-medium">Older than</p>

      <div className="flex">
        <Input
          type="number"
          min={1}
          max={inputMax}
          value={value}
          onChange={e => {
            const val = Math.min(
              getTimeComponentMax(selectedTimeComponent),
              parseInt(e.target.value),
            );
            setSelectedTimeValue(val);
            setValue(val);
          }}
          className="mt-1 mr-2 w-[120px]"
        />

        <Listbox
          multiple={false}
          value={selectedTimeComponent}
          onChange={setSelectedTimeComponentValue}
        >
          <div className="w-[400px] relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
              <span className="block truncate">
                {selectedTimeComponent?.name ?? 'Select value...'}
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
                {values.map((value, valueIdx) => (
                  <Listbox.Option
                    key={valueIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-sr-100 text-gray-900' : 'text-gray-900'
                      }`
                    }
                    value={value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {value.name}
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

function getTimeComponentMax(
  selectedTimeComponent: { name: TimeComponent } | null,
): number {
  switch (selectedTimeComponent?.name) {
    case 'Days':
      return 90;
    case 'Hours':
      return 48;
    case 'Minutes':
      return 240;
    case 'Months':
      return 24;
  }

  return 0;
}
