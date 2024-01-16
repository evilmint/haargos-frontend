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
              Haargos offers a monitoring service for Home Assistant instances. This
              includes the collection of various types of information, such as logs,
              add-ons, and notifications, to provide insights and improve system
              performance. Users need to download and run an agent on their servers to
              enable this functionality.
            </p>
          </li>

          <li>
            <strong>Data Collection and Usage</strong>
            <p>
              We collect data essential for providing and enhancing our service, including
              but not limited to automations, device and entity names, logs,
              notifications, and add-on information. We do not collect personal or
              sensitive information unless explicitly authorized by you.
            </p>
          </li>
          <li>
            <strong>Data Protection and Privacy</strong>
            <p>
              Your data's privacy and security are paramount. All data is encrypted during
              transit and storage. For detailed information on our data handling
              practices, please refer to our Privacy Policy.
            </p>
          </li>

          <li>
            <strong>User Responsibilities</strong>
            <p>
              You are responsible for the accuracy of the data provided and maintaining
              the security of your Home Assistant instances.
            </p>
          </li>

          <li>
            <strong>Service Use and Limitations</strong>
            <p>
              Haargos is not liable for any damages arising from your use of our service,
              including indirect or incidental damages or data loss. Users must comply
              with all applicable laws and regulations while using our service.
            </p>
          </li>

          <li>
            <strong>Termination of Service</strong>
            <p>
              We reserve the right to terminate or restrict your access to our service for
              violations of these terms or other misuse.
            </p>
          </li>

          <li>
            <strong>Modifications to Terms</strong>
            <p>
              These Terms of Service may be updated periodically. We will provide notice
              of significant changes through our website.
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
              contact us at <a href="mailto:support@haargos.com">support@haargos.com</a>.
            </p>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}
