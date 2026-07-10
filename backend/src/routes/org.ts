import { Router, Request, Response } from 'express';
import { DatabaseService, organisations } from '../services/db.service';

const router = Router();

// GET /api/org/leads
router.get('/leads', (req: Request, res: Response) => {
  const leads = DatabaseService.getLeads();
  res.json({
    data: leads,
    last_cursor_id: leads.length > 0 ? leads[leads.length - 1].id : null
  });
});

// GET /api/org/leads/:id
router.get('/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = DatabaseService.getLead(id);
  
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  const activities = DatabaseService.getActivities(id);

  res.json({
    data: {
      lead,
      activities
    }
  });
});

// PATCH /api/org/leads/:id
router.patch('/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const lead = DatabaseService.getLead(id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  // Update logic matching Next.js API route handler
  const updates: any = {};
  
  if (body.owner_name !== undefined) {
    updates.owner_name = body.owner_name;
    const ownersMap: Record<string, string> = {
      "SHIVAM YADAV": "shivam_yadav_uid",
      "Aiman Shakeel": "aiman_shakeel_uid",
      "Mehak Agrawal": "mehak_agrawal_uid",
      "Vidhi Shingala": "vidhi_shingala_uid"
    };
    updates.owner_uid = ownersMap[body.owner_name] || lead.owner_uid;
  }

  if (body.crm !== undefined) {
    updates.crm = {
      ...lead.crm,
      ...body.crm
    };
  }

  const updatedLead = DatabaseService.updateLead(id, updates);

  res.json({
    data: {
      lead: updatedLead,
      activities: DatabaseService.getActivities(id)
    }
  });
});

export default router;
