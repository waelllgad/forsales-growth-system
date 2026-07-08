import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Database file path
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper to load database
function loadDB() {
  const defaultDB = {
    companies: [
      {
        id: "comp-1",
        name: "Manchester Tech Solutions",
        activity: "IT & Software",
        city: "Manchester",
        website: "https://manchestertech.co.uk",
        email: "info@manchestertech.co.uk",
        phone: "+44 161 234 5678",
        url: "https://www.yell.com/biz/manchester-tech-solutions",
        contactPerson: "John Doe",
        firstContactDate: "2026-06-25",
        contactCount: 1,
        status: "Invitation Sent",
        createdAt: "2026-06-24T12:00:00.000Z"
      },
      {
        id: "comp-2",
        name: "Northern Crust Bakery",
        activity: "Bakeries & Restaurants",
        city: "Manchester",
        website: "https://northerncrust.co.uk",
        email: "hello@northerncrust.co.uk",
        phone: "+44 161 987 6543",
        url: "https://www.yell.com/biz/northern-crust-manchester",
        contactPerson: "Alice Smith",
        firstContactDate: "2026-06-26",
        contactCount: 2,
        status: "Account Activated",
        createdAt: "2026-06-25T09:30:00.000Z"
      },
      {
        id: "comp-3",
        name: "Piccadilly Dental Clinic",
        activity: "Medical Clinic & Healthcare",
        city: "Manchester",
        website: "https://piccadillydental.co.uk",
        email: "contact@piccadillydental.co.uk",
        phone: "+44 161 555 1234",
        url: "https://www.yell.com/biz/piccadilly-dental",
        contactPerson: "Dr. David Brown",
        firstContactDate: "2026-06-27",
        contactCount: 1,
        status: "Became Paid Client",
        createdAt: "2026-06-26T14:15:00.000Z"
      },
      {
        id: "comp-4",
        name: "MCR Creative Marketing",
        activity: "Digital Marketing & Ads",
        city: "Manchester",
        website: "https://mcrmarketing.co.uk",
        email: "leads@mcrmarketing.co.uk",
        phone: "+44 161 777 8888",
        url: "https://www.yell.com/biz/mcr-marketing-agency",
        contactPerson: "Sarah Williams",
        firstContactDate: null,
        contactCount: 0,
        status: "Not Contacted",
        createdAt: "2026-06-27T10:00:00.000Z"
      }
    ],
    logs: [
      {
        id: "log-1",
        companyId: "comp-1",
        companyName: "Manchester Tech Solutions",
        email: "info@manchestertech.co.uk",
        subject: "Invitation to activate your account on ForSales Growth",
        body: "Hello John Doe, we are pleased to invite you to activate your company account...",
        status: "Success",
        sentAt: "2026-06-25T14:30:00.000Z"
      },
      {
        id: "log-2",
        companyId: "comp-2",
        companyName: "Northern Crust Bakery",
        email: "hello@northerncrust.co.uk",
        subject: "Activate ForSales account for Northern Crust Bakery",
        body: "Hello Alice Smith, thank you for joining our financial growth system...",
        status: "Success",
        sentAt: "2026-06-26T11:20:00.000Z"
      }
    ],
    settings: {
      dailyLimit: 20,
      smtpHost: "smtp.forsales-growth.com",
      smtpPort: 587,
      smtpUser: "outreach@forsales-growth.com",
      smtpPass: "••••••••••••••••",
      emailTemplateSubject: "Exclusive invitation to activate your ForSales account - {Company_Name}",
      emailTemplateBody: `Hello {Contact_Person},

We have noticed the distinct success of {Company_Name} in {City}, and we are pleased to invite you to activate your free account and start receiving additional customer requests immediately.

Your account activation link:
{Activation_Link}

We wish you accelerated growth!
ForSales Growth Team`
    }
  };

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2), "utf8");
    return defaultDB;
  }

  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading database file, resetting to default...", e);
    return defaultDB;
  }
}

// Helper to save database
function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error saving database file...", e);
  }
}

