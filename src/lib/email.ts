import emailjs from '@emailjs/browser'
import type { Order } from '../store/orders'

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || ''
const TEMPLATE_CUSTOMER = (import.meta.env.VITE_EMAILJS_TEMPLATE_CUSTOMER as string) || ''
const TEMPLATE_ADMIN = (import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN as string) || ''
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || ''

export const EMAIL_CONFIGURED = Boolean(SERVICE_ID && PUBLIC_KEY)

function productLines(order: Order): string {
  return order.products
    .map((p, i) => `${i + 1}) ${p.name} (${p.size}) × ${p.qty} = Rs ${(p.price * p.qty).toLocaleString()}`)
    .join('\n')
}

/** Format phone number to international 923... for WhatsApp links */
function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.startsWith('0')) return '92' + digits.slice(1)
  if (digits.startsWith('92')) return digits
  return '92' + digits
}

/** Send confirmation email to the customer */
export async function sendCustomerEmail(order: Order) {
  if (!EMAIL_CONFIGURED) {
    console.warn('[EmailJS] Not configured – skipping customer email. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_CUSTOMER, and VITE_EMAILJS_PUBLIC_KEY in .env.local')
    return
  }
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_CUSTOMER,
      {
        to_email: order.customerEmail,
        to_name: order.customerName,
        customer_name: order.customerName,
        order_id: order.orderId,
        products: productLines(order),
        subtotal: `Rs ${order.subtotal.toLocaleString()}`,
        delivery: order.delivery ? `Rs ${order.delivery.toLocaleString()}` : 'Free',
        total: `Rs ${order.total.toLocaleString()}`,
        city: order.city,
        address: order.address,
        date: order.dateTime,
      },
      PUBLIC_KEY,
    )
  } catch (err) {
    console.error('[EmailJS] Customer email failed:', err)
  }
}

/** Send notification email to nanaherbiotics@gmail.com with customer details and WhatsApp direct link */
export async function sendAdminEmail(order: Order) {
  if (!EMAIL_CONFIGURED) {
    console.warn('[EmailJS] Not configured – skipping admin email. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ADMIN, and VITE_EMAILJS_PUBLIC_KEY in .env.local')
    return
  }
  const waPhone = formatWhatsAppNumber(order.customerPhone)
  const waText = encodeURIComponent(`Assalam-o-Alaikum ${order.customerName}! Thank you for your order ${order.orderId} at Nana Herbiotics. We are preparing it for delivery.`)
  const directWaLink = `https://wa.me/${waPhone}?text=${waText}`

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ADMIN,
      {
        to_email: 'nanaherbiotics@gmail.com',
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        whatsapp_link: directWaLink,
        order_id: order.orderId,
        products: productLines(order),
        subtotal: `Rs ${order.subtotal.toLocaleString()}`,
        delivery: order.delivery ? `Rs ${order.delivery.toLocaleString()}` : 'Free',
        total: `Rs ${order.total.toLocaleString()}`,
        city: order.city,
        address: order.address,
        notes: order.notes || 'None',
        date: order.dateTime,
      },
      PUBLIC_KEY,
    )
  } catch (err) {
    console.error('[EmailJS] Admin email failed:', err)
  }
}
