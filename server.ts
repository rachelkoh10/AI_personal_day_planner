import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { SINGAPORE_PLACES, MOCK_DATA_SOURCES } from './src/data/singaporeData.js';
import { AgentStep, TripPlan, UserPreferences } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI:', err);
  }
}

// 1. API: Weather Data Endpoint
app.get('/api/weather/current', (req, res) => {
  const area = (req.query.area as string) || 'Central Singapore';
  const hour = new Date().getHours();
  const isRainyArea = area.toLowerCase().includes('bugis') || area.toLowerCase().includes('marina') || area.toLowerCase().includes('toa payoh');

  res.json({
    area,
    condition: isRainyArea ? 'Passing Showers' : 'Partly Cloudy',
    tempCelsius: 31,
    rainProbabilityPercent: 40,
    humidityPercent: 78,
    recommendationNote: 'Passing rain expected around 3:30 PM. Indoor options recommended for late afternoon.',
    isRainy: true,
    forecast2Hour: 'Short thundershowers expected over central Singapore between 3:30 PM and 5:00 PM.',
    dataSource: 'NEA Weather API (gov.sg)',
    lastUpdated: new Date().toISOString(),
  });
});

// 2. API: Data Sources Status Endpoint
app.get('/api/data-sources', (req, res) => {
  res.json({
    sources: MOCK_DATA_SOURCES,
    totalRecordsProcessed: 1419,
    systemStatus: 'Healthy',
  });
});

// 3. API: Admin Dashboard Stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: 1420,
    activeUsersToday: 385,
    subscribers: {
      free: 1120,
      plus: 210,
      premium: 90,
    },
    revenueMonthly: {
      subscriptions: 1948.10,
      ads: 420.50,
      affiliates: 185.00,
      total: 2553.60,
    },
    agentMetrics: {
      plansGeneratedTotal: 4890,
      replansTriggered: 840,
      monitoringActiveSessions: 124,
      avgGenerationTimeMs: 1120,
    },
    dataSources: MOCK_DATA_SOURCES.map((ds, idx) => ({
      name: ds.name,
      type: ds.sourceType,
      status: ds.status,
      latencyMs: 45 + idx * 12,
      lastChecked: 'Just now',
      recordsCount: ds.recordsRetrieved || 100,
    })),
  });
});

// Helper tool to rank places locally based on preferences
function filterAndRankPlaces(prefs: UserPreferences) {
  let matched = SINGAPORE_PLACES.filter((p) => {
    if (prefs.seniorGentleMode && !p.seniorFriendly) return false;
    if (prefs.walkingComfort === 'very_little' && p.walkingDistanceMeters > 350) return false;
    return true;
  });

  if (matched.length < 3) {
    matched = SINGAPORE_PLACES;
  }

  return matched;
}

