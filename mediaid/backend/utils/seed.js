require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Solution = require('../models/Solution');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediaid';

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@mediaid.ai',
    password: 'Admin@123',
    role: 'admin',
    avatar: '🛡️',
    bio: 'MediAid AI system administrator.',
    country: 'Global',
    language: 'en',
  },
  {
    name: 'Dr. Amara Keita',
    email: 'amara@mediaid.ai',
    password: 'Contrib@123',
    role: 'contributor',
    avatar: '👩‍⚕️',
    bio: 'Emergency medicine physician with 12 years experience in East Africa.',
    country: 'Kenya',
    language: 'en',
    specialization: 'Emergency Medicine',
  },
  {
    name: 'Fatima Rehman',
    email: 'fatima@mediaid.ai',
    password: 'Contrib@123',
    role: 'contributor',
    avatar: '🌿',
    bio: 'Traditional medicine practitioner and herbalist from Lahore.',
    country: 'Pakistan',
    language: 'ur',
    specialization: 'Traditional Medicine',
  },
  {
    name: 'Raj Singh',
    email: 'raj@mediaid.ai',
    password: 'Contrib@123',
    role: 'contributor',
    avatar: '👨‍🔬',
    bio: 'Paramedic and first aid trainer based in Mumbai.',
    country: 'India',
    language: 'hi',
    specialization: 'Paramedic / First Aid Training',
  },
  {
    name: 'Guest Seeker',
    email: 'seeker@mediaid.ai',
    password: 'Seeker@123',
    role: 'seeker',
    avatar: '👤',
    bio: 'First aid knowledge seeker.',
    country: 'USA',
    language: 'en',
  },
];

