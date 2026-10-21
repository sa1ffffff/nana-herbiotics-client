export const WHATSAPP_NUMBER = '923307072774'
export const PHONE_DISPLAY = '0330-7072774'
export const PHONE_TEL = '+923307072774'
export const EMAIL = 'hussainmahad786@gmail.com'
export const INSTAGRAM_URL = '#' // TODO: real Instagram profile
export const FACEBOOK_URL = '#' // TODO: real Facebook page

export const DELIVERY_FEE = 250
export const FREE_DELIVERY_OVER = 3000

const pkr = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })
export const formatPKR = (n: number) => `Rs ${pkr.format(n)}`

export const deliveryFor = (subtotal: number) =>
  subtotal === 0 || subtotal > FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const PK_PHONE = /^03\d{2}-?\d{7}$/

export const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar',
  'Quetta', 'Hyderabad', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sukkur',
  'Abbottabad', 'Mardan', 'Sahiwal', 'Okara', 'Rahim Yar Khan', 'Gujrat', 'Jhelum',
  'Sheikhupura', 'Kasur', 'Larkana', 'Mirpur (AJK)', 'Muzaffarabad', 'Dera Ghazi Khan',
]

export function orderRef(date = new Date()) {
  const y = String(date.getFullYear()).slice(2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `NH-${y}${m}${d}-${rand}`
}
