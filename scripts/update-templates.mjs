import db from "../src/lib/db.js";

async function run() {
  console.log("Updating existing email templates to use light mode colors...");

  try {
    const [rows] = await db.execute("SELECT id, name, body_html FROM email_templates");
    console.log(`Found ${rows.length} templates.`);

    for (const row of rows) {
      let updatedHtml = row.body_html || "";

      // Replace background and text colors to suit light theme
      updatedHtml = updatedHtml
        .replace(/#f1f5f9/g, "#0f172a") // light white to dark slate (text/headers)
        .replace(/#cbd5e1/g, "#334155") // light gray to slate-700 (body copy)
        .replace(/#94a3b8/g, "#4b5563") // muted gray to slate-600
        .replace(/#1e293b/g, "#f8fafc") // dark card background to off-white box background
        .replace(/rgba\(255,255,255,0\.08\)/g, "#e2e8f0") // white border to gray border
        .replace(/rgba\(255,255,255,0\.06\)/g, "#e2e8f0")
        .replace(/#60a5fa/g, "#2563eb") // bright blue to deep brand blue
        .replace(/#34d399/g, "#10b981"); // bright green to solid green

      if (updatedHtml !== row.body_html) {
        await db.execute(
          "UPDATE email_templates SET body_html = ? WHERE id = ?",
          [updatedHtml, row.id]
        );
        console.log(`✓ Updated template: "${row.name}" (ID: ${row.id})`);
      } else {
        console.log(`- Template "${row.name}" (ID: ${row.id}) is already using light colors or has no matches.`);
      }
    }

    console.log("Update completed successfully!");
  } catch (error) {
    console.error("Failed to update email templates:", error.message);
  } finally {
    await db.end();
  }
}

run();
