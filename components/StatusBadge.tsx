"use client";

import React from "react";
import { FollowUpStatus } from "@/types/lead";

interface StatusBadgeProps {
  status: FollowUpStatus;
}

const statusConfig: Record<
  FollowUpStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10",
  },
  CONTACTED: {
    label: "Contacted",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10",
  },
  FOLLOW_UP: {
    label: "Follow Up",
    className:
      "bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10",
  },
  CLOSED: {
    label: "Closed",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {config.label}
    </span>
  );
};