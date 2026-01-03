import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Content Tools - Ahsan AI Hub',
  description: 'Access premium AI writing, blog generation, resume building, code explaining, and math solving tools for free.',
  alternates: {
    canonical: '/content-tools',
  },
};

export default function ContentToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
