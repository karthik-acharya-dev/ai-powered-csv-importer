import { Router, Request, Response } from 'express';
import { organisations } from '../services/db.service';

const router = Router();

// GET /api/users/organisations
router.get('/organisations', (req: Request, res: Response) => {
  res.json({
    data: organisations
  });
});

export default router;
