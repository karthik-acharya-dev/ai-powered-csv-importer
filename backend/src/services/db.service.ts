import { GoogleGenAI } from '@google/genai';

export interface Lead {
  id: string;
  org_id: string;
  source: { type: string };
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  location: any;
  custom_fields: any;
  created_at: { _seconds: number; _nanoseconds: number };
  updated_at: { _seconds: number; _nanoseconds: number };
  owner_uid: string;
  owner_name: string;
  crm: {
    status: string;
    quality: string;
    call_status_today: string;
    next_follow_up: string | null;
    last_contacted_at?: { _seconds: number; _nanoseconds: number };
  };
}

export interface Activity {
  id: string;
  type: string;
  org_id?: string;
  lead_id?: string;
  title: string;
  description: string;
  direction?: string;
  metadata?: {
    call_id?: string;
    campaign_id?: string;
    content?: string;
  };
  created_by_uid?: string | null;
  created_by_type?: string;
  created_at: { _seconds: number; _nanoseconds: number };
  updated_at: { _seconds: number; _nanoseconds: number };
}

// Helpers
const makeTimestamp = (dateStr: string) => {
  const ms = new Date(dateStr).getTime();
  return {
    _seconds: Math.floor(ms / 1000),
    _nanoseconds: (ms % 1000) * 1000000
  };
};

export const organisations = [
  {
    "id": "Sb9JUEJHd7ZjmhYLYBrh",
    "owner_uid": "uybOXAPhh1NFtuUSExurEaZxBh92",
    "created_at": { "_seconds": 1773291944, "_nanoseconds": 967000000 },
    "updated_at": { "_seconds": 1773291944, "_nanoseconds": 967000000 },
    "slug": "acme-corp",
    "is_active": true,
    "name": "Test Corp",
    "role": "owner"
  },
  {
    "id": "ZqxylZwSJdq4u08LwZbV",
    "name": "GrowEasy AI",
    "slug": "groweasy-ai-ZqxylZwSJdq4u08LwZbV",
    "owner_uid": "uybOXAPhh1NFtuUSExurEaZxBh92",
    "is_active": true,
    "created_at": { "_seconds": 1775192080, "_nanoseconds": 291000000 },
    "updated_at": { "_seconds": 1775192080, "_nanoseconds": 291000000 },
    "role": "owner"
  },
  {
    "id": "mUvc2OtNbJ9bo1K2hyVu",
    "slug": "designeasy-ai-mUvc2OtNbJ9bo1K2hyVu",
    "owner_uid": "uybOXAPhh1NFtuUSExurEaZxBh92",
    "is_active": true,
    "created_at": { "_seconds": 1773649278, "_nanoseconds": 678000000 },
    "updated_at": { "_seconds": 1773649278, "_nanoseconds": 678000000 },
    "name": "VK Test",
    "role": "owner"
  }
];

export let leads: Lead[] = [
  {
    "id": "sORaB0SUbUJIBjZxndDa_sachin",
    "org_id": "ZqxylZwSJdq4u08LwZbV",
    "source": { "type": "WEBSITE" },
    "name": "KALAKAR FILMS (SACHIN SINGH)",
    "first_name": "Sachin",
    "last_name": "Singh",
    "email": "kalakarfilmss@gmail.com",
    "mobile": "+919519777777",
    "country_code": "+91",
    "mobile_without_country_code": "9519777777",
    "company": "Kalakarfilms",
    "location": {},
    "custom_fields": { "acquisition_source": "web" },
    "created_at": makeTimestamp("2026-05-19T04:55:00.000Z"),
    "updated_at": makeTimestamp("2026-05-19T10:30:00.000Z"),
    "owner_uid": "shivam_yadav_uid",
    "owner_name": "SHIVAM YADAV",
    "crm": {
      "status": "Bad Lead",
      "quality": "—",
      "call_status_today": "Done",
      "next_follow_up": null,
      "last_contacted_at": makeTimestamp("2026-05-19T10:30:00.000Z")
    }
  },
  {
    "id": "vampire_wadhawana_uid",
    "org_id": "ZqxylZwSJdq4u08LwZbV",
    "source": { "type": "WEBSITE" },
    "name": "Vampire wadhawana",
    "first_name": "Vampire",
    "last_name": "wadhawana",
    "email": "vampirewadhawana@gmail.com",
    "mobile": "+918104177777",
    "country_code": "+91",
    "mobile_without_country_code": "8104177777",
    "company": "USA PEOPLE'S",
    "location": {},
    "custom_fields": { "acquisition_source": "web" },
    "created_at": makeTimestamp("2026-05-19T03:53:00.000Z"),
    "updated_at": makeTimestamp("2026-05-19T03:53:00.000Z"),
    "owner_uid": "aiman_shakeel_uid",
    "owner_name": "Aiman Shakeel",
    "crm": {
      "status": "Not Dialed",
      "quality": "—",
      "call_status_today": "Mark done",
      "next_follow_up": null
    }
  },
  {
    "id": "Uq4PkdHh5d5NjLhxyvS5",
    "org_id": "ZqxylZwSJdq4u08LwZbV",
    "source": { "type": "WEBSITE" },
    "name": "Ayan Shah",
    "first_name": "Ayan",
    "last_name": "Shah",
    "email": "ayanshah70710@gmail.com",
    "mobile": "+917071077777",
    "country_code": "+91",
    "mobile_without_country_code": "7071077777",
    "company": "Cartoon md",
    "location": {},
    "custom_fields": { "acquisition_source": "web" },
    "created_at": makeTimestamp("2026-05-19T02:47:00.000Z"),
    "updated_at": makeTimestamp("2026-05-19T02:47:00.000Z"),
    "owner_uid": "mehak_agrawal_uid",
    "owner_name": "Mehak Agrawal",
    "crm": {
      "status": "Not Dialed",
      "quality": "—",
      "call_status_today": "Mark done",
      "next_follow_up": null,
      "last_contacted_at": makeTimestamp("2026-05-19T02:47:00.000Z")
    }
  }
];

