'use client';
import { AlarmConfiguration, AlarmType } from '@/app/types';
import { Accordion } from '@/registry/default/ui/accordion';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/new-york/ui/accordion';
import { useState } from 'react';

export interface AlarmTypePickerProps {
  configurations: AlarmConfiguration[];
  onAlarmSelected?: (item: AlarmType | null) => void;
}

export function AlarmTypePicker(params: AlarmTypePickerProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <Accordion type="single" collapsible>
      {params.configurations.map((configuration: AlarmConfiguration) => {
        return (
          <AccordionItem key={configuration.name} value={`item-${configuration.name}`}>
            <AccordionTrigger>{configuration.name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-grow flex-wrap justify-between">
                {configuration.alarmTypes.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (item.disabled) {
                        return;
                      }

                      if (selectedItem == item.name) {
                        setSelectedItem(null);
                        params.onAlarmSelected?.(null);
                        return;
                      }
                      setSelectedItem(item.name);

                      params.onAlarmSelected?.(item);
                    }}
                    className={`w-[100%] md:w-[30%] mb-2 ${
                      item.disabled
                        ? 'text-gray-400'
                        : 'cursor-pointer hover:text-blue-700 dark:hover:text-gray-300'
                    } font-medium rounded-lg bg-gray-100 dark:bg-gray-700 px-6 py-5 text-center border-2 ${
                      selectedItem === item.name
                        ? 'border-blue-500 dark:border-blue-600'
                        : 'dark:border-gray-800 border-gray-100'
                    }`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
