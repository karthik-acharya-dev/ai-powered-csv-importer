import { Router } from 'express';
import { extractCrmDataBatch } from '../services/ai.service';
import { DatabaseService, Lead } from '../services/db.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty records array' });
    }

    // Call AI Service
    const extractedData = await extractCrmDataBatch(records);
    
    // Add success records directly to database service
    if (extractedData && Array.isArray(extractedData.successRecords)) {
      extractedData.successRecords.forEach((item: any, index: number) => {
        const crmLead: Lead = {
          id: `imported_lead_${Date.now()}_${index}`,
          org_id: "ZqxylZwSJdq4u08LwZbV",
          source: { type: "WEBSITE" },
          name: item.name || 'Unknown',
          first_name: (item.name || '').split(' ')[0] || '',
          last_name: (item.name || '').split(' ').slice(1).join(' ') || '',
          email: item.email || '—',
          mobile: item.mobile_without_country_code ? `${item.country_code || '+91'}${item.mobile_without_country_code}` : '—',
          country_code: item.country_code || '+91',
          mobile_without_country_code: item.mobile_without_country_code || '',
          company: item.company || '—',
          location: {
            city: item.city || '',
            state: item.state || '',
            country: item.country || ''
          },
          custom_fields: { crm_note: item.crm_note || '' },
          created_at: item.created_at ? { _seconds: Math.floor(new Date(item.created_at).getTime() / 1000), _nanoseconds: 0 } : { _seconds: Math.floor(Date.now() / 1000), _nanoseconds: 0 },
          updated_at: { _seconds: Math.floor(Date.now() / 1000), _nanoseconds: 0 },
          owner_uid: 'shivam_yadav_uid',
          owner_name: item.lead_owner || 'SHIVAM YADAV',
          crm: {
            status: item.crm_status === 'GOOD_LEAD_FOLLOW_UP' ? 'Good Lead' : 
                    item.crm_status === 'SALE_DONE' ? 'Won' : 
                    item.crm_status === 'DID_NOT_CONNECT' ? 'Not Dialed' : 'Bad Lead',
            quality: item.crm_status === 'GOOD_LEAD_FOLLOW_UP' ? 'Warm' : '—',
            call_status_today: item.crm_status === 'SALE_DONE' ? 'Done' : 'Mark done',
            next_follow_up: null
          }
        };
        DatabaseService.addLead(crmLead);
      });
    }

    res.json(extractedData);

  } catch (error: any) {
    console.error('Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract CRM data', details: error.message });
  }
});

export default router;
