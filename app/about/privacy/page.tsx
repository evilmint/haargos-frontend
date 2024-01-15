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
              automations, logs (core, supervisor-related) notifications, add-ons, device
              and entity names, and other related data. Ensure your entities do not
              contain personal information you do not wish to share. We do not send or
              store your configuration.yml or secrets.yml data. Configuration analysis
              might be performed only by the agent and only at your explicit constent that
              can be withdrawn at any time and only for the purpose of providing you tips
              or information to improve your instance. For data removal requests, contact
              us at <a href="mailto:gdpr@haargos.com">gdpr@haargos.com</a>.
            </p>
          </li>

          <li>
            <strong>How We Use Your Information</strong>
            <p>
              The information we collect is used solely for providing and improving our
              monitoring service. We do not sell, share, or distribute your data to third
              parties without explicit consent. Data is aggregated and anonymized for
              data-driven decisions and statistical analysis.
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
