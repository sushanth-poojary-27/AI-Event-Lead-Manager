"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import {
  Lead,
  LeadFormData,
  LeadFilterState,
} from "@/types/lead";

import { LeadFilters } from "@/components/LeadFilters";
import { LeadList } from "@/components/LeadList";
import { LeadFormModal } from "@/components/LeadFormModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export default function EventLeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<LeadFilterState>({
    search: "",
    status: "",
    event: "",
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.search) {
        params.append("search", filters.search);
      }

      if (filters.status) {
        params.append("status", filters.status);
      }

      if (filters.event) {
        params.append("event", filters.event);
      }

      const query = params.toString();
      const url = query
        ? `/api/leads?${query}`
        : "/api/leads";

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to load event leads.");
      }

      const data: Lead[] = await res.json();
      setLeads(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const availableEvents = useMemo(() => {
    const eventsSet = new Set<string>();

    leads.forEach((lead) => {
      if (lead.event) {
        eventsSet.add(lead.event);
      }
    });

    return Array.from(eventsSet);
  }, [leads]);

  const handleFormSubmit = async (formData: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const isEditing = Boolean(editingLead);

      const url = isEditing
        ? `/api/leads/${editingLead?.id}`
        : "/api/leads";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Failed to save lead."
        );
      }

      setIsFormModalOpen(false);
      setEditingLead(null);

      await fetchLeads();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while saving.";

      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/leads/${deletingLead.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(
          errorData.error || "Failed to delete lead."
        );
      }

      setDeletingLead(null);

      await fetchLeads();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting.";

      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingLead(null);
    setIsFormModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      event: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                E8
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Event Lead Manager
              </h1>
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Capture, organize, and track event connections seamlessly
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="mr-1.5 text-base">+</span>
            Add Lead
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError(null)}
              className="font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <LeadFilters
          filters={filters}
          onChange={setFilters}
          availableEvents={availableEvents}
          onReset={handleResetFilters}
        />

        <LeadList
          leads={leads}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={(lead) => setDeletingLead(lead)}
          onAddLeadClick={handleOpenCreate}
        />
      </main>

      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingLead}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingLead)}
        leadName={deletingLead?.name || ""}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}