const sampleSolutions = (userIds) => [
  {
    title: 'How to Treat a Severe Burn — Step by Step Video Guide',
    description: 'Comprehensive video guide covering immediate treatment of thermal burns, from minor to severe. Includes cooling techniques, dressing, and when to seek emergency care.',
    condition: 'Burns',
    conditionKey: 'burn',
    mediaType: 'video',
    externalUrl: 'https://www.youtube.com/results?search_query=burn+first+aid+treatment',
    duration: '8:24',
    severity: 'critical',
    tags: ['burns', 'thermal', 'first aid', 'emergency'],
    language: 'en',
    region: 'Kenya',
    source: 'WHO / Red Cross',
    evidence: 'Based on WHO Burn Care Guidelines 2023',
    steps: [
      'Run cool (not cold) water over the burn for 20 minutes immediately.',
      'Remove jewelry and clothing near the burn — unless stuck to skin.',
      'Cover loosely with sterile non-fluffy dressing.',
      'Do NOT use ice, butter, toothpaste, or any cream.',
      'For large burns — call emergency services and keep victim warm.',
    ],
    author: userIds[1],
    authorName: 'Dr. Amara Keita',
    status: 'approved',
    views: 847,
    likesCount: 124,
    isFeatured: true,
  },
  {
    title: 'Natural Turmeric & Honey Wound Healing Remedy',
    description: 'Traditional remedy from South Asian medicine for wound cleaning and infection prevention. Turmeric has natural antimicrobial properties backed by modern research.',
    condition: 'Wound / Bleeding',
    conditionKey: 'wound',
    mediaType: 'guide',
    externalUrl: '',
    duration: '',
    severity: 'moderate',
    tags: ['wound', 'turmeric', 'honey', 'natural remedy', 'traditional'],
    language: 'en',
    region: 'Pakistan',
    source: 'Traditional Medicine',
    evidence: 'Turmeric (curcumin) antimicrobial properties: PubMed PMID 27213821',
    steps: [
      'Clean the wound with clean running water for 5 minutes.',
      'Mix 1 teaspoon turmeric powder with 1 teaspoon raw honey.',
      'Apply a thin layer over the wound as an antimicrobial paste.',
      'Cover with clean gauze. Change twice daily.',
      'Monitor for signs of infection: redness, swelling, pus, fever.',
    ],
    ingredients: ['Raw honey (1 tsp)', 'Turmeric powder (1 tsp)', 'Clean gauze', 'Clean water'],
    author: userIds[2],
    authorName: 'Fatima Rehman',
    status: 'approved',
    views: 523,
    likesCount: 89,
    isFeatured: true,
  },
  {
    title: 'Adult CPR — Hands-Only Technique Explained',
    description: 'Clear visual guide to Hands-Only CPR for bystanders. No rescue breaths needed — just call 911 and push hard and fast. This guide follows AHA 2023 guidelines.',
    condition: 'Cardiac Arrest / CPR',
    conditionKey: 'cpr',
    mediaType: 'pdf',
    externalUrl: '',
    duration: '',
    severity: 'critical',
    tags: ['cpr', 'cardiac arrest', 'hands-only', 'AHA'],
    language: 'en',
    region: 'India',
    source: 'AHA 2023',
    evidence: 'American Heart Association Guidelines for CPR & ECC 2023',
    steps: [
      'Check scene safety. Tap shoulders and shout "Are you OK?"',
      'Call emergency services immediately or have bystander call.',
      'Place heel of hand on center of chest. Interlock fingers.',
      'Push hard and fast — 2 inches deep, 100-120 per minute.',
      'Continue until AED arrives or emergency services take over.',
    ],
    author: userIds[3],
    authorName: 'Raj Singh',
    status: 'approved',
    views: 1204,
    likesCount: 312,
    isFeatured: true,
  },
  {
    title: 'Choking in Children — Heimlich Maneuver Video',
    description: 'Detailed demonstration of the Heimlich maneuver for children aged 1 year and above. Includes infant choking technique which is different from adults.',
    condition: 'Choking',
    conditionKey: 'choking',
    mediaType: 'video',
    externalUrl: 'https://www.youtube.com/results?search_query=choking+child+first+aid+heimlich',
    duration: '6:12',
    severity: 'critical',
    tags: ['choking', 'heimlich', 'children', 'infant', 'airway'],
    language: 'en',
    region: 'Kenya',
    source: 'Red Cross',
    evidence: 'Red Cross Pediatric First Aid Guidelines',
    steps: [
      'Ask "Are you choking?" — if child cannot speak or breathe, act now.',
      '5 firm back blows between shoulder blades with heel of hand.',
      '5 abdominal thrusts — kneel behind child, fist above navel.',
      'Alternate 5+5 until object is cleared or child goes unconscious.',
      'If unconscious: call emergency and start child CPR.',
    ],
    author: userIds[1],
    authorName: 'Dr. Amara Keita',
    status: 'approved',
    views: 689,
    likesCount: 95,
  },
  {
    title: 'Neem Leaf Antiseptic Wash for Animal Bites',
    description: 'Traditional remedy using neem (Azadirachta indica) boiled water as an antimicrobial wash for animal bites before medical care. Used across South Asia for centuries.',
    condition: 'Animal / Dog Bite',
    conditionKey: 'dog_bite',
    mediaType: 'guide',
    externalUrl: '',
    severity: 'moderate',
    tags: ['dog bite', 'neem', 'antiseptic', 'traditional', 'south asia'],
    language: 'ur',
    region: 'Pakistan',
    source: 'Traditional Medicine',
    evidence: 'Neem antimicrobial studies: Journal of Ethnopharmacology 2013',
    steps: [
      'FIRST: Wash wound with soap and clean water for at least 5 minutes.',
      'Boil 10-15 neem leaves in 500ml water for 10 minutes. Let cool.',
      'Use cooled neem water to rinse wound gently.',
      'Cover with clean bandage.',
      'IMPORTANT: Seek medical care for all animal bites same day. This is supplemental only.',
    ],
    ingredients: ['10-15 fresh neem leaves', '500ml clean water', 'Clean gauze', 'Soap'],
    author: userIds[2],
    authorName: 'Fatima Rehman',
    status: 'approved',
    views: 234,
    likesCount: 41,
  },
  {
    title: 'Snake Bite First Aid — What NOT to Do',
    description: 'Critical guide debunking dangerous myths about snake bite first aid. Many traditional methods (cut-and-suck, tourniquet, ice) cause more harm than good.',
    condition: 'Snake Bite',
    conditionKey: 'snake',
    mediaType: 'pdf',
    externalUrl: '',
    severity: 'critical',
    tags: ['snake bite', 'venom', 'myths', 'emergency', 'WHO'],
    language: 'en',
    region: 'India',
    source: 'WHO',
    evidence: 'WHO Guidelines for Management of Snakebite 2016',
    steps: [
      'Keep victim completely still — movement spreads venom faster.',
      'Call emergency or Poison Control immediately.',
      'Immobilize bitten limb at or below heart level.',
      'Remove jewelry and tight clothing from bite area.',
      'DO NOT: cut the bite, suck venom, apply tourniquet or ice.',
      'Note snake appearance if safe — helps with antivenom selection.',
    ],
    author: userIds[3],
    authorName: 'Raj Singh',
    status: 'approved',
    views: 445,
    likesCount: 78,
  },
  {
    title: 'Fever Management for Children — When to Worry',
    description: 'Comprehensive guide for parents on managing fever in children. Covers home treatment, when to seek emergency care, and natural remedies alongside medication.',
    condition: 'Fever',
    conditionKey: 'fever',
    mediaType: 'video',
    externalUrl: 'https://www.youtube.com/results?search_query=fever+management+children+first+aid',
    duration: '7:45',
    severity: 'moderate',
    tags: ['fever', 'children', 'paracetamol', 'temperature', 'parents'],
    language: 'en',
    region: 'Global',
    source: 'WHO / Pediatric Guidelines',
    evidence: 'WHO Pocket Book of Hospital Care for Children 2023',
    steps: [
      'Measure temperature: fever is above 38°C / 100.4°F.',
      'Remove excess clothing. Keep room cool.',
      'Give paracetamol (NOT aspirin for children under 16).',
      'Encourage fluids: water, diluted juice, breast milk.',
      'Lukewarm sponge bath if temp exceeds 39.5°C.',
      'SEEK EMERGENCY CARE: child under 3 months, temp >40°C, or seizure.',
    ],
    author: userIds[1],
    authorName: 'Dr. Amara Keita',
    status: 'pending',
    views: 0,
    likesCount: 0,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Solution.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name} (${user.role})`);
    }

    // Create solutions with real user IDs
    const userIds = createdUsers.map(u => u._id);
    const solutions = sampleSolutions(userIds);

    for (const solData of solutions) {
      const sol = await Solution.create(solData);
      console.log(`📋 Created solution: ${sol.title} [${sol.status}]`);
      // Update contributor stats
      await User.findByIdAndUpdate(sol.author, { $inc: { solutionsCount: 1, ...(sol.status === 'approved' ? { verifiedCount: 1 } : {}) } });
    }

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('  Admin:       admin@mediaid.ai     / Admin@123');
    console.log('  Contributor: amara@mediaid.ai     / Contrib@123');
    console.log('  Contributor: fatima@mediaid.ai    / Contrib@123');
    console.log('  Contributor: raj@mediaid.ai       / Contrib@123');
    console.log('  Seeker:      seeker@mediaid.ai    / Seeker@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
