import { Router } from 'express';
import { extractCrmDataBatch } from '../services/ai.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty records array' });
    }

    // Call AI Service
    const extractedData = await extractCrmDataBatch(records);
    
    res.json(extractedData);

  } catch (error: any) {
    console.error('Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract CRM data', details: error.message });
  }
});

export default router;
