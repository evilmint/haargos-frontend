'use client';

import { createInstallation } from '@/app/services/installations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/new-york/ui/dialog';
import { useAuth0 } from '@auth0/auth0-react';
import { Input } from '@/registry/new-york/ui/input';
import { useState } from 'react';
import { Label } from '@/registry/new-york/ui/label';
import { Installation } from '@/app/types';
import { Button } from '@/registry/new-york/ui/button';
import { useInstallationStore } from '@/app/services/stores';

interface CreateInstallationFormProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  onCreateInstallation?: (installation: Installation) => void;
}

export function CreateInstallationForm({
  children,
  ...params
}: CreateInstallationFormProps) {
  const [isUpdating, setUpdating] = useState<boolean>(false);

  const { getAccessTokenSilently } = useAuth0();
  const [nameValue, setNameValue] = useState('');
  const [instanceValue, setInstanceValue] = useState('');

  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (nameValue.trim().length > 0) {
      setUpdating(true);

      try {
        const accessToken = await getAccessTokenSilently();
        const installation = await createInstallation(
          accessToken,
          instanceValue,
          nameValue,
        );

        if (installation != null && params.onCreateInstallation != null) {
          params.onCreateInstallation(installation);
        }

        asyncFetch();
      } catch (error) {
        console.error(error);
      } finally {
        params.onOpenChange?.(false);
        setUpdating(false);
      }
    }
  };

  const handleChange = (event: any) => {
    if (event.target.id == 'url') {
      setInstanceValue(event.target.value);
    } else if (event.target.id == 'name') {
      setNameValue(event.target.value);
    }
  };

  return (
    <Dialog open={params.open} onOpenChange={params.onOpenChange}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create installation</DialogTitle>
          <DialogDescription>Add a new HomeAssistant installation</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" onChange={handleChange} placeholder="My Parents' Home" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Public HomeAssistant URL (optional)</Label>
              <Input
                id="url"
                onChange={handleChange}
                placeholder="https://my.homeassistant.url"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isUpdating}
            variant="outline"
            onClick={() => params.onOpenChange?.(false)}
          >
            Cancel
          </Button>
          <Button disabled={isUpdating} type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
