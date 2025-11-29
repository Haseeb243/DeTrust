'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Briefcase, DollarSign, Plus, Trash2, X } from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { jobApi, skillApi, type CreateJobInput, type SkillSummary } from '@/lib/api';
import { useAuthStore } from '@/store';

const JOB_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Blockchain & Crypto',
  'AI & Machine Learning',
  'Data Science',
  'DevOps & Cloud',
  'UI/UX Design',
  'Product Management',
  'Marketing & Growth',
  'Writing & Content',
  'Other',
];

const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level', description: 'Looking for someone new to the field' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: '2-5 years of experience' },
  { value: 'EXPERT', label: 'Expert', description: '5+ years of experience' },
];

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const [formData, setFormData] = useState<CreateJobInput>({
    title: '',
    description: '',
    category: '',
    type: 'FIXED_PRICE',
    budget: undefined,
    hourlyRateMin: undefined,
    hourlyRateMax: undefined,
    estimatedHours: undefined,
    deadline: undefined,
    visibility: 'PUBLIC',
    experienceLevel: undefined,
    skillIds: [],
    attachments: [],
  });

  const [selectedSkills, setSelectedSkills] = useState<SkillSummary[]>([]);

  const fetchSkills = useCallback(async () => {
    try {
      const response = await skillApi.listSkills({ limit: 100 });
      if (response.success && response.data) {
        setSkills(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    if (user?.role !== 'CLIENT') {
      toast.error('Only clients can post jobs');
      router.push('/dashboard');
    }
  }, [user?.role, router]);

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.find((s) => s.id === skill.id)
  );

  const handleAddSkill = (skill: SkillSummary) => {
    if (selectedSkills.length >= 10) {
      toast.error('Maximum 10 skills allowed');
      return;
    }
    setSelectedSkills([...selectedSkills, skill]);
    setFormData((prev) => ({
      ...prev,
      skillIds: [...prev.skillIds, skill.id],
    }));
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
    setFormData((prev) => ({
      ...prev,
      skillIds: prev.skillIds.filter((id) => id !== skillId),
    }));
  };

  const handleSubmit = async (publish: boolean) => {
    // Validation
    if (!formData.title.trim() || formData.title.length < 10) {
      toast.error('Title must be at least 10 characters');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 100) {
      toast.error('Description must be at least 100 characters');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (formData.skillIds.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }
    if (formData.type === 'FIXED_PRICE' && (!formData.budget || formData.budget <= 0)) {
      toast.error('Please enter a valid budget');
      return;
    }
    if (
      formData.type === 'HOURLY' &&
      (!formData.hourlyRateMin || !formData.hourlyRateMax || formData.hourlyRateMin <= 0)
    ) {
      toast.error('Please enter valid hourly rates');
      return;
    }

    setLoading(true);
    try {
      const response = await jobApi.createJob(formData);
      if (response.success && response.data) {
        if (publish) {
          const publishResponse = await jobApi.publishJob(response.data.id);
          if (publishResponse.success) {
            toast.success('Job posted successfully!');
            router.push('/jobs/mine');
          } else {
            toast.success('Job created as draft');
            router.push('/jobs/mine');
          }
        } else {
          toast.success('Job saved as draft');
          router.push('/jobs/mine');
        }
      } else {
        toast.error(response.error?.message || 'Failed to create job');
      }
    } catch (error) {
      toast.error('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'CLIENT') {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Post a New Job</h1>
          <p className="text-slate-600">Fill in the details to find the perfect freelancer</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-slate-200 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
            <Briefcase className="h-5 w-5 text-emerald-500" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Job Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Full Stack Developer for DeFi Project"
              className="border-slate-200"
            />
            <p className="mt-1 text-xs text-slate-500">
              {formData.title.length}/10 characters minimum
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="">Select a category</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the job in detail. Include project goals, deliverables, timeline expectations..."
              rows={8}
              className="border-slate-200"
            />
            <p className="mt-1 text-xs text-slate-500">
              {formData.description.length}/100 characters minimum
            </p>
          </div>

          {/* Skills */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Required Skills * (max 10)
            </label>
            <div className="relative">
              <Input
                value={skillSearch}
                onChange={(e) => {
                  setSkillSearch(e.target.value);
                  setShowSkillDropdown(true);
                }}
                onFocus={() => setShowSkillDropdown(true)}
                placeholder="Search and add skills..."
                className="border-slate-200"
              />
              {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                  {filteredSkills.slice(0, 10).map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span>{skill.name}</span>
                      <span className="text-xs text-slate-400">{skill.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="flex items-center gap-1 bg-emerald-100 text-emerald-700"
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-emerald-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Job Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Job Type *
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'FIXED_PRICE' }))}
                className={`rounded-lg border p-4 text-left transition ${
                  formData.type === 'FIXED_PRICE'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-medium text-slate-900">Fixed Price</div>
                <div className="text-sm text-slate-500">Pay a fixed amount for the project</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'HOURLY' }))}
                className={`rounded-lg border p-4 text-left transition ${
                  formData.type === 'HOURLY'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-medium text-slate-900">Hourly</div>
                <div className="text-sm text-slate-500">Pay by the hour</div>
              </button>
            </div>
          </div>

          {/* Budget / Rates */}
          {formData.type === 'FIXED_PRICE' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Budget (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, budget: Number(e.target.value) }))
                  }
                  placeholder="1000"
                  className="border-slate-200 pl-9"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Min Hourly Rate (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="number"
                    value={formData.hourlyRateMin || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hourlyRateMin: Number(e.target.value) }))
                    }
                    placeholder="25"
                    className="border-slate-200 pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Max Hourly Rate (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="number"
                    value={formData.hourlyRateMax || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hourlyRateMax: Number(e.target.value) }))
                    }
                    placeholder="50"
                    className="border-slate-200 pl-9"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Experience Level */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Experience Level
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      experienceLevel: level.value as 'ENTRY' | 'INTERMEDIATE' | 'EXPERT',
                    }))
                  }
                  className={`rounded-lg border p-3 text-left transition ${
                    formData.experienceLevel === level.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-medium text-slate-900">{level.label}</div>
                  <div className="text-xs text-slate-500">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Deadline (optional)
            </label>
            <Input
              type="date"
              value={formData.deadline?.split('T')[0] || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                }))
              }
              className="border-slate-200"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="border-slate-200"
        >
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="bg-emerald-500 text-white hover:bg-emerald-600"
        >
          {loading ? <Spinner size="sm" /> : 'Post Job'}
        </Button>
      </div>
    </div>
  );
}
