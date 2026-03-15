export interface Product {
    id: number | string
    name: string
    category: string
    price: number
    description: string
    image: string
    stock: number
    supplier: string
    rating: number
    tags: string[]
    city?: string
}

export interface Supplier {
    id: number
    name: string
    email: string
}

export interface CartItem extends Product {
    quantity: number
}

export interface GiftBundle {
    id: string
    items: CartItem[]
    message: string
    recipientName: string
    personaKey: string
    personaLabel: string
    total: number
}

export interface ImportantDate {
    id: string
    user_id: string
    title: string
    date: string          // YYYY-MM-DD
    type: 'birthday' | 'anniversary' | 'fete' | 'other'
    reminder_days: number // notify X days before
    recurring: boolean    // repeat every year
    notes?: string
    created_at?: string
}

export interface AppNotification {
    id: string            // `${dateId}-${occurrenceYear}`
    dateId: string
    title: string
    type: ImportantDate['type']
    daysUntil: number
    occurrenceDate: string
}

export interface DeliveryInfo {
    recipientName: string
    recipientEmail: string
    deliveryAddress: string
    deliveryDate: string
    deliveryTime: string
}

export interface Order {
    id: string
    date: string
    items: CartItem[]
    giftBundles: GiftBundle[]
    deliveryInfo: DeliveryInfo
    giftMessage: string
    total: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    payment_method?: string
}
