import { Router, Request, Response } from 'express';

export const externalApiRouter = Router();

// Generic helper to proxy JSON GET requests
async function proxyGet(url: string, headers: Record<string, string> = {}, res: Response) {
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Fetch error' });
  }
}

// ==========================================
// 1. Weather & Environment (data.gov.sg v2) - Open Government Data (No Key Required)
// ==========================================
const GOV_V2 = 'https://api-open.data.gov.sg/v2/real-time/api';
const v2Endpoints = [
  { path: '/gov/weather/2hr', url: `${GOV_V2}/two-hr-forecast` },
  { path: '/gov/weather/24hr', url: `${GOV_V2}/twenty-four-hr-forecast` },
  { path: '/gov/weather/4day', url: `${GOV_V2}/four-day-outlook` },
  { path: '/gov/environment/air-temperature', url: `${GOV_V2}/air-temperature` },
  { path: '/gov/environment/rainfall', url: `${GOV_V2}/rainfall` },
  { path: '/gov/environment/psi', url: `${GOV_V2}/psi` },
  { path: '/gov/environment/pm25', url: `${GOV_V2}/pm25` },
  { path: '/gov/environment/uv', url: `${GOV_V2}/uv` },
  { path: '/gov/environment/relative-humidity', url: `${GOV_V2}/relative-humidity` },
  { path: '/gov/environment/wind-speed', url: `${GOV_V2}/wind-speed` },
];

for (const ep of v2Endpoints) {
  externalApiRouter.get(ep.path, (req, res) => proxyGet(ep.url, {}, res));
}

// ==========================================
// 2. Carparks & Taxis (data.gov.sg v1) - Open Government Data
// ==========================================
externalApiRouter.get('/gov/v1/carpark-availability', (req, res) =>
  proxyGet('https://api.data.gov.sg/v1/transport/carpark-availability', {}, res)
);
externalApiRouter.get('/gov/v1/taxi-availability', (req, res) =>
  proxyGet('https://api.data.gov.sg/v1/transport/taxi-availability', {}, res)
);

// ==========================================
// 3. LTA DataMall v3 & Services
// ==========================================
const LTA_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';

externalApiRouter.get('/lta/bus-arrival', (req, res) => {
  const code = (req.query.BusStopCode as string) || '83139';
  const serviceNo = req.query.ServiceNo ? `&ServiceNo=${req.query.ServiceNo}` : '';
  const accountKey = (req.headers['accountkey'] as string) || '';
  proxyGet(
    `${LTA_BASE}/v3/BusArrival?BusStopCode=${code}${serviceNo}`,
    accountKey ? { AccountKey: accountKey } : {},
    res
  );
});

externalApiRouter.get('/lta/carpark-availability', (req, res) => {
  const accountKey = (req.headers['accountkey'] as string) || '';
  proxyGet(`${LTA_BASE}/CarParkAvailabilityv2`, accountKey ? { AccountKey: accountKey } : {}, res);
});

externalApiRouter.get('/lta/traffic-incidents', (req, res) => {
  const accountKey = (req.headers['accountkey'] as string) || '';
  proxyGet(`${LTA_BASE}/TrafficIncidents`, accountKey ? { AccountKey: accountKey } : {}, res);
});

externalApiRouter.get('/lta/train-alerts', (req, res) => {
  const accountKey = (req.headers['accountkey'] as string) || '';
  proxyGet(`${LTA_BASE}/TrainServiceAlerts`, accountKey ? { AccountKey: accountKey } : {}, res);
});

// ==========================================
// 4. OneMap Services
// ==========================================
externalApiRouter.post('/onemap/token', async (req, res) => {
  try {
    const response = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

externalApiRouter.get('/onemap/search', (req, res) => {
  const q = encodeURIComponent((req.query.q as string) || 'raffles place');
  const token = req.headers.authorization || '';
  proxyGet(
    `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${q}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
    token ? { Authorization: token } : {},
    res
  );
});

externalApiRouter.get('/onemap/revgeocode', (req, res) => {
  const location = (req.query.location as string) || '1.3,103.8';
  const token = req.headers.authorization || '';
  proxyGet(
    `https://www.onemap.gov.sg/api/public/revgeocode?location=${location}&buffer=40&addressType=All`,
    token ? { Authorization: token } : {},
    res
  );
});

externalApiRouter.get('/onemap/route', (req, res) => {
  const start = (req.query.start as string) || '1.320981,103.844150';
  const end = (req.query.end as string) || '1.326762,103.8559';
  const type = (req.query.routeType as string) || 'walk';
  const token = req.headers.authorization || '';
  proxyGet(
    `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${start}&end=${end}&routeType=${type}`,
    token ? { Authorization: token } : {},
    res
  );
});

// ==========================================
// 5. URA Data Services
// ==========================================
const URA_BASE = 'https://eservice.ura.gov.sg/uraDataService';

externalApiRouter.post('/ura/token', async (req, res) => {
  const accessKey = (req.headers['accesskey'] as string) || '';
  try {
    const response = await fetch(`${URA_BASE}/insertNewToken/v1`, {
      method: 'POST',
      headers: { AccessKey: accessKey },
    });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

externalApiRouter.get('/ura/service', (req, res) => {
  const service = (req.query.service as string) || 'Car_Park_Availability';
  const batch = req.query.batch ? `&batch=${req.query.batch}` : '';
  const accessKey = (req.headers['accesskey'] as string) || '';
  const token = (req.headers['token'] as string) || '';

  proxyGet(
    `${URA_BASE}/invokeUraDS/v1?service=${service}${batch}`,
    accessKey ? { AccessKey: accessKey, Token: token } : {},
    res
  );
});

