const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Sonu Singh';
pres.title = 'AI Intern Assignment - Emitrr Lead Analysis';

// Color palette: Midnight Executive feel
const C = {
  navy: "1E2761",
  iceBlue: "CADCFC",
  white: "FFFFFF",
  accent: "4FC3F7",
  dark: "0D1B4B",
  lightGray: "F4F6FB",
  midGray: "8A9BBE",
  green: "2ECC71",
  orange: "F39C12",
  red: "E74C3C",
  teal: "1ABC9C",
  purple: "9B59B6",
};

const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 45, opacity: 0.13 });

// ─────────────────────────────────────────────
// SLIDE 1: TITLE
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  // Big circle accent top-right
  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.2, w: 4, h: 4, fill: { color: C.dark, transparency: 0 }, line: { color: C.accent, width: 2 } });
  s.addShape(pres.shapes.OVAL, { x: 8.2, y: -0.5, w: 2.5, h: 2.5, fill: { color: C.accent, transparency: 70 }, line: { color: "000000", width: 0 } });

  s.addText("EMITRR", { x: 0.6, y: 0.5, w: 6, h: 0.45, fontSize: 13, color: C.accent, bold: true, charSpacing: 8, fontFace: "Calibri", margin: 0 });

  s.addText("Lead Intelligence\n& Revenue Analysis", {
    x: 0.6, y: 1.0, w: 8.5, h: 1.8,
    fontSize: 44, color: C.white, bold: true, fontFace: "Cambria", align: "left"
  });

  s.addText("AI-Powered Sales & Business Operations Assignment", {
    x: 0.6, y: 2.85, w: 7.5, h: 0.4,
    fontSize: 16, color: C.iceBlue, fontFace: "Calibri"
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.35, w: 3.5, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });

  s.addText([
    { text: "Prepared by: ", options: { color: C.midGray, fontSize: 13, fontFace: "Calibri" } },
    { text: "Sonu Singh", options: { color: C.white, fontSize: 13, bold: true, fontFace: "Calibri" } },
  ], { x: 0.6, y: 3.55, w: 5, h: 0.3 });

  s.addText("Dataset: 1,000 Healthcare Leads  |  Jun 2026", {
    x: 0.6, y: 3.95, w: 6, h: 0.28, fontSize: 11, color: C.midGray, fontFace: "Calibri"
  });

  // Stats row bottom
  const stats = [
    { val: "1,000", lbl: "Total Leads" },
    { val: "22.2%", lbl: "Demo Rate" },
    { val: "6.7%", lbl: "Conversion" },
    { val: "$2.6M", lbl: "Revenue Potential" },
  ];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.5, w: 2.1, h: 0.9, fill: { color: C.dark }, rectRadius: 0.07, shadow: makeShadow() });
    s.addText(st.val, { x, y: 4.53, w: 2.1, h: 0.42, fontSize: 20, color: C.accent, bold: true, align: "center", fontFace: "Cambria" });
    s.addText(st.lbl, { x, y: 4.92, w: 2.1, h: 0.25, fontSize: 9, color: C.iceBlue, align: "center", fontFace: "Calibri" });
  });
}