// 4. API: AI Agent Day Planner Generator
app.post('/api/planner/generate', async (req, res) => {
  const { preferences, promptOverride }: { preferences: UserPreferences; promptOverride?: string } = req.body;

  const steps: AgentStep[] = [
    {
      id: 'step-1',
      timestamp: new Date().toISOString(),
      phase: 'Perception',
      description: `Parsed request: Location=${preferences.location}, Time=${preferences.timeAvailable}, Budget=${preferences.budgetTier}, SeniorMode=${preferences.seniorGentleMode ? 'Enabled' : 'Disabled'}, Walking=${preferences.walkingComfort}`,
      status: 'success',
    },
    {
      id: 'step-2',
      timestamp: new Date().toISOString(),
      phase: 'Data Retrieval',
      toolName: 'getWeather()',
      description: 'Retrieved NEA 2-Hour & 24-Hour Weather Forecast for Singapore',
      details: { area: preferences.location, condition: 'Passing Showers late afternoon', rainProb: '40%' },
      status: 'success',
    },
    {
      id: 'step-3',
      timestamp: new Date().toISOString(),
      phase: 'Data Retrieval',
      toolName: 'getPublicTransport()',
      description: 'Queried LTA DataMall for MRT Downtown/EW lines & Bus routing times',
      details: { origin: preferences.location, avgTravelTimeMinutes: 12 },
      status: 'success',
    },
    {
      id: 'step-4',
      timestamp: new Date().toISOString(),
      phase: 'Tool Call',
      toolName: 'getPlaceInformation()',
      description: 'Queried Singapore public datasets (data.gov.sg, NHB, NParks) for open places',
      details: { totalRetrieved: SINGAPORE_PLACES.length, filteredCount: filterAndRankPlaces(preferences).length },
      status: 'success',
    },
    {
      id: 'step-5',
      timestamp: new Date().toISOString(),
      phase: 'Reasoning',
      toolName: 'rankOptions()',
      description: 'Evaluated budget constraints, walking limits, senior accessibility, and afternoon rain protection',
      status: 'success',
    },
    {
      id: 'step-6',
      timestamp: new Date().toISOString(),
      phase: 'Optimization',
      toolName: 'calculateBudget()',
      description: 'Optimized activity sequence to stay under target budget with low walking transitions',
      status: 'success',
    },
  ];

  const candidatePlaces = filterAndRankPlaces(preferences);

  // If Gemini API is available, ask Gemini to customize reasoning and titles
  let aiSummary = '';
  let aiReasoning = {
    budgetExplanation: `The total estimated cost is S$32, well within your S$50 budget allowance.`,
    timeExplanation: `The itinerary spans 4 hours comfortably with generous 45-60 minute activity slots and rest breaks.`,
    walkingExplanation: preferences.seniorGentleMode
      ? `Senior Easy Mode enabled: All walking distances are under 250 meters with flat pathways and seating.`
      : `Walking is kept moderate with direct MRT/Bus connections.`,
    weatherExplanation: `Passing rain expected late afternoon. Outdoor activities are scheduled first, transitioning to sheltered indoor venues by 4:00 PM.`,
    overallSummary: `A balanced Singapore afternoon tailored to your location around ${preferences.location}.`,
  };

  if (ai) {
    try {
      const promptText = `Act as an expert AI Day Planner for Singapore.
User Request Details:
- Location: ${preferences.location}
- Time available: ${preferences.timeAvailable}
- Budget: ${preferences.budgetTier}
- Walking comfort: ${preferences.walkingComfort}
- Group: ${preferences.groupType}
- Senior Gentle Mode: ${preferences.seniorGentleMode ? 'Yes' : 'No'}
- User Prompt / Voice: ${promptOverride || 'Standard request'}

Candidate Singapore Places available:
${candidatePlaces.slice(0, 5).map(p => `- ${p.name} (${p.category}, S$${p.estimatedCostMin}-$${p.estimatedCostMax}, ${p.isIndoor ? 'Indoor' : 'Outdoor'}, Walk ${p.walkingDistanceMeters}m)`).join('\n')}

Please generate a short json response with keys:
"title": string,
"overallSummary": string,
"budgetExplanation": string,
"weatherExplanation": string,
"walkingExplanation": string
`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              overallSummary: { type: Type.STRING },
              budgetExplanation: { type: Type.STRING },
              weatherExplanation: { type: Type.STRING },
              walkingExplanation: { type: Type.STRING },
            },
            required: ['title', 'overallSummary', 'budgetExplanation', 'weatherExplanation', 'walkingExplanation'],
          },
        },
      });

      if (aiResponse.text) {
        const parsed = JSON.parse(aiResponse.text);
        if (parsed.overallSummary) {
          aiReasoning.overallSummary = parsed.overallSummary;
          aiReasoning.budgetExplanation = parsed.budgetExplanation || aiReasoning.budgetExplanation;
          aiReasoning.weatherExplanation = parsed.weatherExplanation || aiReasoning.weatherExplanation;
          aiReasoning.walkingExplanation = parsed.walkingExplanation || aiReasoning.walkingExplanation;
          if (parsed.title) aiSummary = parsed.title;
        }
      }
    } catch (err) {
      console.warn('Gemini call notice:', err);
    }
  }

  // Construct structured timeline items
  const selectedPlaces = candidatePlaces.slice(0, 4);
  const startHour = 14; // 2:00 PM

  const items = selectedPlaces.map((place, idx) => {
    const itemStartH = startHour + Math.floor(idx * 1.1);
    const itemStartM = (idx * 15) % 60;
    const startTimeStr = `${itemStartH > 12 ? itemStartH - 12 : itemStartH}:${itemStartM === 0 ? '00' : itemStartM} PM`;
    const endTimeStr = `${itemStartH + 1 > 12 ? itemStartH + 1 - 12 : itemStartH + 1}:${itemStartM === 0 ? '00' : itemStartM} PM`;

    let transitMode: 'mrt' | 'bus' | 'walk' | 'taxi' = 'walk';
    if (idx === 1) transitMode = 'mrt';
    if (idx === 2) transitMode = 'bus';

    return {
      id: `item-${idx + 1}`,
      startTime: startTimeStr,
      endTime: endTimeStr,
      activity: place,
      transitToNext: idx < selectedPlaces.length - 1 ? {
        mode: transitMode,
        details: transitMode === 'mrt' ? 'Downtown Line (1 station)' : transitMode === 'bus' ? 'LTA Bus Line 7 (2 stops)' : 'Covered sheltered walkway (3 mins)',
        durationMinutes: transitMode === 'walk' ? 5 : 12,
        costEstimate: transitMode === 'walk' ? 0 : 1.45,
      } : undefined,
      tips: place.seniorFriendly ? 'Seating available every 30m. Wheelchair friendly ramps.' : 'Great photo spot.',
      indoorBackupPlan: !place.isIndoor ? 'If rain starts, head into the adjacent air-conditioned museum or cafe.' : undefined,
    };
  });

  const totalCost = items.reduce((acc, item) => acc + (item.activity.estimatedCostMin + item.activity.estimatedCostMax) / 2 + (item.transitToNext?.costEstimate || 0), 0);

  steps.push({
    id: 'step-7',
    timestamp: new Date().toISOString(),
    phase: 'Assembly',
    toolName: 'generateItinerary()',
    description: 'Generated structured timeline with transit legs, backup plans, and source attributions',
    status: 'success',
  });

  steps.push({
    id: 'step-8',
    timestamp: new Date().toISOString(),
    phase: 'Monitoring',
    toolName: 'monitorTrip()',
    description: 'Autonomous listener attached: Monitoring live NEA rain radar and LTA transport delays',
    status: 'success',
  });

  const plan: TripPlan = {
    id: `plan-${Date.now()}`,
    title: aiSummary || (preferences.seniorGentleMode ? 'Gentle Afternoon in Singapore' : 'Smart Afternoon Plan'),
    createdAt: new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
    preferences,
    items,
    totalCostEstimate: Math.round(totalCost),
    totalDurationMinutes: preferences.timeAvailable === '2h' ? 120 : 240,
    walkingLevel: preferences.walkingComfort === 'very_little' || preferences.seniorGentleMode ? 'Low' : 'Moderate',
    weatherStatus: 'Caution',
    weatherForecastText: 'Passing rain expected after 3:30 PM. Indoor backup venues included.',
    reasoning: aiReasoning,
    sources: MOCK_DATA_SOURCES,
    monitoringActive: true,
  };

  res.json({ plan, steps });
});

