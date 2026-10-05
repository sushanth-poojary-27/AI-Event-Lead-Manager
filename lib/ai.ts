type LeadInput = {
  name: string;
  company: string;
  email: string;
  event: string;
  notes: string;
  followUpStatus: string;
};

function generateSummary(lead: LeadInput) {
  const notes = lead.notes.trim();

  if (!notes) {
    return `${lead.name} from ${lead.company} was met at ${lead.event}. No detailed notes were recorded yet.`;
  }

  return `${lead.name} from ${lead.company} was met at ${lead.event}. The key discussion point was: ${notes}. Recommended next step: follow up based on the conversation and current status (${lead.followUpStatus}).`;
}

function generateFollowUp(lead: LeadInput) {
  const notes = lead.notes.trim();

  return `Hi ${lead.name},

It was great connecting with you at ${lead.event}. I enjoyed learning more about ${lead.company}.

${notes ? `I especially appreciated our conversation about ${notes}.` : "I appreciated the opportunity to connect and learn more about your work."}

I'd be happy to continue the conversation and explore how we might stay in touch.

Best,
Sushanth`;
}

export async function generateLeadAI(
  action: "summary" | "followup",
  lead: LeadInput,
) {
  if (action === "summary") {
    return generateSummary(lead);
  }

  return generateFollowUp(lead);
}