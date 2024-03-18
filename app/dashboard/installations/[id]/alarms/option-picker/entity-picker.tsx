import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

export interface EntityOption {
  id: string;
  displayName: string;
}

export interface EntityPickerProps<T extends EntityOption> {
  label: string;
  entities: T[];
  selectedEntities: T[];
  onSelect: (selectedEntities: T[]) => void;
  allowsMultipleSelection?: boolean;
}

export function EntityPicker<T extends EntityOption>({
  label,
  entities,
  selectedEntities: initialSelected,
  onSelect,
  allowsMultipleSelection,
}: EntityPickerProps<T>) {
  const [selectedEntities, setSelectedEntities] = useState<T[]>([]);

  useEffect(() => {
    const selectedIds = initialSelected.map(i => i.id);
    const newSelectedEntities = entities.filter(e => selectedIds.includes(e.id));

    setSelectedEntities(newSelectedEntities);
  }, [initialSelected, entities]);
  3;
  return (
    <div className="flex flex-col md:flex-row">
      <p className="mr-3 mt-3 font-medium">
        {label}
        {`${allowsMultipleSelection ? 's' : ''}`}
      </p>
      <Listbox
        multiple={allowsMultipleSelection ?? true}
        value={selectedEntities}
        disabled={entities.length === 0}
        onChange={selected => {
          setSelectedEntities(selected);
          onSelect(selected);
        }}
      >
        <div className="max-w-[400px] md:w-[400px] relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
            <span className="block truncate">
              {entities.length > 0
                ? selectedEntities.length > 0
                  ? selectedEntities.map(entity => entity.displayName).join(', ')
                  : `Pick a${
                      ['a', 'e', 'i', 'o', 'u'].includes(label[0].toLocaleLowerCase())
                        ? 'n'
                        : ''
                    } ${label.toLowerCase()}...`
                : `No ${label.toLocaleLowerCase()}s found`}
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
              {entities.map((entity, entityIdx) => (
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