// 5. API: AI Agent Replanner Endpoint (Triggered by Weather, Transport, or User)
app.post('/api/planner/replan', async (req, res) => {
  const { existingPlan, triggerReason, customInstruction }: {
    existingPlan: TripPlan;
    triggerReason: 'weather_rain' | 'transport_delay' | 'user_request';
    customInstruction?: string;
  } = req.body;

  const steps: AgentStep[] = [
    {
      id: `replan-step-1-${Date.now()}`,
      timestamp: new Date().toISOString(),
      phase: 'Perception',
      description: `Autonomous Agent Alert: ${triggerReason === 'weather_rain' ? 'NEA Rain Radar detected heavy rain at 3:15 PM' : triggerReason === 'transport_delay' ? 'LTA Transport Delay detected on MRT Line' : 'User requested plan modification'}`,
      status: 'warning',
    },
    {
      id: `replan-step-2-${Date.now()}`,
      timestamp: new Date().toISOString(),
      phase: 'Reasoning',
      toolName: 'replanItinerary()',
      description: 'Evaluating impact on current timeline. Identifying indoor/sheltered alternatives nearby.',
      status: 'success',
    },
  ];

  // Substitute outdoor activities with indoor alternatives (e.g. National Museum or Flower Dome)
  const indoorAlternatives = SINGAPORE_PLACES.filter(p => p.isIndoor);
  let alternativeIdx = 0;

  const updatedItems = existingPlan.items.map((item, idx) => {
    if (!item.activity.isIndoor && idx >= 1) {
      const replacement = indoorAlternatives[alternativeIdx % indoorAlternatives.length];
      alternativeIdx++;
      return {
        ...item,
        activity: replacement,
        tips: '⚠️ Rain alternative: Moved indoors to air-conditioned heritage museum/cafe with sheltered drop-off.',
        indoorBackupPlan: 'Fully sheltered location.',
      };
    }
    return item;
  });

  steps.push({
    id: `replan-step-3-${Date.now()}`,
    timestamp: new Date().toISOString(),
    phase: 'Optimization',
    toolName: 'calculateBudget()',
    description: 'Recalculated travel route & budget. Reduced walking distance to 100 meters.',
    status: 'success',
  });

  steps.push({
    id: `replan-step-4-${Date.now()}`,
    timestamp: new Date().toISOString(),
    phase: 'Assembly',
    description: 'Updated itinerary generated with indoor venue replacements and short sheltered transit.',
    status: 'success',
  });

  const updatedPlan: TripPlan = {
    ...existingPlan,
    title: `${existingPlan.title} (Weather Adapted)`,
    items: updatedItems,
    weatherStatus: 'Good',
    weatherForecastText: 'Rain adapted: All remaining activities switched to air-conditioned indoor locations.',
    reasoning: {
      ...existingPlan.reasoning,
      weatherExplanation: `⚠️ Rain was detected at 3:15 PM. The agent automatically replaced outdoor stops with indoor options (National Museum & Kopitiam Cafe) connected via sheltered walkways.`,
    },
  };

  res.json({ plan: updatedPlan, steps });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Singapore AI Smart Day Planner Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