// ─────────────────────────────────────────────
// SLIDE 2: DESCRIPTIVE ANALYSIS
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightGray };

  s.addText("Descriptive Analysis", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.navy, bold: true, fontFace: "Cambria" });
  s.addText("Overview of 1,000 healthcare leads across sources, industries & geographies", {
    x: 0.5, y: 0.82, w: 9, h: 0.32, fontSize: 13, color: C.midGray, fontFace: "Calibri"
  });

  // 4 KPI cards
  const kpis = [
    { icon: "👥", val: "1,000", lbl: "Total Leads", sub: "Jan 2025 – Jun 2026" },
    { icon: "📅", val: "222", lbl: "Demos Booked", sub: "22.2% demo rate" },
    { icon: "🏆", val: "67", lbl: "Customers Won", sub: "30.2% demo→customer" },
    { icon: "💰", val: "$2,626", lbl: "Avg Monthly Rev", sub: "per lead potential" },
  ];
  kpis.forEach((k, i) => {
    const x = 0.5 + i * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.25, w: 2.1, h: 1.2, fill: { color: C.white }, rectRadius: 0.1, shadow: makeShadow() });
    s.addText(k.icon, { x, y: 1.28, w: 2.1, h: 0.45, fontSize: 22, align: "center" });
    s.addText(k.val, { x, y: 1.7, w: 2.1, h: 0.38, fontSize: 20, color: C.navy, bold: true, align: "center", fontFace: "Cambria" });
    s.addText(k.lbl, { x, y: 2.05, w: 2.1, h: 0.2, fontSize: 9, color: C.midGray, align: "center", fontFace: "Calibri" });
    s.addText(k.sub, { x, y: 2.25, w: 2.1, h: 0.18, fontSize: 8, color: C.accent, align: "center", fontFace: "Calibri" });
  });

  // Source breakdown bar chart
  s.addText("Leads by Source", { x: 0.5, y: 2.65, w: 4.5, h: 0.3, fontSize: 13, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addChart(pres.charts.BAR, [{
    name: "Leads",
    labels: ["Organic", "Paid Search", "Referral", "Direct", "LinkedIn", "Webinar", "Email"],
    values: [156, 149, 146, 141, 141, 135, 132]
  }], {
    x: 0.5, y: 3.0, w: 4.5, h: 2.4, barDir: "bar",
    chartColors: ["1E2761"],
    chartArea: { fill: { color: C.white }, roundedCorners: true },
    catAxisLabelColor: "444444", valAxisLabelColor: "444444",
    valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: C.white, showLegend: false,
  });

  // Industry pie chart
  s.addText("Revenue Potential by Industry", { x: 5.3, y: 2.65, w: 4.5, h: 0.3, fontSize: 13, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addChart(pres.charts.PIE, [{
    name: "Revenue",
    labels: ["Dental", "Behavioral Health", "Primary Care", "ABA Therapy", "Home Health", "Physical Therapy"],
    values: [461708, 456215, 449352, 447016, 442263, 369083]
  }], {
    x: 5.3, y: 3.0, w: 4.4, h: 2.4,
    chartColors: ["1E2761", "4FC3F7", "2ECC71", "F39C12", "9B59B6", "E74C3C"],
    showPercent: true, showLegend: true, legendPos: "b", legendFontSize: 9,
    chartArea: { fill: { color: C.white }, roundedCorners: true },
  });
}

// ─────────────────────────────────────────────
// SLIDE 3: FUNNEL ANALYSIS
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Funnel Analysis", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.navy, bold: true, fontFace: "Cambria" });
  s.addText("Lead → Demo → Customer conversion journey with source-level breakdown", {
    x: 0.5, y: 0.82, w: 9, h: 0.3, fontSize: 13, color: C.midGray, fontFace: "Calibri"
  });

  // Funnel stages — 3 compact bars, all fit in top half
  const stages = [
    { lbl: "Leads Generated", val: 1000, pct: "100%", col: C.navy, w: 9 },
    { lbl: "Demo Booked", val: 222, pct: "22.2%", col: "1565A8", w: 6.5 },
    { lbl: "Converted to Customer", val: 67, pct: "6.7%", col: C.teal, w: 4 },
  ];
  stages.forEach((st, i) => {
    const leftPad = (9 - st.w) / 2;
    const y = 1.18 + i * 0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5 + leftPad, y, w: st.w, h: 0.58, fill: { color: st.col }, rectRadius: 0.05 });
    s.addText(`${st.lbl}   |   ${st.val.toLocaleString()}   |   ${st.pct}`, {
      x: 0.5 + leftPad + 0.15, y: y + 0.1, w: st.w - 0.3, h: 0.38,
      fontSize: 12, color: C.white, bold: true, fontFace: "Calibri", valign: "middle"
    });
    if (i < 2) {
      s.addShape(pres.shapes.LINE, { x: 4.8, y: y + 0.6, w: 0, h: 0.18, line: { color: C.midGray, width: 2 } });
    }
  });

  // Chart + insight in bottom half — starts at y=3.6, well clear of y=3.44 (last bar bottom)
  s.addText("Conversion Rate by Source (%)", { x: 0.5, y: 3.6, w: 5.5, h: 0.28, fontSize: 12, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addChart(pres.charts.BAR, [
    {
      name: "Demo Rate %",
      labels: ["Referral", "Webinar", "Organic", "Direct", "LinkedIn", "Paid Search", "Email"],
      values: [32.9, 31.1, 25.0, 22.7, 19.1, 14.1, 9.8]
    },
    {
      name: "Customer Rate %",
      labels: ["Referral", "Webinar", "Organic", "Direct", "LinkedIn", "Paid Search", "Email"],
      values: [8.2, 11.9, 7.1, 7.1, 6.4, 4.0, 2.3]
    }
  ], {
    x: 0.5, y: 3.92, w: 5.5, h: 1.6, barDir: "bar", barGrouping: "clustered",
    chartColors: [C.navy, C.accent],
    chartArea: { fill: { color: C.lightGray }, roundedCorners: true },
    catAxisLabelColor: "444444", valAxisLabelColor: "444444",
    valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelFontSize: 8, showLegend: true, legendPos: "t", legendFontSize: 9,
  });

  // Key insight box — aligned with chart bottom
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y: 3.6, w: 3.6, h: 1.92, fill: { color: C.lightGray }, rectRadius: 0.1, shadow: makeShadow() });
  s.addText("Key Insights", { x: 6.35, y: 3.7, w: 3.3, h: 0.28, fontSize: 12, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addText([
    { text: "🔥 Webinar", options: { bold: true, color: C.navy } },
    { text: " — highest customer rate: 11.9%\n", options: { color: "333333" } },
    { text: "📧 Email", options: { bold: true, color: C.navy } },
    { text: " — lowest at just 2.3% conversion\n", options: { color: "333333" } },
    { text: "🤝 Referral", options: { bold: true, color: C.navy } },
    { text: " — best demo rate: 32.9%\n", options: { color: "333333" } },
    { text: "📊 Overall", options: { bold: true, color: C.navy } },
    { text: " — 30.2% of demos convert", options: { color: "333333" } },
  ], { x: 6.35, y: 4.02, w: 3.3, h: 1.4, fontSize: 10, fontFace: "Calibri" });
}

// ─────────────────────────────────────────────
// SLIDE 4: REVENUE POTENTIAL ANALYSIS
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightGray };

  s.addText("Revenue Potential Analysis", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.navy, bold: true, fontFace: "Cambria" });
  s.addText("$2.63M total monthly revenue potential across all leads — identifying high-value segments", {
    x: 0.5, y: 0.82, w: 9, h: 0.3, fontSize: 13, color: C.midGray, fontFace: "Calibri"
  });

  // Revenue by industry bar — no value labels on bars (they clutter), use a cleaner chart
  s.addText("Total Revenue Potential by Industry ($)", { x: 0.5, y: 1.25, w: 5.5, h: 0.3, fontSize: 13, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addChart(pres.charts.BAR, [{
    name: "Revenue ($)",
    labels: ["Dental", "Beh. Health", "Primary Care", "ABA Therapy", "Home Health", "Phys. Therapy"],
    values: [461708, 456215, 449352, 447016, 442263, 369083]
  }], {
    x: 0.5, y: 1.6, w: 5.5, h: 2.5, barDir: "col",
    chartColors: ["1E2761", "1565A8", "1ABC9C", "F39C12", "9B59B6", "4FC3F7"],
    chartArea: { fill: { color: C.white }, roundedCorners: true },
    catAxisLabelColor: "444444", valAxisLabelColor: "444444",
    valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
    showValue: false, showLegend: false,
  });

  // Right side: revenue insights
  const revData = [
    { lbl: "Dental", rev: "$2,594", dr: "21.9%", cr: "6.7%" },
    { lbl: "Home Health", rev: "$2,799", dr: "15.2%", cr: "5.7%" },
    { lbl: "Beh. Health", rev: "$2,782", dr: "27.4%", cr: "5.5%" },
    { lbl: "Phys. Therapy", rev: "$2,618", dr: "22.7%", cr: "9.2%" },
    { lbl: "ABA Therapy", rev: "$2,526", dr: "21.5%", cr: "6.2%" },
    { lbl: "Primary Care", rev: "$2,469", dr: "24.2%", cr: "7.1%" },
  ];
  s.addText("Avg Revenue  |  Demo Rate  |  Conv. Rate", {
    x: 6.2, y: 1.25, w: 3.6, h: 0.28, fontSize: 9, color: C.midGray, fontFace: "Calibri"
  });
  revData.forEach((r, i) => {
    const y = 1.6 + i * 0.42;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y, w: 3.6, h: 0.36, fill: { color: C.white }, rectRadius: 0.05, shadow: makeShadow() });
    s.addText(r.lbl, { x: 6.35, y: y+0.05, w: 1.2, h: 0.25, fontSize: 10, color: C.navy, bold: true, fontFace: "Calibri" });
    s.addText(r.rev, { x: 7.55, y: y+0.05, w: 0.8, h: 0.25, fontSize: 10, color: C.teal, bold: true, fontFace: "Calibri", align: "center" });
    s.addText(r.dr, { x: 8.35, y: y+0.05, w: 0.65, h: 0.25, fontSize: 10, color: C.orange, fontFace: "Calibri", align: "center" });
    s.addText(r.cr, { x: 8.98, y: y+0.05, w: 0.65, h: 0.25, fontSize: 10, color: C.green, fontFace: "Calibri", align: "center" });
  });

  // Bottom: Top states as clean stat cards instead of cramped bar chart
  s.addText("Revenue by State (Top 5)", { x: 0.5, y: 4.28, w: 5.5, h: 0.28, fontSize: 12, color: C.navy, bold: true, fontFace: "Calibri" });
  const stateData = [
    { st: "NC", rev: "$304K", cr: "6.8%" },
    { st: "GA", rev: "$294K", cr: "6.8%" },
    { st: "IL", rev: "$272K", cr: "8.6%" },
    { st: "FL", rev: "$269K", cr: "4.9%" },
    { st: "AZ", rev: "$264K", cr: "6.6%" },
  ];
  stateData.forEach((d, i) => {
    const x = 0.5 + i * 1.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.6, w: 0.98, h: 0.88, fill: { color: C.white }, rectRadius: 0.07, shadow: makeShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.6, w: 0.98, h: 0.26, fill: { color: C.navy }, rectRadius: 0.07 });
    s.addText(d.st, { x, y: 4.62, w: 0.98, h: 0.22, fontSize: 12, color: C.white, bold: true, align: "center", fontFace: "Cambria" });
    s.addText(d.rev, { x, y: 4.88, w: 0.98, h: 0.26, fontSize: 10, color: C.teal, bold: true, align: "center", fontFace: "Calibri" });
    s.addText(d.cr + " conv.", { x, y: 5.12, w: 0.98, h: 0.2, fontSize: 8, color: C.midGray, align: "center", fontFace: "Calibri" });
  });
}