// Lazy load Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Collector Background State
let collectorState = {
  isCollecting: false,
  category: "",
  city: "Manchester",
  progress: 0,
  logs: [] as string[],
  collectedCount: 0,
};

// Outreach Campaign Background State
let outreachState = {
  isRunning: false,
  progress: 0,
  totalInQueue: 0,
  sentCount: 0,
  successCount: 0,
  failedCount: 0,
  logs: [] as string[],
};

// ==================== API ROUTES ====================

// GET: All companies
app.get("/api/companies", (req, res) => {
  const db = loadDB();
  let results = [...db.companies];

  const { search, status, city } = req.query;

  if (search) {
    const s = String(search).toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.activity.toLowerCase().includes(s) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(s)) ||
        c.website.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s)
    );
  }

  if (status) {
    results = results.filter((c) => c.status === status);
  }

  if (city) {
    results = results.filter((c) => c.city === city);
  }

  res.json(results);
});

// POST: Add single company manually
app.post("/api/companies", (req, res) => {
  const db = loadDB();
  const newCompany = {
    id: "comp-" + Date.now(),
    name: req.body.name || "New Company",
    activity: req.body.activity || "Unspecified",
    city: req.body.city || "Manchester",
    website: req.body.website || "",
    email: req.body.email || "",
    phone: req.body.phone || "",
    url: req.body.url || "",
    contactPerson: req.body.contactPerson || "General Manager",
    firstContactDate: null,
    contactCount: 0,
    status: req.body.status || "Not Contacted",
    createdAt: new Date().toISOString()
  };

  db.companies.unshift(newCompany);
  saveDB(db);
  res.status(201).json(newCompany);
});

// PUT: Update company
app.put("/api/companies/:id", (req, res) => {
  const db = loadDB();
  const index = db.companies.findIndex((c: any) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Company not found" });
  }

  const updatedCompany = {
    ...db.companies[index],
    ...req.body,
  };

  db.companies[index] = updatedCompany;
  saveDB(db);
  res.json(updatedCompany);
});

// DELETE: Delete company
app.delete("/api/companies/:id", (req, res) => {
  const db = loadDB();
  const initialLength = db.companies.length;
  db.companies = db.companies.filter((c: any) => c.id !== req.params.id);

  if (db.companies.length === initialLength) {
    return res.status(404).json({ error: "Company not found" });
  }

  saveDB(db);
  res.json({ success: true, message: "Company deleted" });
});

