import { extractCrmDataBatch } from '../src/services/ai.service';

describe('AI Service Extraction', () => {
  it('should mock extraction and skip invalid records correctly without API key', async () => {
    const rawData = [
      { "First Name": "John", "Phone": "9876543210" }, // valid (has phone)
      { "Name": "Jane", "Email": "jane@example.com" }, // valid (has email)
      { "Company": "Acme Corp", "Status": "Lead" } // invalid (no email/phone)
    ];

    // Assuming dummy key is used locally during test
    const result = await extractCrmDataBatch(rawData);

    expect(result.successRecords.length).toBe(2);
    expect(result.skippedRecords.length).toBe(1);
    expect(result.skippedRecords[0].Company).toBe("Acme Corp");
  });
});
