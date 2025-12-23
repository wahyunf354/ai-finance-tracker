import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { format } from "date-fns";

export const exportToPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(22);
  doc.setTextColor(103, 58, 183); // Finflow purple
  doc.text("Finflow - Financial Report", 14, 22);

  // Add Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 14, 30);
  doc.text(`Total Transactions: ${transactions.length}`, 14, 36);

  // Calculate Summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Render Summary Section
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text("Financial Summary", 14, 48);

  // Income/Expense Progress Bar
  const totalturnover = totalIncome + totalExpense;
  const incomeWidth =
    totalturnover > 0 ? (totalIncome / totalturnover) * 180 : 90;

  // Draw Background Bar
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(14, 54, 180, 8, 2, 2, "F");

  // Draw Income Segment
  doc.setFillColor(16, 185, 129); // Green
  doc.roundedRect(14, 54, incomeWidth, 8, 2, 2, "F");

  // Draw Expense Segment (remaining)
  if (totalturnover > 0 && totalExpense > 0) {
    doc.setFillColor(239, 68, 68); // Red
    doc.roundedRect(14 + incomeWidth, 54, 180 - incomeWidth, 8, 2, 2, "F");
  }

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Income: ${formatRupiah(totalIncome)}`, 14, 68);
  doc.text(`Expense: ${formatRupiah(totalExpense)}`, 110, 68);

  doc.setFontSize(12);
  doc.setTextColor(
    balance >= 0 ? 16 : 239,
    balance >= 0 ? 185 : 68,
    balance >= 0 ? 129 : 68
  );
  doc.text(`Net Balance: ${formatRupiah(balance)}`, 14, 78);

  // Category Distribution (Charts)
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text("Spending by Category", 14, 92);

  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  let currentY = 100;
  const maxCategoryAmount = Math.max(
    ...sortedCategories.map(([, amt]) => amt),
    1
  );

  sortedCategories.forEach(([cat, amt]) => {
    const barWidth = (amt / maxCategoryAmount) * 120;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(cat, 14, currentY + 5);

    doc.setFillColor(103, 58, 183, 0.2); // Light purple
    doc.rect(50, currentY, 120, 6, "F");

    doc.setFillColor(103, 58, 183); // Solid purple
    doc.rect(50, currentY, barWidth, 6, "F");

    doc.setFontSize(9);
    doc.text(formatRupiah(amt), 175, currentY + 5);

    currentY += 10;
  });

  // Prepare Table Data
  const tableData = transactions.map((t) => [
    format(new Date(t.date), "d MMM yyyy"),
    t.description,
    t.category,
    t.type === "income" ? "Income" : "Expense",
    formatRupiah(t.amount),
  ]);

  // Generate Table
  autoTable(doc, {
    startY: currentY + 10,
    head: [["Date", "Description", "Category", "Type", "Amount"]],
    body: tableData,
    headStyles: {
      fillColor: [103, 58, 183],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 20 },
    didDrawPage: () => {
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Finflow - Personal AI Finance Tracker",
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    },
  });

  // Save the PDF
  doc.save(`finflow_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
