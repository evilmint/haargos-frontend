import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { CheckIcon } from '@radix-ui/react-icons';
import { Fragment, useEffect, useState } from 'react';
import { EntityOption } from './entity-picker';

export interface StatOption extends EntityOption {
  id: string;
  function: string;
  displayName: string;
}

export interface StatisticalFunctionPickerProps {
  installationId: string;
  initialStatOption?: StatOption | undefined;
  onStatOptionSelected: (statOption: StatOption) => void;
}

export function StatisticalFunctionPicker({
  initialStatOption,
  onStatOptionSelected,
}: StatisticalFunctionPickerProps) {
  const statOptions: StatOption[] = [
    { id: 'avg', function: 'avg', displayName: 'Average' },
    { id: 'mean', function: 'mean', displayName: 'Mean' },
    { id: 'min', function: 'min', displayName: 'Min' },
    { id: 'max', function: 'max', displayName: 'Max' },
    { id: 'sum', function: 'sum', displayName: 'Sum' },
    { id: 'p90', function: 'p90', displayName: 'p90' },
  ];

  const [selectedEntity, setSelectedEntity] = useState<StatOption>(
    initialStatOption ?? statOptions[0],
  );

  useEffect(() => {
    onStatOptionSelected(selectedEntity);
  }, [selectedEntity]);

  return (
    <div className="flex flex-col md:flex-row">
      <p className="mr-3 mt-3 font-medium">Statistical function</p>
      <Listbox
        multiple={false}
        value={selectedEntity}
        onChange={selected => {
          setSelectedEntity(selected);
        }}
      >
        <div className="max-w-[400px] md:w-[400px] relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
            <span className="block truncate">{selectedEntity.displayName}</span>
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
              {statOptions.map((entity, entityIdx) => (
                <Listbox.Option
                  key={entityIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-sr-100 text-gray-900' : 'text-gray-900'
                    }`
                  }
                  value={entity}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {entity.displayName}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sr-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
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
