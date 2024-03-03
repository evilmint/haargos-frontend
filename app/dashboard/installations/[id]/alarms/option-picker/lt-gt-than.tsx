'use client';
import { LtGtComparator, LtGtThanOption, LtGtValueType } from '@/app/types';
import { Input } from '@/components/ui/input';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

export interface LtGtThanInputProps {
  entityName: string;
  initialLtGtThanOption?: LtGtThanOption | undefined;
  valueType: LtGtValueType;
  //onOlderThanSelected: (olderThanOption: OlderThanOption) => void;
}

type DisplayableComparator = { comparator: LtGtComparator; displayName: string };

export function LtGtThanInput(props: LtGtThanInputProps) {
  const comparator = props.initialLtGtThanOption?.comparator ?? 'lt';
  const values: DisplayableComparator[] = [
    {
      comparator: 'lt',
      displayName: '<',
    },
    {
      comparator: 'lte',
      displayName: '<=',
    },
    {
      comparator: 'gt',
      displayName: '>',
    },
    {
      comparator: 'gte',
      displayName: '>=',
    },
  ];

  const [selectedComparator, setSelectedComparator] =
    useState<DisplayableComparator | null>({
      comparator: comparator,
      displayName:
        values.find(a => a.comparator == props.initialLtGtThanOption?.comparator ?? 'lt')
          ?.displayName ?? 'lt',
    });
  const [selectedValue, setValue] = useState<number>(
    props.initialLtGtThanOption?.value ?? 0,
  );

  const setSelectedTimeComponentValue = (value: DisplayableComparator) => {
    setSelectedComparator(value);
  };

  // useEffect(() => {
  //   if (!selectedTimeComponent) {
  //     return;
  //   }

  //   // props.onOlderThanSelected({
  //   //   timeComponent: selectedTimeComponent.name,
  //   //   componentValue: selectedTimeValue,
  //   // });
  // }, [selectedTimeComponent, selectedTimeValue]);

  // useEffect(() => {
  //   if (!selectedTimeComponent) {
  //     return;
  //   }

  //   if (selectedTimeValue > getTimeComponentMax(selectedTimeComponent)) {
  //     setSelectedTimeValue(getTimeComponentMax(selectedTimeComponent));
  //     setValue(getTimeComponentMax(selectedTimeComponent));
  //   }
  // }, [selectedTimeComponent]);

  const newLocal = selectedComparator?.comparator == 'lt';
  return (
    <div className="flex flex-col md:flex-row">
      <p className="mr-3 mt-3 font-medium">{props.entityName}</p>

      <div className="flex flex-row md:flex-row">
        <Listbox
          multiple={false}
          value={selectedComparator}
          onChange={setSelectedTimeComponentValue}
        >
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full min-w-[100px] cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
              <span className="block truncate">{selectedComparator?.displayName}</span>
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
                          {value.displayName}
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

        <Input
          type="number"
          min={1}
          //max={inputMax}
          value={selectedValue}
          onChange={e => {
            // Probably not 100 if a flat value
            const val = Math.max(0, Math.min(100, parseInt(e.target.value)));
            // setSelectedTimeValue(val);
            setValue(val);
          }}
          className="mt-1 ml-3 mr-2 w-[120px]"
        />

        <div className="items-center justify-center center flex">
          {props.valueType == 'p' ? '%' : ''}
        </div>
      </div>
    </div>
  );
}
