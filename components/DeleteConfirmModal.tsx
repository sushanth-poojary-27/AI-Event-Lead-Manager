"use client";

import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  leadName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  leadName,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <span className="text-lg">!</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Delete Event Lead
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Are you sure you want to delete lead{" "}
              <span className="font-semibold text-slate-900">
                {leadName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Lead"}
          </button>
        </div>
      </div>
    </div>
  );
};