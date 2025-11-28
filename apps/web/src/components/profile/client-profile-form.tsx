"use client";

import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui';
import { userApi, type ClientProfile } from '@/lib/api';

const clientProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  companySize: z.string().optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  companyWebsite: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
});

export type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

interface ClientProfileFormProps {
  profile?: ClientProfile | null;
  onUpdated?: (profile: ClientProfile) => void;
}

export function ClientProfileForm({ profile, onUpdated }: ClientProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema) as Resolver<ClientProfileFormValues>,
    defaultValues: {
      companyName: profile?.companyName || '',
      companySize: profile?.companySize || '',
      industry: profile?.industry || '',
      companyWebsite: profile?.companyWebsite || '',
      description: profile?.description || '',
      location: profile?.location || '',
    },
  });

  useEffect(() => {
    reset({
      companyName: profile?.companyName || '',
      companySize: profile?.companySize || '',
      industry: profile?.industry || '',
      companyWebsite: profile?.companyWebsite || '',
      description: profile?.description || '',
      location: profile?.location || '',
    });
  }, [profile, reset]);

  const onSubmit = async (values: ClientProfileFormValues) => {
    setIsSaving(true);

    const payload = {
      companyName: values.companyName,
      companySize: values.companySize?.trim() || undefined,
      industry: values.industry?.trim() || undefined,
      companyWebsite: values.companyWebsite?.trim() || undefined,
      description: values.description?.trim() || undefined,
      location: values.location?.trim() || undefined,
    };

    const response = await userApi.updateClientProfile(payload);
    setIsSaving(false);

    if (!response.success || !response.data) {
      toast.error(response.error?.message || 'Unable to update client profile');
      return;
    }

    toast.success('Client profile saved');
    onUpdated?.(response.data);
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Client organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Company name</label>
              <Input placeholder="Atlas Robotics" {...register('companyName')} className="mt-2" />
              {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">Team size</label>
              <Input placeholder="11-50" {...register('companySize')} className="mt-2" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Industry</label>
              <Input placeholder="Climate fintech" {...register('industry')} className="mt-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Website</label>
              <Input placeholder="https://atlas.io" {...register('companyWebsite')} className="mt-2" />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600">Location</label>
            <Input placeholder="Toronto, CA" {...register('location')} className="mt-2" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Company narrative</label>
            <Textarea rows={5} placeholder="What should freelancers know before collaborating?" {...register('description')} className="mt-2" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ClientProfileForm;
