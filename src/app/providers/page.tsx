'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Eye, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProviders } from '@/hooks/useProviders';
import Layout from '@/components/shared/Layout';

// Use the Provider type from our hook
type Provider = {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  fax?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  attentionInfo?: string;
  hipaaRequired?: boolean;
  hipaaSamplePath?: string;
  brFaxNumber?: string;
  mrFaxNumber?: string;
  brEmailId?: string;
  mrEmailId?: string;
  mrPortalLink?: string;
  mrPortalProviderId?: string;
  brPortalLink?: string;
  brPortalProviderId?: string;
  brMailingAddress?: string;
  mrMailingAddress?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProvidersPage() {
  const { providers, isLoading, error } = useProviders();
  const router = useRouter();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-gray-600">Loading providers...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-600">Error: {error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Providers</h1>
          <Link href="/providers/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Provider
            </Button>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>HIPAA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers && providers.length > 0 ? (
                providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{provider.address || "—"}</div>
                        {provider.attentionInfo && (
                          <div className="text-sm text-muted-foreground">
                            Attn: {provider.attentionInfo}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{provider.email || provider.brEmailId || "—"}</div>
                        <div className="text-sm text-muted-foreground">
                          {provider.phone || "—"}
                        </div>
                        {provider.fax && (
                          <div className="text-sm text-muted-foreground">
                            Fax: {provider.fax}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>
                          {provider.city ? `${provider.city}, ${provider.state || ""} ${provider.zipCode || ""}` : "—"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {provider.hipaaRequired ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <Badge variant="outline">Not Required</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/providers/${provider.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/providers/${provider.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No providers found. Click "Add Provider" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
} 