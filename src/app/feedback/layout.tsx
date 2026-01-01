import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Give Feedback - Ahsan AI Hub',
  description: 'Help us improve Ahsan AI Hub. Share your thoughts, suggestions, and feedback directly with Ahsan Ali and the team. Your privacy is our priority.',
  openGraph: {
    title: 'Give Feedback - Ahsan AI Hub',
    description: 'Help us improve Ahsan AI Hub. Share your thoughts and feedback with us.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Give Feedback - Ahsan AI Hub',
    description: 'Share your thoughts and feedback with the Ahsan AI Hub team.',
  }
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