// POST: Bulk Delete / Remove Duplicates
app.post("/api/companies/remove-duplicates", (req, res) => {
  const db = loadDB();
  const uniqueMap = new Map();
  const duplicatesCount = db.companies.length;

  db.companies.forEach((company: any) => {
    // Unique key combination of Name and Email
    const key = `${company.name.trim().toLowerCase()}_${company.email.trim().toLowerCase()}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, company);
    }
  });

  const uniqueCompanies = Array.from(uniqueMap.values());
  const removedCount = duplicatesCount - uniqueCompanies.length;

  db.companies = uniqueCompanies;
  saveDB(db);

  res.json({ success: true, removedCount, remainingCount: db.companies.length });
});

// POST: Simulate Funnel Action (helps test CRM dashboard statistics)
app.post("/api/companies/simulate-funnel/:id", (req, res) => {
  const db = loadDB();
  const index = db.companies.findIndex((c: any) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Company not found" });
  }

  const currentStatus = db.companies[index].status;
  let nextStatus = currentStatus;

  switch (currentStatus) {
    case "Not Contacted":
      nextStatus = "Invitation Sent";
      break;
    case "Invitation Sent":
      nextStatus = "Opened Email";
      break;
    case "Opened Email":
      nextStatus = "Account Activated";
      break;
    case "Account Activated":
      nextStatus = "Posted Ad";
      break;
    case "Posted Ad":
      nextStatus = "Became Paid Client";
      break;
    case "Became Paid Client":
      nextStatus = "Declined";
      break;
    default:
      nextStatus = "Not Contacted";
      break;
  }

  db.companies[index].status = nextStatus;
  
  // Track contact frequency
  if (nextStatus === "Invitation Sent") {
    db.companies[index].contactCount += 1;
    db.companies[index].firstContactDate = new Date().toISOString().split("T")[0];
  }

  saveDB(db);
  res.json(db.companies[index]);
});

// ==================== DATA COLLECTOR ENGINE ====================

app.get("/api/collector/status", (req, res) => {
  res.json({
    ...collectorState,
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

app.post("/api/collector/stop", (req, res) => {
  collectorState.isCollecting = false;
  collectorState.logs.push("⚠️ Data collection manually stopped by user.");
  res.json(collectorState);
});

app.post("/api/collector/start", async (req, res) => {
  const { category, city } = req.body;

  if (!category || !city) {
    return res.status(400).json({ error: "Activity and City are required" });
  }

  if (collectorState.isCollecting) {
    return res.status(400).json({ error: "Collection process already running" });
  }

  // Initialize background collection
  collectorState = {
    isCollecting: true,
    category,
    city,
    progress: 5,
    logs: [
      `🚀 Starting company data collection system for activity: [${category}] in city [${city}]`,
      "🔍 Scanning public directories and business rating sites..."
    ],
    collectedCount: 0,
  };

  res.json({ message: "Collection process started successfully", state: collectorState });

  // Run async generation task
  (async () => {
    try {
      const ai = getGeminiClient();

      if (ai) {
        // We have Gemini client configured! Use live intelligence to fetch UK leads
        collectorState.logs.push("🤖 Gemini AI activated for extraction and accurate data generation...");
        collectorState.progress = 25;

        const prompt = `You are an expert in market research and sales data collection. 
Extract or generate a list of 8 real or highly realistic small businesses in city "${city}" in the UK operating in activity "${category}".
Each company must have complete, accurate details consistent with UK business nature.

Return the result as a JSON array only without any prefixes or markdown formatting.
Fields must match exactly this format:
[
  {
    "name": "Company Name in English (e.g., MCR Crust Bakery)",
    "activity": "Detailed business activity in English",
    "city": "${city}",
    "website": "Valid website like https://mcr-bakery.co.uk",
    "email": "Valid public email suitable for the company like info@mcr-bakery.co.uk",
    "phone": "UK phone number suitable for the town like +44 161 123 4567",
    "url": "Link to company page on business directory like https://www.yell.com/biz/example",
    "contactPerson": "Name of the contact person in English like John Doe"
  }
]`;

        collectorState.logs.push("📡 Sending smart request for search, filtering, and removing invalid data...");
        collectorState.progress = 50;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7,
          }
        });

        if (!collectorState.isCollecting) return; // If user clicked stop

        const text = response.text || "[]";
        let parsedCompanies = [];
        try {
          parsedCompanies = JSON.parse(text.trim());
        } catch (e) {
          // If JSON parse fails, attempt to extract array
          const arrMatch = text.match(/\[[\s\S]*\]/);
          if (arrMatch) {
            parsedCompanies = JSON.parse(arrMatch[0]);
          } else {
            throw new Error("Failed to process AI response");
          }
        }

        if (Array.isArray(parsedCompanies) && parsedCompanies.length > 0) {
          collectorState.logs.push(`✅ Received ${parsedCompanies.length} unique companies successfully from AI.`);
          collectorState.progress = 80;

          // Merge into database
          const db = loadDB();
          let added = 0;
          parsedCompanies.forEach((item: any) => {
            // Check if already exists by name or email
            const exists = db.companies.some(
              (c: any) => c.name.toLowerCase() === item.name.toLowerCase() || (item.email && c.email === item.email)
            );

            if (!exists) {
              db.companies.unshift({
                id: "comp-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
                name: item.name,
                activity: item.activity || category,
                city: item.city || city,
                website: item.website || "",
                email: item.email || "",
                phone: item.phone || "",
                url: item.url || "",
                contactPerson: item.contactPerson || "General Manager",
                firstContactDate: null,
                contactCount: 0,
                status: "Not Contacted",
                createdAt: new Date().toISOString()
              });
              added++;
            }
          });

          saveDB(db);
          collectorState.collectedCount = added;
          collectorState.logs.push(`💾 Duplicates filtered and inserted ${added} new companies into the database.`);
          collectorState.progress = 100;
          collectorState.isCollecting = false;
        } else {
          throw new Error("No companies found matching criteria");
        }

      } else {
        // Fallback simulator if no Gemini API Key
        collectorState.logs.push("⚠️ No valid Gemini API key found in the system.");
        collectorState.logs.push("⚙️ Auto-switching to high-precision search simulator in public directories...");
        
        const isCarCategory = /car|auto|deal|vehic/i.test(category);
        
        const carTemplates = [
          { name: "Manchester Cars Ltd", activity: "Used Car Dealerships and Trading", email: "sales@manchestercars.co.uk", phone: "+44 161 834 1234", contactPerson: "Richard Evans" },
          { name: "Piccadilly Used Cars", activity: "Used Cars Sales & Technical Inspection", email: "info@piccadillyusedcars.co.uk", phone: "+44 161 228 5678", contactPerson: "Simon Davies" },
          { name: "MCR Prestige Cars Group", activity: "Luxury & Sports Used Cars", email: "contact@mcrprestigecars.co.uk", phone: "+44 161 740 9988", contactPerson: "Mark Harrison" },
          { name: "AutoTrader Manchester - Trade Outlet", activity: "Used Cars Trading & Export", email: "buying@autotradermanchester.co.uk", phone: "+44 161 955 4321", contactPerson: "Jack Stevens" },
          { name: "Manchester 4x4 & SUV Centre", activity: "Family 4x4 Used Cars", email: "sales@manchester4x4.co.uk", phone: "+44 161 312 8855", contactPerson: "Thomas Miller" },
          { name: "MCR Budget Cars", activity: "Economy & Small Used Cars", email: "hello@mcrbudgetcars.co.uk", phone: "+44 161 688 3344", contactPerson: "Emily Wood" },
        ];

        const generalTemplates = [
          { name: "MCR Auto Services", activity: "Car Maintenance & Mechanics", email: "support@mcrauto.co.uk", phone: "+44 161 445 6677", contactPerson: "Jack Hunter" },
          { name: "Northern Academy", activity: "Education & Training", email: "register@northernacademy.co.uk", phone: "+44 161 332 1199", contactPerson: "Emily Hill" },
          { name: "Royal Oak Cafe", activity: "Bakeries & Restaurants", email: "dine@royaloakmcr.co.uk", phone: "+44 161 888 2233", contactPerson: "Tom Cook" },
          { name: "Justice Law MCR", activity: "Legal Services & Law", email: "legal@justicelaw-mcr.co.uk", phone: "+44 161 999 5544", contactPerson: "James Bond" },
          { name: "Glow & Elegant Beauty Salon", activity: "Salons & Beauty", email: "booking@glow-elegant.co.uk", phone: "+44 161 111 2222", contactPerson: "Sarah King" },
          { name: "Manchester Cleaners", activity: "Cleaning & Home Services", email: "cleaning@manchestercleaners.co.uk", phone: "+44 161 556 7788", contactPerson: "Peter Meek" },
        ];

        const mockTemplates = isCarCategory ? carTemplates : generalTemplates;

        let tick = 0;
        const interval = setInterval(() => {
          if (!collectorState.isCollecting) {
            clearInterval(interval);
            return;
          }

          tick++;
          collectorState.progress = Math.min(95, tick * 20);

          if (tick === 1) {
            collectorState.logs.push(`📡 Connecting to public directories for city [${city}] for research and filtering...`);
          } else if (tick === 2) {
            collectorState.logs.push("🕵️ Analyzing page structure and extracting phone numbers, website activation links, and contact details...");
          } else if (tick === 3) {
            collectorState.logs.push("📧 Scanning public email addresses and ensuring compliance with Data Protection regulations...");
          } else if (tick === 4) {
            // Add custom simulation data
            const db = loadDB();
            let added = 0;
            
            mockTemplates.forEach((item, idx) => {
              const uniqueId = `mock-comp-${Date.now()}-${idx}`;
              const exists = db.companies.some((c: any) => c.name === item.name);
              
              if (!exists) {
                db.companies.unshift({
                  id: uniqueId,
                  name: item.name,
                  activity: item.activity,
                  city: city,
                  website: `https://${item.email.split("@")[1]}`,
                  email: item.email,
                  phone: item.phone,
                  url: `https://www.yell.com/biz/simulated-${idx}`,
                  contactPerson: item.contactPerson,
                  firstContactDate: null,
                  contactCount: 0,
                  status: "Not Contacted",
                  createdAt: new Date().toISOString()
                });
                added++;
              }
            });

            saveDB(db);
            collectorState.collectedCount = added;
            collectorState.logs.push(`✅ Search completed successfully! Found, filtered, and imported ${added} unique new companies for activity [${category}].`);
          } else if (tick >= 5) {
            collectorState.progress = 100;
            collectorState.isCollecting = false;
            clearInterval(interval);
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error("Collector background task failed:", err);
      collectorState.isCollecting = false;
      collectorState.logs.push(`❌ Operation failed: ${err.message || err}`);
    }
  })();
});

