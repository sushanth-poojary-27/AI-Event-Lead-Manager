"use client";

import { useState } from "react";
import type { Lead } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";
import AIResultModal from "./AIResultModal";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function LeadCard({
  lead,
  onEdit,
  onDelete,
}: LeadCardProps) {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAI(action: "summary" | "followup") {
    setAiTitle(
      action === "summary"
        ? "AI Lead Summary"
        : "AI Follow-up Message",
    );

    setAiResult("");
    setAiOpen(true);
    setAiLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          lead,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate AI response");
      }

      setAiResult(data.result);
    } catch (error) {
      setAiResult(
        error instanceof Error
          ? error.message
          : "Unable to generate AI response",
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {lead.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {lead.company}
            </p>
          </div>

          <StatusBadge status={lead.followUpStatus} />
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Email:</span>{" "}
            {lead.email}
          </p>

          <p>
            <span className="font-medium text-slate-800">Event:</span>{" "}
            {lead.event}
          </p>
        </div>

        {lead.notes && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Notes
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {lead.notes}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleAI("summary")}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            AI Summary
          </button>

          <button
            type="button"
            onClick={() => handleAI("followup")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Draft Follow-up
          </button>
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </article>

      <AIResultModal
        open={aiOpen}
        title={aiTitle}
        result={aiResult}
        loading={aiLoading}
        onClose={() => setAiOpen(false)}
      />
    </>
  );
}