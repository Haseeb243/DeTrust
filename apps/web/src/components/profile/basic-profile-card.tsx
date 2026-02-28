"use client";

import Image from 'next/image';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { uploadApi, userApi, type User } from '@/lib/api';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';

interface BasicProfileCardProps {
  user?: User | null;
  onUpdated?: (user: User) => void;
}

export function BasicProfileCard({ user, onUpdated }: BasicProfileCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  useEffect(() => {
    register('avatarUrl');
  }, [register]);

  const currentAvatar = watch('avatarUrl');

  useEffect(() => {
    reset({
      name: user?.name || '',
      avatarUrl: user?.avatarUrl || '',
    });
    setPreviewUrl(user?.avatarUrl || '');
  }, [reset, user?.avatarUrl, user?.name]);

  useEffect(() => {
    setPreviewUrl(currentAvatar || '');
  }, [currentAvatar]);

  const { objectUrl: secureAvatarUrl, isLoading: secureAvatarLoading } = useSecureObjectUrl(previewUrl);

  const onSubmit = async (values: { name: string; avatarUrl: string }) => {
    setIsSaving(true);
    const response = await userApi.updateMe({
      name: values.name.trim() || undefined,
      avatarUrl: values.avatarUrl.trim() || undefined,
    });
    setIsSaving(false);

    if (!response.success || !response.data) {
      toast.error(response.error?.message || 'Unable to update profile');
      return;
    }

    toast.success('Profile basics updated');
    onUpdated?.(response.data as User);
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error('Please choose an image smaller than 4 MB.');
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    const response = await uploadApi.uploadAvatar(file);
    setIsUploading(false);
    event.target.value = '';

    if (!response.success || !response.data) {
      toast.error(response.error?.message || 'Upload failed, please try again');
      return;
    }

    setValue('avatarUrl', response.data.url, { shouldDirty: true, shouldTouch: true });
    toast.success('Avatar uploaded — hit Save basics to publish it.');
  };

  const clearAvatar = () => {
    setValue('avatarUrl', '', { shouldDirty: true, shouldTouch: true });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const copyWallet = async () => {
    if (!user?.walletAddress || typeof navigator === 'undefined') return;
    await navigator.clipboard.writeText(user.walletAddress);
    toast.success('Wallet address copied');
  };

  return (
    <Card className="border-dt-border bg-dt-surface shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-dt-text">Account basics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm text-dt-text-muted">Profile image</label>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-dt-border bg-dt-surface-alt">
                {secureAvatarUrl ? (
                  <Image src={secureAvatarUrl} alt={user?.name || 'Avatar'} fill className="object-cover" sizes="80px" unoptimized />
                ) : secureAvatarLoading && previewUrl ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : previewUrl ? (
                  <div className="flex h-full w-full items-center justify-center text-xs text-dt-text-muted">Secure preview unavailable</div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🪪</div>
                )}
              </div>
              <div className="space-y-2 text-sm text-dt-text-muted">
                <p className="text-xs text-dt-text-muted">Square images work best. We cap uploads at 4&nbsp;MB per FR-C3.1.</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={openFileDialog} disabled={isUploading}>
                    {isUploading ? 'Uploading…' : 'Upload photo'}
                  </Button>
                  {previewUrl ? (
                    <Button type="button" variant="ghost" disabled={isUploading} onClick={clearAvatar}>
                      Remove
                    </Button>
                  ) : null}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-dt-text-muted">Display name</label>
            <Input placeholder="Add your preferred name" {...register('name')} className="mt-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-dt-text-muted">Email</label>
              <Input value={user?.email || '—'} disabled className="mt-2" />
            </div>
            <div>
              <label className="text-sm text-dt-text-muted">Wallet</label>
              <div className="mt-2 flex items-center gap-2">
                <Input value={user?.walletAddress || 'Not paired yet'} disabled />
                {user?.walletAddress && (
                  <Button type="button" variant="secondary" size="icon" onClick={copyWallet}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? 'Saving…' : 'Save basics'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default BasicProfileCard;
