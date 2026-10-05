"use client";

import React, { useEffect, useState } from "react";
import {
  Lead,
  LeadFormData,
  FollowUpStatus,
} from "@/types/lead";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  initialData?: Lead | null;
  isSubmitting: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    company: "",
    email: "",
    event: "",
    notes: "",
    followUpStatus: "PENDING",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        company: initialData.company,
        email: initialData.email,
        event: initialData.event,
        notes: initialData.notes,
        followUpStatus: initialData.followUpStatus,
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        event: "",
        notes: "",
        followUpStatus: "PENDING",
      });
    }

    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.event.trim()) {
      newErrors.event = "Event name is required.";
    }

    if (!formData.notes.trim()) {
      newErrors.notes = "Notes are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim().toLowerCase(),
        event: formData.event.trim(),
        notes: formData.notes.trim(),
      });
    } catch {
      // Parent handles the error state.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Lead Details" : "Add New Event Lead"}
          </h2>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Full Name *
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Sarah Connor"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                  errors.name
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-300"
                }`}
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Company *
              </label>

              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g. Cyberdyne Systems"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                  errors.company
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-300"
                }`}
              />

              {errors.company && (
                <p className="mt-1 text-xs text-red-600">{errors.company}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address *
              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="sarah@cyberdyne.com"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                  errors.email
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-300"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Event Name *
              </label>

              <input
                type="text"
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                placeholder="e.g. AI Tech Summit 2026"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                  errors.event
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-300"
                }`}
              />

              {errors.event && (
                <p className="mt-1 text-xs text-red-600">{errors.event}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Follow-Up Status
            </label>

            <select
              value={formData.followUpStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  followUpStatus: e.target.value as FollowUpStatus,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="PENDING">Pending</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Event Notes & Interaction *
            </label>

            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Captured discussion points, requirements, or next steps..."
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                errors.notes
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />

            {errors.notes && (
              <p className="mt-1 text-xs text-red-600">{errors.notes}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};