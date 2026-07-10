import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy_key'
});

export interface CRMRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: 'GOOD_LEAD_FOLLOW_UP' | 'DID_NOT_CONNECT' | 'BAD_LEAD' | 'SALE_DONE' | '';
  crm_note?: string;
  data_source?: 'leads_on_demand' | 'meridian_tower' | 'eden_park' | 'varah_swamy' | 'sarjapur_plots' | '';
  possession_time?: string;
  description?: string;
}

export interface ExtractionResult {
  successRecords: CRMRecord[];
  skippedRecords: any[];
}

export const extractCrmDataBatch = async (records: any[]): Promise<ExtractionResult> => {
  if (process.env.GEMINI_API_KEY === 'dummy_key' || !process.env.GEMINI_API_KEY) {
    // For local testing without API key, just mock the response
    return mockExtraction(records);
  }

  const prompt = `
You are an intelligent data extraction AI. I am providing you with a JSON array of raw records from a CSV file.
Your task is to map these records into a specific CRM format.

Rules:
1. Target Fields: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description.
2. crm_status must be EXACTLY one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE. If you cannot determine, leave it blank or map to best fit.
3. data_source must be EXACTLY one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. Leave blank if unsure.
4. created_at must be a valid ISO format string or compatible with JavaScript's new Date().
5. Multiple emails: primary goes to "email", others appended to "crm_note".
6. Multiple mobiles: primary goes to "mobile_without_country_code", others appended to "crm_note".
7. crm_note should contain any remarks, follow-up notes, extra numbers/emails, or unmapped useful info.
8. SKIP INVALID: If a row does NOT have an email AND does NOT have a phone number, it is invalid. Do NOT include it in the output array. (We will handle skipped rows by comparing input vs output).

Input JSON:
${JSON.stringify(records)}

Return ONLY a JSON array of the mapped valid records. Make sure the structure strictly matches the Target Fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text;
    if (!outputText) throw new Error('Empty response from AI');

    const parsedRecords = JSON.parse(outputText) as CRMRecord[];
    
    // Post-process to separate skipped records
    const successRecords: CRMRecord[] = [];
    const skippedRecords: any[] = [];

    // Simple validation loop
    for (const raw of records) {
      // Find match based on email or phone loosely to see if it was extracted
      // A better way is to do the skipping validation strictly in code.
      const hasEmail = JSON.stringify(raw).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const hasPhone = JSON.stringify(raw).match(/\d{7,}/);
      
      if (!hasEmail && !hasPhone) {
        skippedRecords.push(raw);
      } else {
        // Assume AI returned it if it had email/phone
        // We will just return what AI parsed as success (AI might have filtered some)
      }
    }
    
    // Actually let's just strictly enforce the 'skip invalid' rule here on the AI output
    const finalSuccess = parsedRecords.filter(r => (r.email && r.email.trim() !== '') || (r.mobile_without_country_code && r.mobile_without_country_code.trim() !== ''));

    // To find skipped, we compare counts. For accurate skipped list, we check raw records that don't meet criteria.
    const finalSkipped = records.filter(raw => {
      const stringified = JSON.stringify(raw).toLowerCase();
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(stringified);
      const hasPhone = /\d{7,}/.test(stringified);
      return !hasEmail && !hasPhone;
    });

    return {
      successRecords: finalSuccess,
      skippedRecords: finalSkipped
    };

  } catch (error) {
    console.error('AI Extraction Failed', error);
    throw error;
  }
};

// Mock function for testing without API key
const mockExtraction = (records: any[]): ExtractionResult => {
  const successRecords: CRMRecord[] = [];
  const skippedRecords: any[] = [];

  records.forEach(r => {
    const stringified = JSON.stringify(r).toLowerCase();
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(stringified);
    const hasPhone = /\d{7,}/.test(stringified);

    if (!hasEmail && !hasPhone) {
      skippedRecords.push(r);
    } else {
      successRecords.push({
        name: r.name || r['First Name'] || r.Contact || 'Unknown',
        email: r.email || r.Email || r.Mail || '',
        mobile_without_country_code: r.phone || r.Phone || r.Mobile || '',
        crm_status: 'GOOD_LEAD_FOLLOW_UP',
        created_at: r.date || new Date().toISOString(),
      });
    }
  });

  return { successRecords, skippedRecords };
};
