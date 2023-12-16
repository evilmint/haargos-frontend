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
              We collect information from your Home Assistant instance, which may include
              automations, scripts, scenes, logs, host information (volumes, memory, network, last boot, CPU, architecture), device and entity names, and other Home Assistant related data. Make sure your
              entities don't contain personal information you do not wish to share. If you
              have shared data you wish to remove, contact us at{' '}
              <a href="mailto:gdpr@haargos.com">gdpr@haargos.com</a>.
            </p>
          </li>

          <li>
            <strong>How We Use Your Information</strong>
            <p>
              The information we collect is used solely for the purpose of providing and
              improving our monitoring service. We do not sell, share, or distribute your
              data to third parties without your explicit consent.
            </p>
          </li>

          <li>
            <strong>Data Storage and Security</strong>
            <p>
              All data transmitted to our servers is encrypted and stored securely. We
              employ a variety of security measures to ensure the protection of your data
              against unauthorized access, alteration, or destruction.
            </p>
          </li>

          <li>
            <strong>GDPR Compliance and Personal Data</strong>
            <p>
              We comply with the General Data Protection Regulation (GDPR). Users have the
              right to access, rectify, or delete their personal data. We provide an
              option to delete your Haargos account, thereby removing all associated
              personal data from our systems.
            </p>
          </li>

          <li>
            <strong>Third-party Services</strong>
            <p>
              We do not share your data with third-party services unless necessary for the
              functionality of our service or if required by law.
            </p>
          </li>

          <li>
            <strong>Changes to this Privacy Policy</strong>
            <p>
              We may update our Privacy Policy from time to time. We will notify users of
              any changes and always have the most recent version available on our
              website.
            </p>
          </li>

          <li>
            <strong>Contact</strong>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please
              contact us at <a href="mailto:support@haargos.com">support@haargos.com</a>.
            </p>
          </li>

          <li>
            <strong>International Data Transfer</strong>
            <p>
              To provide our services, we transfer, store, and process your information in
              data centers located in the United States. This means that your information
              may be subject to U.S. laws and regulations, which may differ from those in
              your country. We take appropriate measures, including standard contractual
              clauses, to ensure that your data receives an adequate level of protection
              in the jurisdictions in which we process it.
            </p>
          </li>

          <li>
            <strong>Use of Cookies</strong>
            <p>
              We use cookies to maintain the functionality of our website.
            </p>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}
