'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

export default function FAQ() {
  return (
    <Card className="mx-6 my-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <dl className="list-decimal ml-6 leading-loose">
          <dt>
            <strong>What is Haargos?</strong>
          </dt>
          <dd>
            Haargos is a monitoring and analytics platform for Home Assistant, providing
            in-depth insights, alarms, remote execution capabilities and support for your
            smart home environment.
          </dd>

          <dt>
            <strong>How can I install Haargos?</strong>
          </dt>
          <dd>
            Haargos can be installed either as a Home Assistant addon or as a docker image
            if you are running Home Assistant in a docker environment.
          </dd>

          <dt>
            <strong>Is Haargos easy to install?</strong>
          </dt>
          <dd>
            Haargos is designed for easy installation as a Home Assistant add-on, or as a
            separate docker image.
          </dd>

          <dt>
            <strong>
              Can I install Haargos using docker compose or using docker run?
            </strong>
          </dt>
          <dd>
            Yes! Take a look at our docker images{' '}
            <a
              className="text-blue-600"
              href="https://hub.docker.com/repositories/haargos"
              target="_blank"
            >
              here
            </a>{' '}
            or create an account with an installation to see the get started guide.
          </dd>

          <dt>
            <strong>How secure is Haargos?</strong>
          </dt>
          <dd>
            Haargos prioritizes security and only reads data which it needs for
            operational purposes. Haargos does not sell any of your data.
          </dd>

          <dt>
            <strong>Does Haargos store my smart home data?</strong>
          </dt>
          <dd>
            Haargos collects minimal data necessary for analytics and monitoring, stored
            securely.
          </dd>

          <dt>
            <strong>Can I use Haargos for free?</strong>
          </dt>
          <dd>
            Haargos offers a 2-week free Explorer tier trial, with various subscription
            plans available afterward.
          </dd>

          <dt>
            <strong>What kind of support does Haargos offer?</strong>
          </dt>
          <dd>We provide support including email support and contact forms.</dd>

          <dt>
            <strong>Will Haargos work with all my Home Assistant hardware?</strong>
          </dt>
          <dd>
            Haargos is designed for compatibility with aarch64, amd64, armhf, armv7 and
            i386.
          </dd>

          <dt>
            <strong>How often is Haargos updated?</strong>
          </dt>
          <dd>Our team regularly updates Haargos for new features and compatibility.</dd>

          <dt>
            <strong>How can I provide feedback or suggest a feature for Haargos?</strong>
          </dt>
          <dd>
            Feedback and suggestions can be shared through our official website's contact
            form and customer support email at{' '}
            <a className="text-blue-600" href="mailto: contact@haargos.com">
              contact AT haargos DOT com
            </a>
            .
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}
