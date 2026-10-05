"use client";

import React from "react";
import { Lead } from "@/types/lead";
import LeadCard from "./LeadCard";

interface LeadListProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddLeadClick: () => void;
}

export const LeadList: React.FC<LeadListProps> = ({
  leads,
  isLoading,
  onEdit,
  onDelete,
  onAddLeadClick,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-xl border border-slate-200 bg-slate-100 p-5"
          />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <span className="text-xl">👥</span>
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No event leads found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No leads match your current criteria, or none have been added yet.
        </p>

        <button
          onClick={onAddLeadClick}
          className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          + Add First Lead
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};