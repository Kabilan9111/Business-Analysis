import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// ============================================================================
// REALISTIC INDIAN ENTERPRISE DATA GENERATION
// ============================================================================

const MANDATORY_NAMES = [
  'Kabilan', 'Yashikaa', 'Vaishnavi', 'Samiksha', 'Arjun',
  'Varun', 'Adhithya', 'Nithin', 'Pawan', 'Kanishk'
];

const INDIAN_FIRST_NAMES = [
  'Rajesh', 'Priya', 'Amit', 'Deepa', 'Sanjay', 'Neha', 'Vikram', 'Anjali',
  'Rohan', 'Divya', 'Manoj', 'Pooja', 'Akshay', 'Shreya', 'Arun', 'Megha',
  'Harsha', 'Sakshi', 'Suresh', 'Kavya', 'Nikhil', 'Isha', 'Ramesh', 'Ananya',
  'Vishal', 'Sneha', 'Saurav', 'Pallavi', 'Karan', 'Ritika', 'Rahul', 'Swati',
  'Manish', 'Aditi', 'Harsh', 'Nisha', 'Gaurav', 'Sophia', 'Ashok', 'Riya'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Iyer', 'Nair',
  'Verma', 'Joshi', 'Pandey', 'Rao', 'Menon', 'Pillai', 'Sinha', 'Dutta',
  'Bhat', 'Chopra', 'Desai', 'Mishra', 'Raman', 'Das', 'Mukherjee', 'Saxena'
];

const INDIAN_COMPANIES = [
  'TechVision Solutions', 'DataFlow Analytics', 'CloudSync Systems',
  'InnovateLabs India', 'QuantumDrive Tech', 'FinancePulse Inc',
  'SecureNet Digital', 'SmartMetrics Pro', 'VentureTech India',
  'ByteFlow Systems', 'SynergyCloud Analytics', 'ProsperAI Inc',
  'NimbusCore Solutions', 'AxialTech Labs', 'FutureScale Industries',
  'DynamicData Systems', 'VortexAI Analytics', 'PinnacleData Inc'
];

const INDIAN_REGIONS = ['North', 'South', 'East', 'West', 'Northeast', 'Central'];

const INDIAN_CITIES = {
  'North': ['Delhi', 'Gurgaon', 'Noida', 'Chandigarh', 'Jaipur'],
  'South': ['Bangalore', 'Hyderabad', 'Chennai', 'Kochi', 'Pune'],
  'East': ['Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi'],
  'West': ['Mumbai', 'Ahmedabad', 'Surat', 'Vadodara'],
  'Northeast': ['Guwahati', 'Imphal'],
  'Central': ['Indore', 'Nagpur', 'Lucknow']
};

const INDUSTRIES = [
  'FinTech', 'E-commerce', 'SaaS', 'Retail', 'Manufacturing',
  'Healthcare Tech', 'EdTech', 'Logistics', 'Real Estate', 'Travel'
];

const PRODUCTS = [
  {
    name: 'Enterprise Suite Pro',
    category: 'SaaS',
    basePrice: 4999,
    monthlyRecurringRevenue: 4999,
    annualPrice: 49990,
    conversionRate: 4.2,
    profitMargin: 72
  },
  {
    name: 'API Intelligence Pack',
    category: 'API',
    basePrice: 1999,
    monthlyRecurringRevenue: 1999,
    annualPrice: 19990,
    conversionRate: 6.8,
    profitMargin: 68
  },
  {
    name: 'AI Forecast Pro',
    category: 'SaaS',
    basePrice: 2499,
    monthlyRecurringRevenue: 2499,
    annualPrice: 24990,
    conversionRate: 5.1,
    profitMargin: 75
  },
  {
    name: 'Sales Pulse Analytics',
    category: 'SaaS',
    basePrice: 3999,
    monthlyRecurringRevenue: 3999,
    annualPrice: 39990,
    conversionRate: 3.9,
    profitMargin: 70
  },
  {
    name: 'Premium Support SLA',
    category: 'Services',
    basePrice: 999,
    monthlyRecurringRevenue: 999,
    annualPrice: 9990,
    conversionRate: 7.2,
    profitMargin: 65
  },
  {
    name: 'Revenue Intelligence OS',
    category: 'SaaS',
    basePrice: 5999,
    monthlyRecurringRevenue: 5999,
    annualPrice: 59990,
    conversionRate: 3.2,
    profitMargin: 76
  },
  {
    name: 'DataVision Dashboard',
    category: 'SaaS',
    basePrice: 2199,
    monthlyRecurringRevenue: 2199,
    annualPrice: 21990,
    conversionRate: 5.8,
    profitMargin: 71
  },
  {
    name: 'PredictIQ Engine',
    category: 'API',
    basePrice: 1499,
    monthlyRecurringRevenue: 1499,
    annualPrice: 14990,
    conversionRate: 8.1,
    profitMargin: 69
  },
  {
    name: 'MarketFlow Analytics',
    category: 'SaaS',
    basePrice: 3499,
    monthlyRecurringRevenue: 3499,
    annualPrice: 34990,
    conversionRate: 4.5,
    profitMargin: 73
  },
  {
    name: 'Enterprise Custom Dev',
    category: 'Services',
    basePrice: 24999,
    monthlyRecurringRevenue: 0,
    annualPrice: 0,
    conversionRate: 1.2,
    profitMargin: 55
  }
];