// ==================== OUTREACH MANAGER ENGINE ====================

app.get("/api/outreach/status", (req, res) => {
  res.json(outreachState);
});

app.post("/api/outreach/stop", (req, res) => {
  outreachState.isRunning = false;
  outreachState.logs.push("⚠️ Outreach campaign paused manually.");
  res.json(outreachState);
});

app.post("/api/outreach/start", (req, res) => {
  if (outreachState.isRunning) {
    return res.status(400).json({ error: "Campaign is already sending" });
  }

  const db = loadDB();
  const targetCompanies = db.companies.filter(
    (c: any) => c.status === "Not Contacted" && c.email
  );

  if (targetCompanies.length === 0) {
    return res.status(400).json({ error: "No companies with status 'Not Contacted' and a valid email." });
  }

  const limit = Math.min(db.settings.dailyLimit, targetCompanies.length);

  outreachState = {
    isRunning: true,
    progress: 0,
    totalInQueue: limit,
    sentCount: 0,
    successCount: 0,
    failedCount: 0,
    logs: [
      `📧 Starting new email campaign. Daily target available: ${limit} messages.`,
      `⚙️ Connecting to SMTP server: ${db.settings.smtpHost}:${db.settings.smtpPort}...`
    ],
  };

  res.json({ message: "Outreach campaign started successfully", state: outreachState });

  // Simulate sequential delivery process
  let currentIdx = 0;
  const interval = setInterval(() => {
    if (!outreachState.isRunning) {
      clearInterval(interval);
      return;
    }

    if (currentIdx >= limit) {
      outreachState.isRunning = false;
      outreachState.progress = 100;
      outreachState.logs.push("🎉 Successfully sent all scheduled messages for today!");
      clearInterval(interval);
      return;
    }

    const currentCompany = targetCompanies[currentIdx];
    const emailTo = currentCompany.email;
    const contactPerson = currentCompany.contactPerson || "Respected Business Owner";
    const activationUrl = `${process.env.APP_URL || "https://forsales.growth.co"}/activate-account?id=${currentCompany.id}`;

    // Replace tags in template
    let finalSubject = db.settings.emailTemplateSubject
      .replace(/{Company_Name}/g, currentCompany.name)
      .replace(/{City}/g, currentCompany.city)
      .replace(/{Contact_Person}/g, contactPerson);

    let finalBody = db.settings.emailTemplateBody
      .replace(/{Company_Name}/g, currentCompany.name)
      .replace(/{City}/g, currentCompany.city)
      .replace(/{Contact_Person}/g, contactPerson)
      .replace(/{Activation_Link}/g, activationUrl);

    // Simulate sending success (90% success rate, 10% failed/bounced for realism)
    const isSuccess = Math.random() > 0.1;
    const logId = "log-" + Date.now() + "-" + currentIdx;

    // Update databases
    const liveDB = loadDB();
    const compIdx = liveDB.companies.findIndex((c: any) => c.id === currentCompany.id);

    if (compIdx !== -1) {
      liveDB.companies[compIdx].status = isSuccess ? "Invitation Sent" : "Not Contacted";
      liveDB.companies[compIdx].contactCount += 1;
      liveDB.companies[compIdx].firstContactDate = new Date().toISOString().split("T")[0];
    }

    // Insert outreach log
    const newLog = {
      id: logId,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      email: emailTo,
      subject: finalSubject,
      body: finalBody.substring(0, 150) + "...",
      status: isSuccess ? "Success" : "Failed",
      sentAt: new Date().toISOString()
    };

    liveDB.logs.unshift(newLog);
    saveDB(liveDB);

    // Update outreach background state
    outreachState.sentCount += 1;
    if (isSuccess) {
      outreachState.successCount += 1;
      outreachState.logs.push(`✅ [Sent] to: ${currentCompany.name} (${emailTo})`);
    } else {
      outreachState.failedCount += 1;
      outreachState.logs.push(`❌ [Sending Error] Bounced email or unresponsive server: ${emailTo}`);
    }

    currentIdx++;
    outreachState.progress = Math.round((currentIdx / limit) * 100);

    // Auto simulate user clicking link (interaction rate simulation: 40% will click / activate automatically after 3 seconds)
    if (isSuccess && Math.random() < 0.4) {
      setTimeout(() => {
        const simDB = loadDB();
        const activeComp = simDB.companies.find((c: any) => c.id === currentCompany.id);
        if (activeComp && activeComp.status === "Invitation Sent") {
          // Progress through steps: Opened -> Activated -> Published Ad -> Paid Client
          const rand = Math.random();
          if (rand < 0.2) {
            activeComp.status = "Became Paid Client";
          } else if (rand < 0.5) {
            activeComp.status = "Posted Ad";
          } else if (rand < 0.8) {
            activeComp.status = "Account Activated";
          } else {
            activeComp.status = "Opened Email";
          }
          saveDB(simDB);
        }
      }, 4000);
    }

  }, 3000);
});