// Dynamic generation to match 15 default leads
const owners = [
  { uid: "shivam_yadav_uid", name: "SHIVAM YADAV" },
  { uid: "aiman_shakeel_uid", name: "Aiman Shakeel" },
  { uid: "mehak_agrawal_uid", name: "Mehak Agrawal" },
  { uid: "vidhi_shingala_uid", name: "Vidhi Shingala" }
];
const companies = ["Alpha Corp", "Beta Tech", "Apex Labs", "CloudScale", "Nova Design"];
const names = ["Rohan Sharma", "Sneha Patel", "Ananya Rao", "Vikram Singh", "Kabir Mehta", "Priya Gupta", "Amit Verma"];
const sources = ["WEBSITE", "WEBHOOK", "WA_MESSAGE"];

for (let i = 0; i < 15; i++) {
  const id = `dynamic_lead_${i + 10}`;
  const name = names[i % names.length];
  const first_name = name.split(" ")[0];
  const last_name = name.split(" ")[1] || "";
  const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}@example.com`;
  const mobile = `+9198765${String(i).padStart(5, '0')}`;
  const company = companies[i % companies.length];
  const owner = owners[i % owners.length];
  const source = sources[i % sources.length];
  const createdDate = new Date(new Date("2026-05-18T09:00:00.000Z").getTime() - i * 6 * 3600 * 1000);
  
  leads.push({
    id,
    org_id: "ZqxylZwSJdq4u08LwZbV",
    source: { type: source },
    name,
    first_name,
    last_name,
    email,
    mobile,
    country_code: "+91",
    mobile_without_country_code: mobile.substring(3),
    company,
    location: {},
    custom_fields: { acquisition_source: "web" },
    created_at: makeTimestamp(createdDate.toISOString()),
    updated_at: makeTimestamp(createdDate.toISOString()),
    owner_uid: owner.uid,
    owner_name: owner.name,
    crm: {
      status: i % 4 === 0 ? "Contacted" : "Not Dialed",
      quality: i % 5 === 0 ? "Warm" : "—",
      call_status_today: "Mark done",
      next_follow_up: null
    }
  });
}

export let activities: Record<string, Activity[]> = {
  "sORaB0SUbUJIBjZxndDa_sachin": [
    {
      "id": "act_1",
      "type": "PHONE_CALL",
      "org_id": "ZqxylZwSJdq4u08LwZbV",
      "lead_id": "sORaB0SUbUJIBjZxndDa_sachin",
      "title": "Outbound Call Made",
      "description": "Outbound call initiated by SHIVAM YADAV using did 919484958203",
      "direction": "OUTBOUND",
      "metadata": { "call_id": "call_331f0807e51d40f2" },
      "created_at": makeTimestamp("2026-05-19T10:30:00.000Z"),
      "updated_at": makeTimestamp("2026-05-19T10:30:00.000Z")
    },
    {
      "id": "act_2",
      "type": "CUSTOM",
      "title": "Campaign Created",
      "description": "New \"Photography and Videography\" campaign created in draft",
      "metadata": {
        "content": "Promoting cinematic wedding production shoots and reels."
      },
      "created_at": makeTimestamp("2026-05-19T04:56:00.000Z"),
      "updated_at": makeTimestamp("2026-05-19T04:56:00.000Z")
    }
  ]
};

// Generate default activity timelines for all other leads
leads.forEach(lead => {
  if (lead.id !== "sORaB0SUbUJIBjZxndDa_sachin") {
    activities[lead.id] = [
      {
        "id": `activity_gen_${lead.id}_1`,
        "type": "WA_MESSAGE",
        "direction": "OUTBOUND",
        "title": "WhatsApp Message Sent",
        "description": "Initial greeting sent via WhatsApp",
        "metadata": {
          "content": `Hi ${lead.name},\nWelcome to GrowEasy! Let's get your campaign started.`
        },
        "created_at": { _seconds: lead.created_at._seconds + 10, _nanoseconds: 0 },
        "updated_at": { _seconds: lead.created_at._seconds + 10, _nanoseconds: 0 }
      },
      {
        "id": `activity_gen_${lead.id}_2`,
        "type": "NEW_LEAD",
        "title": "Lead Generated",
        "description": `New lead captured from ${lead.source.type.toLowerCase()}`,
        "created_at": { ...lead.created_at },
        "updated_at": { ...lead.created_at }
      }
    ];
  }
});

// Database manipulation interfaces
export class DatabaseService {
  static getLeads() {
    return leads;
  }

  static getLead(id: string) {
    return leads.find(l => l.id === id);
  }

  static getActivities(leadId: string) {
    return activities[leadId] || [];
  }

  static updateLead(id: string, updates: Partial<Lead>) {
    const idx = leads.findIndex(l => l.id === id);
    if (idx !== -1) {
      leads[idx] = {
        ...leads[idx],
        ...updates,
        crm: {
          ...leads[idx].crm,
          ...(updates.crm || {})
        }
      };
      return leads[idx];
    }
    return null;
  }

  static addLead(lead: Lead) {
    leads.unshift(lead);
    // Add default activities
    activities[lead.id] = [
      {
        "id": `activity_gen_${lead.id}_2`,
        "type": "NEW_LEAD",
        "title": "Lead Generated (CSV Import)",
        "description": `Lead successfully mapped by Gemini AI into CRM format from CSV.`,
        "created_at": { ...lead.created_at },
        "updated_at": { ...lead.created_at }
      }
    ];
    return lead;
  }
}
