// 1 USD ≈ 10 MAD (taux indicatif)
const USD_RATE = 0.10;

export function formatPrice(amount: number): string {
    const dh  = amount.toFixed(2);
    //const usd = (amount * USD_RATE).toFixed(2);
    return `${dh} DH`;
}

export function formatPriceDual(amount: number): { dh: string; usd: string } {
    return {
        dh:  `${amount.toFixed(2)} DH`,
        usd: `$${(amount * USD_RATE).toFixed(2)}`,
    };
}
