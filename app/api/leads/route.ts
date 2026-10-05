import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FollowUpStatus, Prisma } from "../../../generated/prisma/client";

const VALID_STATUSES = Object.values(FollowUpStatus);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const statusParam = searchParams.get("status")?.trim().toUpperCase();
    const eventParam = searchParams.get("event")?.trim();

    const where: Prisma.LeadWhereInput = {};

    if (statusParam) {
      if (!VALID_STATUSES.includes(statusParam as FollowUpStatus)) {
        return NextResponse.json(
          {
            error: `Invalid status filter '${statusParam}'. Allowed values: ${VALID_STATUSES.join(", ")}`,
          },
          { status: 400 }
        );
      }

      where.followUpStatus = statusParam as FollowUpStatus;
    }

    if (eventParam) {
      where.event = {
        equals: eventParam,
        mode: "insensitive",
      };
    }

    if (search) {
      const searchCondition: Prisma.LeadWhereInput = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { event: { contains: search, mode: "insensitive" } },
        ],
      };

      if (where.AND) {
        where.AND = Array.isArray(where.AND)
          ? [...where.AND, searchCondition]
          : [where.AND, searchCondition];
      } else {
        where.AND = [searchCondition];
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);

    return NextResponse.json(
      { error: "Failed to fetch leads. Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    const { name, company, email, event, notes, followUpStatus } = body;

    const errors: string[] = [];

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("Field 'name' is required.");
    }

    if (!company || typeof company !== "string" || !company.trim()) {
      errors.push("Field 'company' is required.");
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      errors.push("Field 'email' is required.");
    } else if (!isValidEmail(email.trim())) {
      errors.push("Field 'email' must be a valid email address.");
    }

    if (!event || typeof event !== "string" || !event.trim()) {
      errors.push("Field 'event' is required.");
    }

    if (!notes || typeof notes !== "string" || !notes.trim()) {
      errors.push("Field 'notes' is required.");
    }

    let statusValue: FollowUpStatus = FollowUpStatus.PENDING;

    if (followUpStatus !== undefined && followUpStatus !== null) {
      const formattedStatus = String(followUpStatus).trim().toUpperCase();

      if (!VALID_STATUSES.includes(formattedStatus as FollowUpStatus)) {
        errors.push(
          `Invalid 'followUpStatus'. Allowed values: ${VALID_STATUSES.join(", ")}`
        );
      } else {
        statusValue = formattedStatus as FollowUpStatus;
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const newLead = await prisma.lead.create({
      data: {
        name: name.trim(),
        company: company.trim(),
        email: email.trim().toLowerCase(),
        event: event.trim(),
        notes: notes.trim(),
        followUpStatus: statusValue,
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);

    return NextResponse.json(
      { error: "Failed to create lead. Internal server error." },
      { status: 500 }
    );
  }
}