// ─────────────────────────────────────────────
// SLIDE 5: TREND ANALYSIS
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Trend Analysis", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.navy, bold: true, fontFace: "Cambria" });
  s.addText("Monthly lead volume and revenue trends from Jan 2025 to Jun 2026", {
    x: 0.5, y: 0.82, w: 9, h: 0.3, fontSize: 13, color: C.midGray, fontFace: "Calibri"
  });

  const months = ["Jan'25","Feb'25","Mar'25","Apr'25","May'25","Jun'25","Jul'25","Aug'25","Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26","Jun'26"];
  const leads  = [60,64,67,69,48,62,58,56,58,61,55,42,58,47,53,52,56,34];
  const revs   = [168033,181673,175351,186193,118084,169890,151784,144445,153631,165941,157345,94171,149158,109131,126393,128644,154402,91368];

  // Lead volume line
  s.addText("Monthly Lead Volume", { x: 0.5, y: 1.25, w: 9, h: 0.28, fontSize: 13, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addChart(pres.charts.LINE, [{
    name: "Leads",
    labels: months,
    values: leads
  }], {
    x: 0.5, y: 1.55, w: 9, h: 1.65, lineSize: 3, lineSmooth: true,
    chartColors: [C.navy],
    chartArea: { fill: { color: C.lightGray }, roundedCorners: true },
    catAxisLabelColor: "444444", valAxisLabelColor: "444444",
    valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
    showValue: false, showLegend: false,
  });

  // Revenue line
  s.addText("Monthly Revenue Potential ($)", { x: 0.5, y: 3.32, w: 9, h: 0.28, fontSize: 13, color: C.navy, bold: true, fontFace: "Calibri" });
  s.addChart(pres.charts.LINE, [{
    name: "Revenue",
    labels: months,
    values: revs
  }], {
    x: 0.5, y: 3.62, w: 9, h: 1.55, lineSize: 3, lineSmooth: true,
    chartColors: [C.teal],
    chartArea: { fill: { color: C.lightGray }, roundedCorners: true },
    catAxisLabelColor: "444444", valAxisLabelColor: "444444",
    valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
    showValue: false, showLegend: false,
  });

  // Key trend insight bar — fully visible at bottom
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 5.25, w: 9, h: 0.32, fill: { color: C.navy }, rectRadius: 0.05 });
  s.addText("📉 Dip: May '25 & Dec '25 (seasonal)   |   📈 Peak: Apr '25 — 69 leads, $186K   |   ⚠️ Jun '26 = partial month (18 days)", {
    x: 0.6, y: 5.27, w: 8.8, h: 0.28, fontSize: 10, color: C.iceBlue, align: "center", fontFace: "Calibri"
  });
}

