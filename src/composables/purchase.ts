import type { Item } from './useManagement'
import type { Product } from '~/types'
import { defineStore } from 'pinia'

// Set to track generated purchase order numbers for uniqueness
const generatedPurchaseOrders: Set<string> = new Set()

export interface Purchase extends Item {
  supplier_id: Supplier['id']
  product_id: Product['id']
  date: Date
  quantity: number
  unit_price: number
  remarks: string
}

export interface Supplier extends Item {
  name: string
  contact: string
  phone: string
  address: string
}

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: '山东众克食品有限公司',
    contact: 'Contact 1',
    phone: '123-456-7890',
    address: 'Address 1',
  },
  {
    id: 2,
    name: '山东太合食品有限公司',
    contact: 'Contact 2',
    phone: '987-654-3210',
    address: 'Address 2',
  },
  {
    id: 3,
    name: '无锡华顺民生食品有限公司',
    contact: 'Contact 3',
    phone: '123-456-7893',
    address: 'Address 3',
  },
  {
    id: 4,
    name: '诸城市宏福泽食品有限公司',
    contact: 'Contact 4',
    phone: '123-456-7894',
    address: 'Address 4',
  },
  {
    id: 5,
    name: '福建天清食品有限公司',
    contact: 'Contact 5',
    phone: '123-456-7895',
    address: 'Address 5',
  },
  {
    id: 6,
    name: '山西大同食品有限公司',
    contact: 'Contact 6',
    phone: '123-456-7896',
    address: 'Address 6',
  },
  {
    id: 7,
    name: '江西南昌食品有限公司',
    contact: 'Contact 7',
    phone: '123-456-7897',
    address: 'Address 7',
  },
  {
    id: 8,
    name: '武汉源香食品有限公司',
    contact: 'Contact 8',
    phone: '123-456-7898',
    address: 'Address 8',
  },
  {
    id: 9,
    name: '诸城丰庆食品有限公司',
    contact: 'Contact 9',
    phone: '123-456-7899',
    address: 'Address 9',
  },
]

export const suppliersMap = suppliers.reduce<Record<Supplier['id'], Supplier>>((acc, supplier) => {
  acc[supplier.id] = supplier
  return acc
}, {})

export const DEFAULT_PURCHASE: Purchase[] = [
  {
    id: 98,
    supplier_id: 1,
    product_id: 37,
    date: new Date(2024, 3, 15),
    quantity: 10,
    unit_price: 10,
    remarks: '太贵了',
  },
  {
    id: 100,
    supplier_id: 3,
    product_id: 38,
    date: new Date(2025, 3, 15),
    quantity: 5,
    unit_price: 30,
    remarks: '非常好',
  },
  {
    id: 99,
    supplier_id: 2,
    product_id: 39,
    date: new Date(2025, 3, 15),
    quantity: 15,
    unit_price: 18,
    remarks: '到了一半',
  },
  {
    id: 989,
    supplier_id: 1,
    product_id: 33,
    date: new Date(2024, 3, 15),
    quantity: 10,
    unit_price: 10,
    remarks: '太贵了',
  },
  {
    id: 10000,
    supplier_id: 2,
    product_id: 34,
    date: new Date(2025, 3, 15),
    quantity: 5,
    unit_price: 30,
    remarks: '非常好',
  },
  {
    id: 999,
    supplier_id: 1,
    product_id: 35,
    date: new Date(2025, 3, 15),
    quantity: 15,
    unit_price: 18,
    remarks: '到了一半',
  },
  {
    id: 1,
    supplier_id: 5,
    product_id: 36,
    date: new Date('2024-08-15T10:30:00Z'),
    quantity: 50,
    unit_price: 19,
    remarks: '按时收到完整交货',
  },
  {
    id: 2,
    supplier_id: 3,
    product_id: 12,
    date: new Date('2024-11-22T14:45:00Z'),
    quantity: 20,
    unit_price: 15.75,
    remarks: '部分交货，剩余下周到',
  },
  {
    id: 3,
    supplier_id: 8,
    product_id: 25,
    date: new Date('2025-02-10T09:15:00Z'),
    quantity: 100,
    unit_price: 1.2,
    remarks: '待质量检查',
  },
  {
    id: 4,
    supplier_id: 2,
    product_id: 7,
    date: new Date('2024-06-30T12:00:00Z'),
    quantity: 30,
    unit_price: 4.0,
    remarks: '运输问题导致轻微延误',
  },
  {
    id: 5,
    supplier_id: 7,
    product_id: 19,
    date: new Date('2025-03-05T16:20:00Z'),
    quantity: 10,
    unit_price: 25.0,
    remarks: '要求紧急送货',
  },
  {
    id: 6,
    supplier_id: 4,
    product_id: 4,
    date: new Date('2024-07-20T08:50:00Z'),
    quantity: 80,
    unit_price: 3.0,
    remarks: '包装完好，验收通过',
  },
  {
    id: 7,
    supplier_id: 9,
    product_id: 15,
    date: new Date('2024-12-05T11:25:00Z'),
    quantity: 25,
    unit_price: 12.5,
    remarks: '部分产品需替换',
  },
  {
    id: 8,
    supplier_id: 1,
    product_id: 28,
    date: new Date('2025-01-15T13:40:00Z'),
    quantity: 60,
    unit_price: 2.8,
    remarks: '按时交付，待库存分配',
  },
  {
    id: 9,
    supplier_id: 6,
    product_id: 9,
    date: new Date('2024-09-10T15:10:00Z'),
    quantity: 15,
    unit_price: 20.0,
    remarks: '高端产品，需冷链运输',
  },
  {
    id: 10,
    supplier_id: 3,
    product_id: 33,
    date: new Date('2025-04-01T09:00:00Z'),
    quantity: 40,
    unit_price: 5.5,
    remarks: '交货提前，质量优良',
  },
  {
    id: 11,
    supplier_id: 2,
    product_id: 2,
    date: new Date('2024-05-12T09:30:00Z'),
    quantity: 70,
    unit_price: 2.0,
    remarks: '交货完整，库存已更新',
  },
  {
    id: 12,
    supplier_id: 7,
    product_id: 16,
    date: new Date('2024-10-18T14:20:00Z'),
    quantity: 30,
    unit_price: 10.0,
    remarks: '部分包装破损，待处理',
  },
  {
    id: 13,
    supplier_id: 5,
    product_id: 30,
    date: new Date('2025-03-20T11:00:00Z'),
    quantity: 90,
    unit_price: 1.5,
    remarks: '大宗货物，验收中',
  },
  {
    id: 14,
    supplier_id: 8,
    product_id: 5,
    date: new Date('2024-08-25T16:45:00Z'),
    quantity: 20,
    unit_price: 18.0,
    remarks: '需冷藏，运输正常',
  },
  {
    id: 15,
    supplier_id: 1,
    product_id: 21,
    date: new Date('2024-11-30T10:15:00Z'),
    quantity: 50,
    unit_price: 4.5,
    remarks: '交货延误一天',
  },
  {
    id: 16,
    supplier_id: 4,
    product_id: 35,
    date: new Date('2025-02-28T13:50:00Z'),
    quantity: 15,
    unit_price: 22.5,
    remarks: '高价值产品，优先处理',
  },
  {
    id: 17,
    supplier_id: 9,
    product_id: 10,
    date: new Date('2024-06-15T12:30:00Z'),
    quantity: 100,
    unit_price: 1.8,
    remarks: '批量采购，质量合格',
  },
  {
    id: 18,
    supplier_id: 6,
    product_id: 27,
    date: new Date('2024-12-12T15:00:00Z'),
    quantity: 35,
    unit_price: 6.5,
    remarks: '需额外检查保质期',
  },
  {
    id: 19,
    supplier_id: 3,
    product_id: 14,
    date: new Date('2025-01-10T08:40:00Z'),
    quantity: 25,
    unit_price: 13.0,
    remarks: '紧急补货，快速交付',
  },
  {
    id: 20,
    supplier_id: 7,
    product_id: 32,
    date: new Date('2024-09-05T17:10:00Z'),
    quantity: 60,
    unit_price: 3.2,
    remarks: '按时到达，待入库',
  },
].map(purchase => ({
  ...purchase,
  id: generatePurchaseOrderNo(purchase),
})) as any as Purchase[]

