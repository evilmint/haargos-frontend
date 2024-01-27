'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

export default function PrivacyPolicy() {
  return (
    <Card className="mx-6 my-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect,
          use, and protect your personal information when you use Haargos.
        </p>

        <ol className="list-decimal ml-6 leading-loose">
          <li>
            <strong>Information We Collect</strong>
            <p>
              We collect information from your Home Assistant instance, including
              automations, scripts, logs (core, supervisor-related), notifications,
              add-ons, device and entity names, and other related data. We ensure your
              entities do not contain personal information you do not wish to share.
              Configuration analysis is performed only locally by the agent and only with
              your explicit consent. We do not send or store your configuration.yml or
              secrets.yml data. For data removal requests, contact us at{' '}
              <a href="mailto:gdpr@haargos.com">gdpr@haargos.com</a>.
            </p>
          </li>

          <li>
            <strong>How We Use Your Information</strong>
            <p>
              The information we collect is used solely for providing and improving our
              monitoring service and for data-driven decisions and statistical analysis.
              Data is aggregated and anonymized to ensure privacy. We do not sell, share,
              or distribute your data to third parties without explicit consent.
            </p>
          </li>

          <li>
            <strong>Remote Action Execution</strong>
            <p>
              Our service includes features that allow for the remote execution of actions
              on your Home Assistant installation, such as updating add-ons or the system
              itself. When you use these features, we may collect data related to the
              execution of these actions, including action types, timestamps, and
              execution status.
            </p>
          </li>

          <li>
            <strong>Consent for Remote Actions</strong>
            <p>
              By using the remote action execution features of Haargos, you provide
              explicit consent for us to initiate these actions on your behalf and to
              collect data related to these actions. We take measures to ensure that only
              authorized actions are executed and that the data collected is securely
              handled.
            </p>
          </li>

          <li>
            <strong>Security of Remote Actions</strong>
            <p>
              We prioritize the security of your Home Assistant installation and take
              steps to ensure that remote actions are securely transmitted and executed.
              This includes encryption of command transmissions and strict authentication
              mechanisms. We recommend you also follow best security practices on your end
              to further safeguard your system.
            </p>
          </li>

          <li>
            <strong>Impact of Remote Actions on Privacy</strong>
            <p>
              While we aim to minimize the impact of remote actions on your privacy, it's
              important to understand that certain actions may indirectly involve
              processing of personal data, such as device names or identifiers. We ensure
              that such data is handled in accordance with this Privacy Policy and
              applicable data protection laws.
            </p>
          </li>

          <li>
            <strong>Data Storage and Security</strong>
            <p>
              Data transmitted to our servers is encrypted and stored securely. We employ
              various security measures for data protection.
            </p>
          </li>

          <li>
            <strong>GDPR Compliance and Personal Data</strong>
            <p>
              We comply with GDPR. Users have the right to access, rectify, or delete
              personal data. An option to delete your Haargos account and associated
              personal data is available.
            </p>
          </li>

          <li>
            <strong>Third-party Services</strong>
            <p>
              We do not share your data with third-party services unless necessary for our
              service or required by law.
            </p>
          </li>

          <li>
            <strong>International Data Transfer</strong>
            <p>
              We transfer, store, and process your information in data centers located in
              the United States. We ensure adequate data protection in all jurisdictions.
            </p>
          </li>

          <li>
            <strong>Use of Cookies</strong>
            <p>
              Cookies are used to maintain the functionality of our website and for
              authentication purposes.
            </p>
          </li>

          <li>
            <strong>Changes to this Privacy Policy</strong>
            <p>
              We may update our Privacy Policy periodically. The latest version is always
              available on our website.
            </p>
          </li>

          <li>
            <strong>Contact</strong>
            <p>
              For questions or concerns regarding this Privacy Policy, please contact us
              at <a href="mailto:support@haargos.com">support@haargos.com</a>.
            </p>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}
