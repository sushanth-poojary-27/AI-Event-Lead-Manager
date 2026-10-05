import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FollowUpStatus } from "../../../../generated/prisma/client";

const VALID_STATUSES = Object.values(FollowUpStatus);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function parseLeadId(idParam: string): number | null {
  const parsed = Number(idParam);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseLeadId(id);

    if (leadId === null) {
      return NextResponse.json(
        { error: "Invalid lead ID. Must be a positive integer." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { error: `Lead with ID ${leadId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error("Error fetching lead by ID:", error);

    return NextResponse.json(
      { error: "Failed to fetch lead. Internal server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseLeadId(id);

    if (leadId === null) {
      return NextResponse.json(
        { error: "Invalid lead ID. Must be a positive integer." },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: `Lead with ID ${leadId} not found.` },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    const { name, company, email, event, notes, followUpStatus } = body;
    const updateData: Record<string, unknown> = {};
    const errors: string[] = [];

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        errors.push("Field 'name' must be a non-empty string.");
      } else {
        updateData.name = name.trim();
      }
    }

    if (company !== undefined) {
      if (typeof company !== "string" || !company.trim()) {
        errors.push("Field 'company' must be a non-empty string.");
      } else {
        updateData.company = company.trim();
      }
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        errors.push("Field 'email' must be a non-empty string.");
      } else if (!isValidEmail(email.trim())) {
        errors.push("Field 'email' must be a valid email address.");
      } else {
        updateData.email = email.trim().toLowerCase();
      }
    }

    if (event !== undefined) {
      if (typeof event !== "string" || !event.trim()) {
        errors.push("Field 'event' must be a non-empty string.");
      } else {
        updateData.event = event.trim();
      }
    }

    if (notes !== undefined) {
      if (typeof notes !== "string" || !notes.trim()) {
        errors.push("Field 'notes' must be a non-empty string.");
      } else {
        updateData.notes = notes.trim();
      }
    }

    if (followUpStatus !== undefined) {
      const formattedStatus = String(followUpStatus).trim().toUpperCase();

      if (!VALID_STATUSES.includes(formattedStatus as FollowUpStatus)) {
        errors.push(
          `Invalid 'followUpStatus'. Allowed values: ${VALID_STATUSES.join(", ")}`
        );
      } else {
        updateData.followUpStatus = formattedStatus as FollowUpStatus;
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "At least one valid field must be provided to update." },
        { status: 400 }
      );
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error("Error updating lead:", error);

    return NextResponse.json(
      { error: "Failed to update lead. Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseLeadId(id);

    if (leadId === null) {
      return NextResponse.json(
        { error: "Invalid lead ID. Must be a positive integer." },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: `Lead with ID ${leadId} not found.` },
        { status: 404 }
      );
    }

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json(
      { message: `Lead with ID ${leadId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lead:", error);

    return NextResponse.json(
      { error: "Failed to delete lead. Internal server error." },
      { status: 500 }
    );
  }
}