const CHANNELS = ['website', 'mobile', 'direct_sales', 'affiliate', 'marketplace'];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateIndianCustomers(count: number) {
  const customers = [];
  const usedEmails = new Set<string>();
  
  // Add mandatory names first
  MANDATORY_NAMES.forEach((firstName) => {
    const lastName = faker.helpers.arrayElement(INDIAN_LAST_NAMES);
    const region = faker.helpers.arrayElement(INDIAN_REGIONS);
    const cities = INDIAN_CITIES[region as keyof typeof INDIAN_CITIES];
    const city = faker.helpers.arrayElement(cities);
    
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${faker.company.name().toLowerCase().replace(/\s+/g, '')}.com`;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}_${faker.string.nanoid(4)}@business.com`;
    }
    usedEmails.add(email);
    
    customers.push({
      fullName: `${firstName} ${lastName}`,
      email,
      companyName: faker.helpers.arrayElement(INDIAN_COMPANIES),
      industry: faker.helpers.arrayElement(INDUSTRIES),
      region,
      city,
      state: faker.location.state(),
      subscriptionTier: faker.helpers.arrayElement(['starter', 'pro', 'enterprise']),
      customerLifetimeValue: faker.number.int({ min: 5000, max: 500000 }),
      churnRiskScore: faker.number.int({ min: 0, max: 100 }),
      joinedAt: faker.date.past({ years: 3 })
    });
  });
  
  // Add more random Indian names to reach the count
  for (let i = MANDATORY_NAMES.length; i < count; i++) {
    const firstName = faker.helpers.arrayElement(INDIAN_FIRST_NAMES);
    const lastName = faker.helpers.arrayElement(INDIAN_LAST_NAMES);
    const region = faker.helpers.arrayElement(INDIAN_REGIONS);
    const cities = INDIAN_CITIES[region as keyof typeof INDIAN_CITIES];
    const city = faker.helpers.arrayElement(cities);
    
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${faker.company.name().toLowerCase().replace(/\s+/g, '')}.com`;
    while (usedEmails.has(email)) {
      email = `user_${faker.string.nanoid(8)}@business.com`;
    }
    usedEmails.add(email);
    
    customers.push({
      fullName: `${firstName} ${lastName}`,
      email,
      companyName: faker.helpers.arrayElement(INDIAN_COMPANIES),
      industry: faker.helpers.arrayElement(INDUSTRIES),
      region,
      city,
      state: faker.location.state(),
      subscriptionTier: faker.helpers.arrayElement(['starter', 'pro', 'enterprise']),
      customerLifetimeValue: faker.number.int({ min: 5000, max: 500000 }),
      churnRiskScore: faker.number.int({ min: 0, max: 100 }),
      joinedAt: faker.date.past({ years: 3 })
    });
  }
  
  return customers;
}

function generateOrders(customerIds: string[], productIds: string[], count: number) {
  const orders = [];
  
  for (let i = 0; i < count; i++) {
    const customerId = faker.helpers.arrayElement(customerIds);
    const productId = faker.helpers.arrayElement(productIds);
    const quantity = faker.number.int({ min: 1, max: 5 });
    const amount = faker.number.int({ min: 999, max: 50000 });
    
    orders.push({
      orderId: `ORD-${String(8800 + i).padStart(4, '0')}`,
      customerId,
      productId,
      amount,
      quantity,
      paymentStatus: faker.helpers.weightedArrayElement([
        { weight: 92, value: 'completed' },
        { weight: 5, value: 'pending' },
        { weight: 3, value: 'failed' }
      ]),
      refundStatus: faker.helpers.weightedArrayElement([
        { weight: 95, value: 'none' },
        { weight: 3, value: 'partial' },
        { weight: 2, value: 'full' }
      ]),
      refundAmount: faker.number.int({ min: 0, max: amount }),
      salesChannel: faker.helpers.arrayElement(CHANNELS),
      region: faker.helpers.arrayElement(INDIAN_REGIONS),
      city: faker.helpers.arrayElement(['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune']),
      createdAt: faker.date.recent({ days: 90 })
    });
  }
  
  return orders;
}

function generateForecasts(productIds: string[]) {
  const forecasts = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    for (const productId of productIds) {
      const baseRevenue = faker.number.int({ min: 10000, max: 100000 });
      const variance = faker.number.int({ min: 500, max: 5000 });
      
      forecasts.push({
        productId,
        forecastDate,
        predictedRevenue: baseRevenue + faker.number.int({ min: -variance, max: variance }),
        lowerBound: baseRevenue - variance,
        upperBound: baseRevenue + variance,
        confidenceScore: faker.number.float({ min: 85, max: 99, precision: 0.1 }),
        anomalyScore: faker.number.float({ min: 0, max: 15, precision: 0.1 }),
        trendDirection: faker.helpers.arrayElement(['up', 'down', 'stable'])
      });
    }
  }
  
  return forecasts;
}

function generateInsights() {
  const insightTitles = [
    'Enterprise segment driving 45% revenue growth',
    'SaaS subscriptions show 24% weekend spike',
    'API usage tier upgrades accelerating in South region',
    'Refund rate decreased 2.3% month-over-month',
    'New customer acquisition up 18% from affiliate channel',
    'High-value accounts showing increased engagement',
    'Churn risk detected in 3 legacy accounts',
    'Revenue per customer increased by 12%'
  ];
  
  return insightTitles.map(title => ({
    title,
    description: faker.lorem.sentences(2),
    insightType: faker.helpers.arrayElement(['positive', 'warning', 'info']),
    category: faker.helpers.arrayElement(['Revenue', 'Conversion', 'Growth', 'Churn']),
    confidenceScore: faker.number.int({ min: 75, max: 99 }),
    affectedRegion: faker.helpers.arrayElement(INDIAN_REGIONS),
    severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
    generatedAt: faker.date.recent({ days: 7 })
  }));
}

function generateRiskAlerts(customerIds: string[]) {
  const alertMessages = [
    'Churn risk: No login activity in 14 days',
    'Payment failed: Card declined on renewal',
    'Refund spike: 3 refunds in last 48 hours',
    'Usage anomaly: API calls increased 500%',
    'Behavioral change: Downgrade initiated',
    'Support ticket: Critical issue reported'
  ];
  
  return customerIds.slice(0, 8).map((customerId, i) => ({
    customerId,
    alertTitle: alertMessages[i % alertMessages.length].split(':')[0],
    alertMessage: alertMessages[i % alertMessages.length],
    severity: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    riskCategory: faker.helpers.arrayElement(['Churn', 'Payment', 'Usage', 'Behavior']),
    detectedAt: faker.date.recent({ days: 3 })
  }));
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');
  
  try {
    // 1. Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.userActivity.deleteMany({});
    await prisma.riskAlert.deleteMany({});
    await prisma.revenueInsight.deleteMany({});
    await prisma.forecast.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productPerformance.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.regionPerformance.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.dailyMetric.deleteMany({});
    await prisma.monthlyMetric.deleteMany({});
    console.log('✅ Database cleared\n');
    
    // 2. Create products
    console.log('📦 Creating 10 enterprise products...');
    const createdProducts = await Promise.all(
      PRODUCTS.map(product =>
        prisma.product.create({ data: product })
      )
    );
    console.log(`✅ Created ${createdProducts.length} products\n`);
    
    // 3. Create customers (MINIMUM 35 with MANDATORY NAMES)
    console.log('👥 Creating 42 Indian enterprise customers...');
    const customerData = generateIndianCustomers(42);
    const createdCustomers = await Promise.all(
      customerData.map(customer =>
        prisma.customer.create({ data: customer })
      )
    );
    console.log(`✅ Created ${createdCustomers.length} customers including all mandatory names\n`);
    
    // 4. Create 50,000 realistic orders
    console.log('📊 Generating 50,000 enterprise transactions (this may take a moment)...');
    const customerIds = createdCustomers.map(c => c.id);
    const productIds = createdProducts.map(p => p.id);
    const orderData = generateOrders(customerIds, productIds, 50000);
    
    // Batch insert orders in chunks of 1000
    for (let i = 0; i < orderData.length; i += 1000) {
      const batch = orderData.slice(i, i + 1000);
      await prisma.order.createMany({ data: batch });
      process.stdout.write(`\r  Progress: ${Math.min(i + 1000, orderData.length)} / ${orderData.length}`);
    }
    console.log(`\n✅ Created ${orderData.length} orders\n`);
    
    // 5. Create forecasts
    console.log('🔮 Creating 30-day forecast predictions...');
    const forecastData = generateForecasts(productIds);
    await prisma.forecast.createMany({ data: forecastData });
    console.log(`✅ Created ${forecastData.length} forecast records\n`);
    
    // 6. Create AI insights
    console.log('💡 Generating AI revenue insights...');
    const insights = generateInsights();
    await prisma.revenueInsight.createMany({ data: insights });
    console.log(`✅ Created ${insights.length} insights\n`);
    
    // 7. Create risk alerts
    console.log('⚠️  Creating risk detection alerts...');
    const alerts = generateRiskAlerts(customerIds);
    await prisma.riskAlert.createMany({ data: alerts });
    console.log(`✅ Created ${alerts.length} risk alerts\n`);
    
    // 8. Calculate aggregated metrics
    console.log('📈 Computing regional performance metrics...');
    for (const region of INDIAN_REGIONS) {
      const regionOrders = await prisma.order.aggregate({
        where: { region },
        _sum: { amount: true },
        _count: true
      });
      
      const regionCustomers = await prisma.customer.findMany({
        where: { region },
        select: { id: true }
      });
      
      await prisma.regionPerformance.upsert({
        where: { region },
        update: {
          totalRevenue: regionOrders._sum.amount || 0,
          totalOrders: regionOrders._count,
          customerCount: regionCustomers.length,
          growthPercentage: faker.number.float({ min: -10, max: 50, precision: 0.1 })
        },
        create: {
          region,
          totalRevenue: regionOrders._sum.amount || 0,
          totalOrders: regionOrders._count,
          customerCount: regionCustomers.length,
          growthPercentage: faker.number.float({ min: -10, max: 50, precision: 0.1 })
        }
      });
    }
    console.log('✅ Regional metrics computed\n');
    
    // 9. Calculate product performance
    console.log('📊 Computing product performance analytics...');
    for (const product of createdProducts) {
      const productOrders = await prisma.order.aggregate({
        where: { productId: product.id },
        _sum: { amount: true },
        _count: true
      });
      
      await prisma.productPerformance.upsert({
        where: { productId: product.id },
        update: {
          totalRevenue: productOrders._sum.amount || 0,
          totalOrders: productOrders._count,
          unitsSold: faker.number.int({ min: 10, max: 500 })
        },
        create: {
          productId: product.id,
          totalRevenue: productOrders._sum.amount || 0,
          totalOrders: productOrders._count,
          unitsSold: faker.number.int({ min: 10, max: 500 })
        }
      });
    }
    console.log('✅ Product performance computed\n');
    
    // 10. Generate sample user activities
    console.log('🔔 Creating user activity logs...');
    const activities = [];
    for (let i = 0; i < 1000; i++) {
      activities.push({
        customerId: faker.helpers.arrayElement(customerIds),
        activityType: faker.helpers.arrayElement(['login', 'order', 'support_ticket', 'feature_usage']),
        timestamp: faker.date.recent({ days: 30 })
      });
    }
    await prisma.userActivity.createMany({ data: activities });
    console.log(`✅ Created ${activities.length} activity records\n`);
    
    console.log('═'.repeat(60));
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log(`
📊 DATABASE SUMMARY:
  ✓ Products: ${createdProducts.length}
  ✓ Customers: ${createdCustomers.length} (including all mandatory Indian names)
  ✓ Orders: 50,000 enterprise transactions
  ✓ Forecasts: ${forecastData.length}
  ✓ Insights: ${insights.length}
  ✓ Risk Alerts: ${alerts.length}
  ✓ User Activities: ${activities.length}
  ✓ Regional Metrics: ${INDIAN_REGIONS.length}
  ✓ Product Performance: ${createdProducts.length}
    `);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
