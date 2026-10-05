"use client";

import React from "react";
import { LeadFilterState } from "@/types/lead";

interface LeadFiltersProps {
  filters: LeadFilterState;
  onChange: (filters: LeadFilterState) => void;
  availableEvents: string[];
  onReset: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onChange,
  availableEvents,
  onReset,
}) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.event
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              onChange({
                ...filters,
                search: e.target.value,
              })
            }
            placeholder="Search name, company, email..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          />
        </div>

        <div>
          <select
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONTACTED">Contacted</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <select
            value={filters.event}
            onChange={(e) =>
              onChange({
                ...filters,
                event: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            <option value="">All Events</option>

            {availableEvents.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};