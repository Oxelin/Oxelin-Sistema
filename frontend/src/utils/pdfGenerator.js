// 📁 src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateRemitoPDF = (remito) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Remito OXELIN', 14, 22);

  const headers = [['Producto', 'Cantidad', 'Precio']];
  const data = remito.items.map(item => [item.name, item.quantity, `$${item.price}`]);

  doc.autoTable({ startY: 30, head: headers, body: data });
  doc.text(`Total: $${remito.total}`, 14, doc.lastAutoTable.finalY + 10);
  doc.save(`remito_${Date.now()}.pdf`);
};