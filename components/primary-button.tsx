import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/registry/new-york/ui/button';
import { VariantProps } from 'class-variance-authority';
import { MouseEventHandler } from 'react';

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  };

export function PrimaryButton({ ...props }: PrimaryButtonProps) {
  return (
    <Button
      variant={props.variant}
      onClick={props.onClick}
      disabled={props.disabled}
      className={cn(props.className, 'hover:bg-sr-700 bg-sr-600 dark:text-white')}
    >
      {props.children}
    </Button>
  );
}