export const usePurchaseStore = defineStore('purchase', () => {
  const { productsMap } = useProductStore()
  const { items, addItem, updateItem, deleteItem } = useManagement<Purchase>({
    items: DEFAULT_PURCHASE,
    detailKey: 'id',
    value: item => productsMap[item.product_id].name,
  })

  return {
    purchases: items,
    addPurchase: addItem,
    updatePurchase: updateItem,
    deletePurchase: deleteItem,
  }
})

// Interface for function parameters
interface PurchaseOrderParams {
  supplier_id: number
  date: Date
  id?: number // Optional ID, defaults to a generated value
}

// Function to generate a purchase order number in the format PO-S{supplier_id}-{YYMM}-{id}
export function generatePurchaseOrderNo(params: PurchaseOrderParams, prefix: string = 'PO-S'): string {
  const { supplier_id, date, id } = params

  // Validate supplier_id (1 to 9)
  if (!Number.isInteger(supplier_id) || supplier_id < 1 || supplier_id > 9) {
    throw new Error('Supplier ID must be an integer between 1 and 9')
  }

  // Validate date (between 2024 and April 2025)
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2025-04-30')
  if (date < startDate || date > endDate) {
    throw new Error('Date must be between January 2024 and April 2025')
  }

  // Format supplier ID as two digits (e.g., 7 -> '07')
  const supplierIdStr = supplier_id.toString().padStart(2, '0')

  // Format date as YYMM (e.g., 2024-09 -> '2409')
  const year = date.getFullYear().toString().slice(-2) // Last two digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month (0-based, so +1)
  const dateStr = `${year}${month}`

  // Generate or use provided ID
  let orderId = id !== undefined ? id : generateUniqueId()
  let orderIdStr = orderId.toString().padStart(4, '0') // Four-digit ID

  // Construct purchase order number
  let purchaseOrderNo = `${prefix}${supplierIdStr}-${dateStr}-${orderIdStr}`

  // Ensure uniqueness by incrementing ID if necessary
  let attempt = 0
  const maxAttempts = 10000 // Prevent infinite loops
  while (generatedPurchaseOrders.has(purchaseOrderNo) && attempt < maxAttempts) {
    orderId++
    orderIdStr = orderId.toString().padStart(4, '0')
    purchaseOrderNo = `PO-S${supplierIdStr}-${dateStr}-${orderIdStr}`
    attempt++
  }

  if (attempt >= maxAttempts) {
    throw new Error('Unable to generate a unique purchase order number')
  }

  // Store the generated purchase order number
  generatedPurchaseOrders.add(purchaseOrderNo)

  return purchaseOrderNo
}

// Helper function to generate a unique ID (e.g., based on timestamp or sequence)
function generateUniqueId(): number {
  // Use timestamp-based seed for simplicity; in production, consider a persistent counter
  return Math.floor(Date.now() / 1000) % 10000 // Modulo to keep within 4 digits
}
