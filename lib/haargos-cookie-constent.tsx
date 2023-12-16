import Link from 'next/link';
import CookieConsent from 'react-cookie-consent';

export function HaargosCookieConsent() {
  return (
    <CookieConsent
      style={{ fontSize: '14px', background: '#2488d7' }}
      buttonStyle={{
        color: '#111111',
        borderRadius: '3px',
        backgroundColor: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
      }}
      buttonText={'Accept'}
    >
      We use essential cookies on our website to maintain your authentication session and
      ensure maintain core website functionality. For more information, please read our{' '}
      <Link className="underline" href="/about/privacy">
        Privacy Policy
      </Link>
      .
    </CookieConsent>
  );
}
