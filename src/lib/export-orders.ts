import * as XLSX from 'xlsx'
import type { Order } from '../store/orders'

export function exportOrdersToExcel(orders: Order[]) {
  const rows = orders.map((o) => ({
    'Order ID': o.orderId,
    'Customer Name': o.customerName,
    'Customer Email': o.customerEmail,
    'Customer Phone': o.customerPhone,
    'Products': o.products.map((p) => `${p.name} (${p.size}) × ${p.qty}`).join(', '),
    'Subtotal (Rs)': o.subtotal,
    'Delivery (Rs)': o.delivery,
    'Total (Rs)': o.total,
    'City': o.city,
    'Address': o.address,
    'Notes': o.notes,
    'Date & Time': o.dateTime,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Orders')

  // Auto-fit column widths
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((r) => String(r[key as keyof typeof r] ?? '').length),
    ) + 2,
  }))
  ws['!cols'] = colWidths

  XLSX.writeFile(wb, `nana-herbiotics-orders-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
