export interface SABYOrderState {
    state: number;
    payState: number;
    payments: {
        amount: number;
        errorMessage: string;
        id: number;
        isClossed: boolean;
        paymentType: string;
        sale: number;
    }[];
}

export default SABYOrderState;
