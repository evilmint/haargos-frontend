import { useInstallationStore } from '@/app/services/stores';
import { NotesForm } from '@/components/ui/notes-form';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/registry/new-york/ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type NoteParams = {
  installationId: string;
};

export function Notes(params: NoteParams) {
  const { installationId } = params;
  const installations = useInstallationStore(state => state.installations);
  const installation = installations.find(i => i.id == installationId);

  const linkClassName = 'text-blue-700 font-regular cursor-pointer';

  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [showNewInstallationDialog, setShowNewInstallationDialog] = useState(false);

  const noteValue =
    installation && installation.notes.trim().length > 0 ? installation.notes + ' ' : '';

  return (
    <div>
      <NotesForm
        installationId={installationId}
        onUpdatedInstallation={installation => {
          setOpen(false);
        }}
        open={showNewInstallationDialog}
        onOpenChange={setShowNewInstallationDialog}
      >
        <div>
          <span style={{ whiteSpace: 'pre-wrap' }}>{noteValue}</span>
          {installation &&
            (installation.notes.trim().length > 0 ? (
              <span
                className={linkClassName}
                onClick={() => setShowNewInstallationDialog(true)}
              >
                Edit notes
              </span>
            ) : (
              <span
                className={linkClassName}
                onClick={() => setShowNewInstallationDialog(true)}
              >
                Add installation notes
              </span>
            ))}
        </div>
      </NotesForm>
    </div>
  );
}
