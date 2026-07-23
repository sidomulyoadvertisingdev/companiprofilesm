import db from "../../../lib/db.js";

export const prerender = false;

export async function GET() {
  const [[userStats]] = await db.execute(
    `SELECT
       COUNT(*) AS total_users,
       SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) AS verified_users,
       SUM(CASE WHEN banned = 1 THEN 1 ELSE 0 END) AS banned_users
     FROM marketplace_users`
  );

  const [[codeStats]] = await db.execute(
    `SELECT
       COUNT(*) AS total_codes,
       SUM(CASE WHEN redeemed = 1 THEN 1 ELSE 0 END) AS redeemed_codes,
       SUM(CASE WHEN redeemed = 0 THEN 1 ELSE 0 END) AS unredeemed_codes
     FROM marketplace_codes`
  );

  const [[redemptionStats]] = await db.execute(
    `SELECT COUNT(*) AS total_redemptions FROM marketplace_redemptions`
  );

  const [recentRedemptions] = await db.execute(
    `SELECT mr.created_at, mu.name AS user_name, mu.email AS user_email,
            mc.code, p.title AS product_title, rr.discount_percent
     FROM marketplace_redemptions mr
     JOIN marketplace_users mu ON mr.user_id = mu.id
     JOIN marketplace_codes mc ON mr.code_id = mc.id
     JOIN redeem_rules rr ON mr.rule_id = rr.id
     JOIN products p ON rr.product_id = p.id
     ORDER BY mr.created_at DESC
     LIMIT 10`
  );

  return new Response(JSON.stringify({
    data: {
      users: {
        total: userStats.total_users || 0,
        verified: userStats.verified_users || 0,
        banned: userStats.banned_users || 0,
      },
      codes: {
        total: codeStats.total_codes || 0,
        redeemed: codeStats.redeemed_codes || 0,
        unredeemed: codeStats.unredeemed_codes || 0,
      },
      redemptions: {
        total: redemptionStats.total_redemptions || 0,
      },
      recentRedemptions,
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