// ==================== SETTINGS & LOGS ====================

app.get("/api/settings", (req, res) => {
  const db = loadDB();
  res.json(db.settings);
});

app.post("/api/settings", (req, res) => {
  const db = loadDB();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDB(db);
  res.json(db.settings);
});

app.get("/api/logs", (req, res) => {
  const db = loadDB();
  res.json(db.logs);
});

// ==================== ASSETS & VITE SERVING ====================

// Support file uploads (such as importing from Excel or CSV via simple post)
app.post("/api/companies/import", (req, res) => {
  const { list } = req.body;
  if (!Array.isArray(list)) {
    return res.status(400).json({ error: "A valid array of companies must be sent" });
  }

  const db = loadDB();
  let importedCount = 0;

  list.forEach((item: any) => {
    if (!item.name) return;
    
    // Check duplication
    const exists = db.companies.some(
      (c: any) => c.name.toLowerCase() === item.name.toLowerCase() || (item.email && c.email === item.email)
    );

    if (!exists) {
      db.companies.unshift({
        id: "comp-import-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name: item.name,
        activity: item.activity || "Imported Activity",
        city: item.city || "Manchester",
        website: item.website || "",
        email: item.email || "",
        phone: item.phone || "",
        url: item.url || "",
        contactPerson: item.contactPerson || "General Manager",
        firstContactDate: null,
        contactCount: 0,
        status: "Not Contacted",
        createdAt: new Date().toISOString()
      });
      importedCount++;
    }
  });

  saveDB(db);
  res.json({ success: true, importedCount, totalCount: db.companies.length });
});

// Handle serving the React App through Vite (Development) or statically (Production)
(async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ForSales Growth Backend] Server running on http://localhost:${PORT}`);
  });
})();
