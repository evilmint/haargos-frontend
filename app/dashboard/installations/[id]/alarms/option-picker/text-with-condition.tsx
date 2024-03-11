'use client';
import { TextMatcher, TextMatcherOption } from '@/app/types';
import { Input } from '@/components/ui/input';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

export interface TextInputWithMatcherProps {
  entityName: string;
  initialMatcherOption?: TextMatcherOption | undefined;
  onMatcherOptionSelected: (matcherOption: TextMatcherOption) => void;
}

type DisplayableMatcher = { matcher: TextMatcher; displayName: string };

export function TextInputWithMatcher(props: TextInputWithMatcherProps) {
  const matcher = props.initialMatcherOption?.matcher ?? 'contains';
  const values: DisplayableMatcher[] = [
    {
      matcher: 'exactly',
      displayName: 'is exactly',
    },
    {
      matcher: 'contains',
      displayName: 'contains',
    },
    {
      matcher: 'prefix',
      displayName: 'starts with',
    },
    {
      matcher: 'suffix',
      displayName: 'ends with',
    },
  ];

  const [selectedMatcher, setSelectedMatcher] = useState<DisplayableMatcher | null>({
    matcher: matcher,
    displayName:
      values.find(a => a.matcher == props.initialMatcherOption?.text ?? 'contains')
        ?.displayName ?? 'Contains',
  });

  const [selectedValue, setValue] = useState<string>(
    props.initialMatcherOption?.text ?? '',
  );

  useEffect(() => {
    if (!selectedMatcher?.matcher) {
      return;
    }

    props.onMatcherOptionSelected({
      matcher: selectedMatcher.matcher,
      text: selectedValue,
      caseSensitive: true, // TODO: Should be easy
    });
  }, [selectedValue, selectedMatcher]);

  return (
    <div className="flex flex-col md:flex-row">
      <p className="mr-3 mt-3 font-medium">{props.entityName}</p>

      <div className="flex flex-row md:flex-row">
        <Listbox multiple={false} value={selectedMatcher} onChange={setSelectedMatcher}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full min-w-[150px] cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sr-600 sm:text-sm">
              <span className="block truncate">{selectedMatcher?.displayName}</span>
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
          type="text"
          defaultValue={selectedValue}
          onChange={e => {
            setValue(e.target.value);
          }}
          className="mt-1 ml-3 mr-2 min-w-[120px]"
        />
      </div>
    </div>
  );
}
