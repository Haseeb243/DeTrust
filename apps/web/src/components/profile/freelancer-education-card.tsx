"use client";

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui';
import { userApi, type EducationEntry, type EducationPayload } from '@/lib/api';

const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required').max(200),
  degree: z.string().min(2, 'Add your degree or certification').max(200),
  fieldOfStudy: z.string().max(200).optional(),
  startMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format').optional().or(z.literal('')),
  endMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
});

const monthToISO = (value?: string | null) => (value ? `${value}-01T00:00:00.000Z` : undefined);

const formatMonth = (value?: string | null) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
  } catch {
    return null;
  }
};

const formatRange = (start?: string | null, end?: string | null) => {
  const startLabel = formatMonth(start) ?? 'Start TBD';
  const endLabel = end ? formatMonth(end) : 'Present';
  return `${startLabel} — ${endLabel}`;
};

const sortEducation = (education: EducationEntry[]) =>
  [...education].sort((a, b) => {
    const aDate = new Date(a.endDate || a.startDate || 0).getTime();
    const bDate = new Date(b.endDate || b.startDate || 0).getTime();
    return bDate - aDate;
  });

type EducationFormValues = z.infer<typeof educationSchema>;

interface FreelancerEducationCardProps {
  education?: EducationEntry[];
  onAdded?: (entry: EducationEntry) => void;
  onRemoved?: (id: string) => void;
  onSync?: () => Promise<void> | void;
}

export function FreelancerEducationCard({ education = [], onAdded, onRemoved, onSync }: FreelancerEducationCardProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const orderedEducation = useMemo(() => sortEducation(education), [education]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startMonth: '',
      endMonth: '',
      description: '',
    },
  });

  const onSubmit = async (values: EducationFormValues) => {
    const payload: EducationPayload = {
      institution: values.institution.trim(),
      degree: values.degree.trim(),
      fieldOfStudy: values.fieldOfStudy?.trim() || undefined,
      startDate: monthToISO(values.startMonth),
      endDate: monthToISO(values.endMonth),
      description: values.description?.trim() || undefined,
    };

    const response = await userApi.addEducation(payload);

    if (!response.success || !response.data) {
      toast.error(response.error?.message || 'Could not add education entry');
      return;
    }

    toast.success('Education entry added');
    reset();
    onAdded?.(response.data as EducationEntry);
    await onSync?.();
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    const response = await userApi.removeEducation(id);
    setRemovingId(null);

    if (!response.success) {
      toast.error(response.error?.message || 'Unable to remove education entry');
      return;
    }

    toast.success('Education entry removed');
    onRemoved?.(id);
    await onSync?.();
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base text-slate-900">
          <span className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            Education timeline
          </span>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">FR-C3.1 signal</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {orderedEducation.length ? (
            orderedEducation.map((entry) => (
              <div key={entry.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{entry.degree}</p>
                    <p className="text-sm text-slate-600">{entry.institution}</p>
                    <p className="text-xs text-slate-500">{formatRange(entry.startDate, entry.endDate)}</p>
                    {entry.fieldOfStudy ? (
                      <p className="mt-1 text-xs text-slate-500">Focus: {entry.fieldOfStudy}</p>
                    ) : null}
                    {entry.description ? (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{entry.description}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(entry.id)}
                    disabled={removingId === entry.id}
                    aria-label="Remove education entry"
                  >
                    <Trash2 className={`h-4 w-4 ${removingId === entry.id ? 'animate-pulse text-amber-500' : 'text-slate-400'}`} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No education entries yet. Chronicle your alma mater or flagship bootcamp so AI capability scans have richer data.
            </div>
          )}
        </div>

        <form className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Institution</label>
              <Input placeholder="MIT" className="mt-2" {...register('institution')} />
              {errors.institution ? <p className="mt-1 text-xs text-red-500">{errors.institution.message}</p> : null}
            </div>
            <div>
              <label className="text-sm text-slate-600">Degree or program</label>
              <Input placeholder="BSc Computer Science" className="mt-2" {...register('degree')} />
              {errors.degree ? <p className="mt-1 text-xs text-red-500">{errors.degree.message}</p> : null}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm text-slate-600">Field of study</label>
              <Input placeholder="Distributed Systems" className="mt-2" {...register('fieldOfStudy')} />
              {errors.fieldOfStudy ? <p className="mt-1 text-xs text-red-500">{errors.fieldOfStudy.message}</p> : null}
            </div>
            <div>
              <label className="text-sm text-slate-600">Start month</label>
              <Input type="month" className="mt-2" {...register('startMonth')} />
              {errors.startMonth ? <p className="mt-1 text-xs text-red-500">{errors.startMonth.message}</p> : null}
            </div>
            <div>
              <label className="text-sm text-slate-600">End month</label>
              <Input type="month" className="mt-2" {...register('endMonth')} />
              {errors.endMonth ? <p className="mt-1 text-xs text-red-500">{errors.endMonth.message}</p> : null}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Highlights</label>
            <Textarea rows={3} placeholder="Share notable research, leadership, or thesis work." className="mt-2" {...register('description')} />
            {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description.message}</p> : null}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Add education signal'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default FreelancerEducationCard;
