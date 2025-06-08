import { query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}

export const getCostStatistics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const records = await ctx.db
      .query('maintenanceRecords')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect();

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Group by year
    const costsByYear: Record<number, number> = {};
    let currentYearCost = 0;
    let previousYearCost = 0;

    records.forEach((record) => {
      const year = new Date(record.repairDate).getFullYear();
      const cost = record.cost || 0;

      if (!costsByYear[year]) {
        costsByYear[year] = 0;
      }
      costsByYear[year] += cost;

      if (year === currentYear) {
        currentYearCost += cost;
      } else if (year === previousYear) {
        previousYearCost += cost;
      }
    });

    // Calculate percentage change
    const percentageChange = previousYearCost > 0 ? ((currentYearCost - previousYearCost) / previousYearCost) * 100 : currentYearCost > 0 ? 100 : 0;

    // Prepare chart data (last 10 years)
    const chartData = [];
    for (let i = 9; i >= 0; i--) {
      const year = currentYear - i;
      chartData.push({
        year: year.toString(),
        cost: costsByYear[year] || 0,
      });
    }

    return {
      currentYearCost,
      previousYearCost,
      percentageChange: Math.round(percentageChange * 100) / 100,
      chartData,
      totalCost: Object.values(costsByYear).reduce((sum, cost) => sum + cost, 0),
    };
  },
});
