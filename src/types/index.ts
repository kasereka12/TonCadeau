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
}

export interface Supplier {
    id: number
    name: string
    email: string
}

export interface CartItem extends Product {
    quantity: number
}

export interface DeliveryInfo {
    recipientName: string
    recipientEmail: string
    deliveryAddress: string
    deliveryDate: string
    deliveryTime: string
}
