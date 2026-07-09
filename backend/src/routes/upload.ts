import { Router } from 'express';
import multer from 'multer';
import Papa from 'papaparse';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvString = req.file.buffer.toString('utf-8');
    
    // Parse CSV
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // results.data contains the array of raw parsed objects
        const rawRecords = results.data;
        const totalRows = rawRecords.length;
        
        // Return a preview (e.g., first 5 rows) and the full data to the client
        // Or better, just return the full parsed JSON array so the client can preview and then batch it to the extract API
        res.json({
          message: 'File parsed successfully',
          totalRows,
          data: rawRecords,
          preview: rawRecords.slice(0, 5)
        });
      },
      error: (error: any) => {
        res.status(500).json({ error: 'Error parsing CSV file', details: error.message });
      }
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