// ─────────────────────────────────────────────
// SLIDE 6: GROWTH OPPORTUNITIES
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightGray };

  s.addText("Growth Opportunities", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.navy, bold: true, fontFace: "Cambria" });
  s.addText("AI-identified high-impact areas to accelerate revenue and improve conversion", {
    x: 0.5, y: 0.82, w: 9, h: 0.3, fontSize: 13, color: C.midGray, fontFace: "Calibri"
  });

  const opps = [
    {
      num: "01",
      title: "Double Down on Webinars",
      body: "Webinar leads convert at 11.9% — the highest of any source. Increasing webinar frequency and targeting Physical Therapy & Primary Care audiences can significantly boost closed deals.",
      col: C.navy,
      tag: "🎯 High Priority"
    },
    {
      num: "02",
      title: "Fix the Email Channel",
      body: "Email has a 2.3% conversion rate — 5× lower than Webinar. Personalization, automated follow-ups, and better segmentation could unlock untapped leads in this channel.",
      col: "1565A8",
      tag: "📧 Quick Win"
    },
    {
      num: "03",
      title: "Target Physical Therapy Verticals",
      body: "Physical Therapy has the highest customer conversion rate at 9.2%. A dedicated outreach campaign for this segment with referral + webinar mix can yield outsized returns.",
      col: C.teal,
      tag: "🏥 Vertical Focus"
    },
    {
      num: "04",
      title: "Expand in NY & IL Markets",
      body: "NY shows 12.0% customer rate and IL 8.6% — both above average. These states are high-value markets with strong conversion potential worth scaling efforts in.",
      col: C.purple,
      tag: "📍 Geo Expansion"
    },
    {
      num: "05",
      title: "Nurture Mid-Size Orgs (50–300 Employees)",
      body: "Employee count is the #1 ML feature (65.6% importance). Companies in the 50–300 employee band show the best balance of deal size and close probability.",
      col: C.orange,
      tag: "🤖 ML Insight"
    },
    {
      num: "06",
      title: "Reduce Demo-to-Close Drop-off",
      body: "Only 30.2% of demos convert to customers. Investing in demo quality, follow-up cadence, and tailored proposals can improve this ratio substantially.",
      col: "C0392B",
      tag: "📊 Pipeline Fix"
    },
  ];

  opps.forEach((op, i) => {
    const col = i % 2 === 0 ? 0.5 : 5.2;
    const row = Math.floor(i / 2);
    const y = 1.25 + row * 1.5;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: col, y, w: 4.5, h: 1.3, fill: { color: C.white }, rectRadius: 0.1, shadow: makeShadow() });
    // Colored left badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: col, y, w: 0.5, h: 1.3, fill: { color: op.col }, rectRadius: 0.08 });
    s.addText(op.num, { x: col, y: y + 0.45, w: 0.5, h: 0.35, fontSize: 11, color: C.white, bold: true, align: "center", fontFace: "Cambria" });
    s.addText(op.tag, { x: col + 0.6, y: y + 0.05, w: 3.7, h: 0.22, fontSize: 9, color: op.col, bold: true, fontFace: "Calibri" });
    s.addText(op.title, { x: col + 0.6, y: y + 0.27, w: 3.7, h: 0.3, fontSize: 12, color: C.navy, bold: true, fontFace: "Calibri" });
    s.addText(op.body, { x: col + 0.6, y: y + 0.57, w: 3.7, h: 0.65, fontSize: 9.5, color: "444444", fontFace: "Calibri" });
  });
}

