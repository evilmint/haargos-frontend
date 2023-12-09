'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

export default function TermsOfService() {
  return (
    <Card className="mx-6 my-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Terms of Service</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ol className="list-decimal ml-6 leading-loose">
          <li>
            <strong>Acceptance of Terms</strong>
            <p>
              By accessing or using Haargos, you agree to comply with and be bound by
              these Terms of Service. If you do not agree to these terms, please do not
              use our service.
            </p>
          </li>

          <li>
            <strong>Description of Service</strong>
            <p>
              Haargos provides an online monitoring service for Home Assistant instances.
              Admins must download an agent and run it on their servers to enable
              monitoring.
            </p>
          </li>

          <li>
            <strong>Data Collection</strong>
            <ol type="a">
              <li>
                Our agent collects certain information from your Home Assistant instance,
                which may include automation names, device names, and other related data.
              </li>
              <li>
                We do not collect personal or sensitive information unless explicitly
                provided by the user.
              </li>
              <li>
                All data is collected solely for the purpose of providing and improving
                our monitoring service.
              </li>
            </ol>
          </li>

          <li>
            <strong>Data Protection and Privacy</strong>
            <ol type="a">
              <li>
                We prioritize the privacy and protection of your data. Data transmitted to
                our servers is encrypted and stored securely.
              </li>
              <li>
                We will not sell, share, or distribute your data to third parties without
                your explicit consent.
              </li>
              <li>
                Please refer to our Privacy Policy for more detailed information on how we
                handle and protect your data.
              </li>
            </ol>
          </li>

          <li>
            <strong>User Responsibilities</strong>
            <ol type="a">
              <li>
                Users are responsible for ensuring the accuracy and integrity of the data
                they provide.
              </li>
              <li>
                Users are responsible for maintaining the security of their own Home
                Assistant instances and any data associated with them.
              </li>
            </ol>
          </li>

          <li>
            <strong>Limitation of Liability</strong>
            <p>
              Haargos shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues,
              whether incurred directly or indirectly, or any loss of data, use, goodwill,
              or other intangible losses resulting from your use of our service.
            </p>
          </li>

          <li>
            <strong>Termination</strong>
            <p>
              We reserve the right to terminate or suspend your access to our service
              without prior notice if you breach any of the terms outlined in this
              agreement.
            </p>
          </li>

          <li>
            <strong>Changes to the Terms of Service</strong>
            <p>
              We may update our Terms of Service from time to time. We will notify users
              of any changes and always have the most recent version available on our
              website.
            </p>
          </li>

          <li>
            <strong>Governing Law</strong>
            <p>
              These Terms of Service are governed by the laws of Poland. Any disputes
              arising out of or in connection with these terms shall be resolved in the
              courts of Poland.
            </p>
          </li>

          <li>
            <strong>Contact</strong>
            <p>
              For any questions or concerns regarding these Terms of Service, please
              contact us at{' '}
              <a href="mailto:support@haargos.com">
              support@haargos.com
              </a>
              .
            </p>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}
