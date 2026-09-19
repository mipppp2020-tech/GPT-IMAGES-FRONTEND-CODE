import type { Lead, TechJob, QcInspectionType } from './types'

export interface QcQueueItem {
  lead: Lead
  type: QcInspectionType
}

/** PRD §14.1 trigger: "shaft marked ready by customer" — i.e. exactly
 * Customer's own qc_wait stage (token paid, shaft-readiness checklist
 * fully done). §14.2 trigger: technician has finished every SOP step. */
export function selectQcQueue(leads: Lead[], techJobs: TechJob[]): QcQueueItem[] {
  const queue: QcQueueItem[] = []
  for (const lead of leads) {
    const shaftDone = (lead.shaftReadiness ?? []).length > 0 && (lead.shaftReadiness ?? []).every((i) => i.done)
    if (lead.status === 'won_awaiting_shaft' && lead.payments?.token && shaftDone) {
      queue.push({ lead, type: 'shaft' })
    }
    const job = techJobs.find((j) => j.leadId === lead.id)
    if (lead.status === 'installing' && job?.stage === 'done') {
      queue.push({ lead, type: 'final' })
    }
  }
  return queue.sort((a, b) => b.lead.createdAt - a.lead.createdAt)
}
