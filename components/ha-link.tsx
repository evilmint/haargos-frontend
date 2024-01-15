import { cn } from '@/lib/utils';
import { Button } from '@tremor/react';
import { LucideExternalLink } from 'lucide-react';

type HALinkProps = {
  domain:
    | 'automations'
    | 'supervisor_add_addon_repository'
    | 'profile'
    | 'devices'
    | 'logs'
    | 'scenes'
    | 'entities'
    | 'addons'
    | 'scripts'
    | null;

  actionName?: string;
  instanceHost?: string;
  queryParams?: object;
  installationName?: string;
  className?: string;
};

function encodeQueryParams(params: Record<string, any>) {
  const query = Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    })
    .join('&');
  return query;
}

type HACustomLinkProps = {
  installationName?: string;
  instanceHost?: string;
  path: string;
  actionName?: string;
  className?: string;
};

export function HACustomLink({ ...props }: HACustomLinkProps) {
  const host = props.instanceHost;

  const href = `${host}/${props.path}`;

  return props.instanceHost ? (
    <Button
      className={cn(props?.className, 'mt-2')}
      icon={LucideExternalLink}
      variant="secondary"
      onClick={_ => {
        window.open(href, '_blank');
      }}
    >
      {props.installationName} {props.actionName}
    </Button>
  ) : (
    <></>
  );
}

export function HALink({ ...props }: HALinkProps) {
  const myHomeAssistantHost = 'https://my.home-assistant.io';
  const host = props.instanceHost ?? myHomeAssistantHost;

  const href = `${host}/${props.instanceHost ? '_my_' : ''}redirect/${props.domain}${
    props.queryParams ? `/?${encodeQueryParams(props.queryParams)}` : ``
  }`;

  return props.instanceHost ? (
    <Button
      className={cn(props?.className, 'mt-2')}
      icon={LucideExternalLink}
      variant="secondary"
      onClick={_ => {
        window.open(href, '_blank');
      }}
    >
      {props.installationName} {props.actionName ?? props.domain}
    </Button>
  ) : (
    <a className="mt-2 block" target="_blank" href={href}>
      <img src={`https://my.home-assistant.io/badges/${props.domain}.svg`}></img>
    </a>
  );
}
