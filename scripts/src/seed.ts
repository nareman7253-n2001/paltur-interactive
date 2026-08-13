import { count } from 'drizzle-orm';
import {
  activityFeedTable,
  db,
  pool,
  touristEventsTable,
  touristSpotsTable,
  trafficReportsTable,
  usersTable,
} from '@workspace/db';

async function isEmpty(table: Parameters<typeof db.select>[0] extends never ? never : any) {
  const result = await db.select({ value: count() }).from(table);
  return Number(result[0]?.value ?? 0) === 0;
}

async function seed() {
  console.log('Starting PalTur production data seed...');

  if (await isEmpty(usersTable)) {
    await db.insert(usersTable).values({
      username: 'paltur-demo',
      avatarInitials: 'PT',
      jawwalPoints: 620,
      ecoPoints: 240,
      driverLevel: 'Community Explorer',
      totalReports: 4,
      achievements: ['First Report', 'City Helper'],
    });
    console.log('Seeded demo user.');
  }

  if (await isEmpty(touristSpotsTable)) {
    await db.insert(touristSpotsTable).values([
      {
        name: 'Al-Manara Square',
        category: 'culture',
        lat: 31.9038,
        lng: 35.2042,
        description: 'The civic heart of Ramallah, surrounded by cafés, galleries, and local shops.',
        crowdLevel: 'medium',
        hasTrafficWarning: true,
      },
      {
        name: 'Old City Heritage Walk',
        category: 'heritage',
        lat: 31.9071,
        lng: 35.1999,
        description: 'A walkable route through heritage buildings and independent Palestinian artisans.',
        crowdLevel: 'low',
        hasTrafficWarning: false,
      },
      {
        name: 'Rukab Ice Cream',
        category: 'market',
        lat: 31.9016,
        lng: 35.2068,
        description: 'A local favourite for traditional ice cream and a popular evening meeting point.',
        crowdLevel: 'high',
        hasTrafficWarning: true,
      },
    ]);
    console.log('Seeded tourist spots.');
  }

  if (await isEmpty(touristEventsTable)) {
    await db.insert(touristEventsTable).values([
      {
        name: 'Ramallah Heritage Walk',
        venueId: 1,
        venueName: 'Al-Manara Square',
        startDate: '2026-08-20',
        endDate: '2026-08-20',
        category: 'culture',
        description: 'A guided evening walk through heritage sites, stories, and local businesses.',
        pointsReward: 75,
      },
      {
        name: 'Community Clean-up Day',
        venueId: 2,
        venueName: 'Al-Irsal Street',
        startDate: '2026-08-22',
        endDate: '2026-08-22',
        category: 'community',
        description: 'Join local volunteers to keep public spaces clean and earn eco rewards.',
        pointsReward: 120,
      },
      {
        name: 'Palestinian Crafts Market',
        venueId: 3,
        venueName: 'Ramallah Cultural Palace',
        startDate: '2026-08-24',
        endDate: '2026-08-24',
        category: 'market',
        description: 'Meet independent makers and discover handmade Palestinian products.',
        pointsReward: 50,
      },
    ]);
    console.log('Seeded tourist events.');
  }

  if (await isEmpty(trafficReportsTable)) {
    await db.insert(trafficReportsTable).values([
      {
        lat: 31.9056,
        lng: 35.2037,
        severity: 'high',
        description: 'Heavy congestion near the Al-Manara intersection during the evening peak.',
        status: 'active',
        reporterUsername: 'Lina A.',
      },
      {
        lat: 31.912,
        lng: 35.21,
        severity: 'medium',
        description: 'Temporary lane restriction due to road maintenance work.',
        status: 'active',
        reporterUsername: 'Omar K.',
      },
    ]);
    console.log('Seeded traffic reports.');
  }

  if (await isEmpty(activityFeedTable)) {
    await db.insert(activityFeedTable).values([
      {
        module: 'traffic',
        action: 'reported traffic congestion',
        description: 'Heavy congestion was reported near Al-Manara Square.',
        points: 15,
        username: 'Lina A.',
      },
      {
        module: 'waste',
        action: 'joined a clean-up event',
        description: 'The Al-Irsal community clean-up received a new volunteer.',
        points: 30,
        username: 'Ahmad S.',
      },
      {
        module: 'tourism',
        action: 'booked a heritage walk',
        description: 'A new reservation was made for the Ramallah Heritage Walk.',
        points: 75,
        username: 'Maya R.',
      },
    ]);
    console.log('Seeded activity feed.');
  }

  console.log('PalTur production data seed completed.');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
