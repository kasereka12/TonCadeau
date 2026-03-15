import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, DeliveryInfo, GiftBundle, Product } from '../types';

interface CartState {
    items: CartItem[]
    giftBundles: GiftBundle[]
    giftMessage: string
    deliveryInfo: DeliveryInfo
}

interface CartContextType extends CartState {
    addToCart: (product: Product) => void
    removeFromCart: (productId: number | string) => void
    updateQuantity: (productId: number | string, quantity: number) => void
    clearCart: () => void
    setGiftMessage: (message: string) => void
    setDeliveryInfo: (info: DeliveryInfo) => void
    getTotalPrice: () => number
    getTotalItems: () => number
    addGiftBundle: (bundle: GiftBundle) => void
    removeGiftBundle: (id: string) => void
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: Product }
    | { type: 'REMOVE_FROM_CART'; payload: number | string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: number | string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'SET_GIFT_MESSAGE'; payload: string }
    | { type: 'SET_DELIVERY_INFO'; payload: DeliveryInfo }
    | { type: 'ADD_GIFT_BUNDLE'; payload: GiftBundle }
    | { type: 'REMOVE_GIFT_BUNDLE'; payload: string }

const CartContext = createContext<CartContextType | null>(null);

const initialState: CartState = {
    items: [],
    giftBundles: [],
    giftMessage: '',
    deliveryInfo: {
        recipientName: '',
        recipientEmail: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: ''
    }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter(item => item.id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items
                    .map(item => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item)
                    .filter(item => item.quantity > 0)
            };
        case 'CLEAR_CART':
            return { ...state, items: [], giftBundles: [] };
        case 'SET_GIFT_MESSAGE':
            return { ...state, giftMessage: action.payload };
        case 'SET_DELIVERY_INFO':
            return { ...state, deliveryInfo: action.payload };
        case 'ADD_GIFT_BUNDLE':
            return { ...state, giftBundles: [...state.giftBundles, action.payload] };
        case 'REMOVE_GIFT_BUNDLE':
            return { ...state, giftBundles: state.giftBundles.filter(b => b.id !== action.payload) };
        default:
            return state;
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart       = (product: Product) => dispatch({ type: 'ADD_TO_CART', payload: product });
    const removeFromCart  = (productId: number | string) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    const updateQuantity  = (productId: number | string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    const clearCart       = () => dispatch({ type: 'CLEAR_CART' });
    const setGiftMessage  = (message: string) => dispatch({ type: 'SET_GIFT_MESSAGE', payload: message });
    const setDeliveryInfo = (info: DeliveryInfo) => dispatch({ type: 'SET_DELIVERY_INFO', payload: info });
    const addGiftBundle   = (bundle: GiftBundle) => dispatch({ type: 'ADD_GIFT_BUNDLE', payload: bundle });
    const removeGiftBundle = (id: string) => dispatch({ type: 'REMOVE_GIFT_BUNDLE', payload: id });

    const getTotalPrice = () =>
        state.items.reduce((t, i) => t + i.price * i.quantity, 0) +
        state.giftBundles.reduce((t, b) => t + b.total, 0);

    const getTotalItems = () =>
        state.items.reduce((t, i) => t + i.quantity, 0) +
        state.giftBundles.reduce((t, b) => t + b.items.reduce((s, i) => s + i.quantity, 0), 0);

    return (
        <CartContext.Provider value={{
            ...state,
            addToCart, removeFromCart, updateQuantity, clearCart,
            setGiftMessage, setDeliveryInfo,
            getTotalPrice, getTotalItems,
            addGiftBundle, removeGiftBundle,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