// ─────────────────────────────────────────────
// SLIDE 7: ML LEAD SCORING MODEL
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("ML Lead Scoring Model", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.white, bold: true, fontFace: "Cambria" });
  s.addText("Gradient Boosting model assigns each lead a score of 1–10 (likelihood to convert to customer)", {
    x: 0.5, y: 0.82, w: 9, h: 0.3, fontSize: 13, color: C.iceBlue, fontFace: "Calibri"
  });

  // Feature importance bar chart
  s.addText("Feature Importance (What Drives Conversion?)", {
    x: 0.5, y: 1.25, w: 5.5, h: 0.3, fontSize: 13, color: C.accent, bold: true, fontFace: "Calibri"
  });
  s.addChart(pres.charts.BAR, [{
    name: "Importance",
    labels: ["Employees", "State", "Source", "Industry"],
    values: [65.6, 11.2, 14.0, 9.2]
  }], {
    x: 0.5, y: 1.58, w: 5.5, h: 2.1, barDir: "bar",
    chartColors: [C.accent],
    chartArea: { fill: { color: C.dark }, roundedCorners: true },
    catAxisLabelColor: C.iceBlue, valAxisLabelColor: C.iceBlue,
    valGridLine: { color: "CADCFC", size: 0.3, transparency: 70 }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: C.navy, dataLabelFontSize: 10, showLegend: false,
  });

  // Score distribution
  s.addText("Score Distribution (1=Low → 10=High)", {
    x: 6.2, y: 1.25, w: 3.6, h: 0.3, fontSize: 12, color: C.accent, bold: true, fontFace: "Calibri"
  });
  const scoreDist = [
    { s: "1 (Low)", v: 704, pct: "70%" },
    { s: "2", v: 227, pct: "23%" },
    { s: "3", v: 35, pct: "3.5%" },
    { s: "4–6", v: 23, pct: "2.3%" },
    { s: "7–10 (High)", v: 11, pct: "1.1%" },
  ];
  scoreDist.forEach((sc, i) => {
    const y = 1.65 + i * 0.42;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y, w: 3.6, h: 0.36, fill: { color: C.dark }, rectRadius: 0.05 });
    const barW = Math.max(0.1, (sc.v / 704) * 2.5);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y, w: barW + 0.5, h: 0.36, fill: { color: i === 0 ? "1565A8" : i === 4 ? C.green : C.accent, transparency: i === 0 ? 0 : 30 }, rectRadius: 0.05 });
    s.addText(sc.s, { x: 6.3, y: y + 0.06, w: 1.5, h: 0.24, fontSize: 10, color: C.white, fontFace: "Calibri" });
    s.addText(`${sc.v} leads`, { x: 7.6, y: y + 0.06, w: 1.1, h: 0.24, fontSize: 10, color: C.iceBlue, fontFace: "Calibri", align: "right" });
    s.addText(sc.pct, { x: 8.75, y: y + 0.06, w: 0.8, h: 0.24, fontSize: 10, color: C.accent, bold: true, fontFace: "Calibri", align: "right" });
  });

  // Model info
  s.addText("Model Details", { x: 0.5, y: 3.85, w: 5.5, h: 0.3, fontSize: 12, color: C.accent, bold: true, fontFace: "Calibri" });
  const modelInfo = [
    ["Algorithm", "Gradient Boosting Classifier"],
    ["Accuracy", "95.2%"],
    ["Training Data", "1,000 leads"],
    ["Key Predictor", "Company Size (Employees) — 65.6%"],
    ["Scale", "1 (unlikely) → 10 (highly likely to convert)"],
  ];
  modelInfo.forEach((row, i) => {
    const y = 4.18 + i * 0.26;
    s.addText(row[0] + ":", { x: 0.5, y, w: 1.8, h: 0.24, fontSize: 10, color: C.midGray, fontFace: "Calibri" });
    s.addText(row[1], { x: 2.3, y, w: 3.6, h: 0.24, fontSize: 10, color: C.white, fontFace: "Calibri" });
  });

  // How to use scoring box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y: 3.85, w: 3.6, h: 1.62, fill: { color: C.dark }, rectRadius: 0.08 });
  s.addText("How to Use the Score", { x: 6.35, y: 3.93, w: 3.3, h: 0.28, fontSize: 11, color: C.accent, bold: true, fontFace: "Calibri" });
  s.addText([
    { text: "🔴 Score 1–3:", options: { bold: true, color: C.red } },
    { text: "  Nurture via email drip\n", options: { color: C.iceBlue } },
    { text: "🟡 Score 4–6:", options: { bold: true, color: C.orange } },
    { text: "  SDR outreach + demo invite\n", options: { color: C.iceBlue } },
    { text: "🟢 Score 7–10:", options: { bold: true, color: C.green } },
    { text: "  Priority AE handoff + fast-track demo", options: { color: C.iceBlue } },
  ], { x: 6.35, y: 4.25, w: 3.3, h: 1.1, fontSize: 10, fontFace: "Calibri" });
}

