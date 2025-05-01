import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Provider - Affidavit App',
  description: 'Edit provider details',
};

export default function EditProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 