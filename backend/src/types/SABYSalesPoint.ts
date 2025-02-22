export interface SABYSalesPoint {
    address: string;
    id: number;
    image: string;
    latitude: string;
    longitude: string;
    locality: string;
    name: string;
    phone: string;
    phones: string[];
    start: string;
    stop: string;
    worktime: {
        start: string;
        stop: string;
        workdays: boolean[];
    };
}

export default SABYSalesPoint;