// ─────────────────────────────────────────────
// SLIDE 8: SUMMARY & NEXT STEPS
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 4.5, w: 4, h: 4, fill: { color: C.dark }, line: { color: C.accent, width: 1 } });

  s.addText("Summary & Next Steps", { x: 0.5, y: 0.25, w: 9, h: 0.55, fontSize: 28, color: C.white, bold: true, fontFace: "Cambria" });

  const sumCards = [
    { icon: "📊", title: "Descriptive", body: "1,000 leads across 7 sources, 6 industries. Avg rev potential $2,626/lead. 22.2% demo rate." },
    { icon: "🔽", title: "Funnel", body: "1,000 → 222 demos → 67 customers. Webinar & Referral lead conversion; Email lags." },
    { icon: "💰", title: "Revenue", body: "Dental tops total revenue. Home Health has highest avg revenue/lead at $2,799." },
    { icon: "📈", title: "Trends", body: "Peak in Apr '25. Seasonal dips in May & Dec. YoY growth visible despite partial Jun '26." },
    { icon: "🚀", title: "Growth", body: "Webinar scale-up, Email fix, Physical Therapy vertical focus, NY/IL geo expansion." },
    { icon: "🤖", title: "ML Scoring", body: "GBM model at 95.2% accuracy. Employee count = top predictor. 11 leads scored 7–10." },
  ];

  sumCards.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 2) % 2;  // 2 rows of 3
    const x = 0.5 + col * 3.15;
    const y = 1.2 + Math.floor(i/3) * 1.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.9, h: 1.55, fill: { color: C.dark }, rectRadius: 0.1, shadow: makeShadow() });
    s.addText(c.icon + "  " + c.title, { x: x+0.15, y: y+0.1, w: 2.6, h: 0.32, fontSize: 13, color: C.accent, bold: true, fontFace: "Calibri" });
    s.addText(c.body, { x: x+0.15, y: y+0.45, w: 2.6, h: 1.0, fontSize: 9.5, color: C.iceBlue, fontFace: "Calibri" });
  });

  s.addText("Prepared by  Sonu Singh  ·  AI Intern – Sales & Business Operations  ·  Emitrr", {
    x: 0.5, y: 5.22, w: 9, h: 0.3, fontSize: 10, color: C.midGray, align: "center", fontFace: "Calibri"
  });
}

pres.writeFile({ fileName: "Sonu_Singh_Emitrr_Assignment.pptx" })
  .then(() => console.log("✅ Done — file saved as Sonu_Singh_Emitrr_Assignment.pptx"))
  .catch(e => console.error(e));
