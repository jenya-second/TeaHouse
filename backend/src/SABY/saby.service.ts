import { HttpService } from '@nestjs/axios';
import {
    AxiosRequestConfig,
    AxiosHeaders,
    AxiosError,
    AxiosResponse,
    ResponseType,
} from 'axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import {
    frontend_main_page,
    saby_auth_url,
    saby_cancel_order,
    saby_correct_address,
    saby_create_order,
    saby_get_order_state,
    saby_get_order_url,
    saby_get_payment_link,
    saby_nomenclature_balances_url,
    saby_nomenclature_list_url,
    saby_orders_url,
    saby_price_lists_url,
    saby_sales_points_url,
    saby_warehouses_url,
} from 'src/constants';
import {
    SABYAuthHeaders,
    SABYBalance,
    SABYProduct,
    SABYSalesPoint,
    SABYWarehouse,
    SABYPriceList,
    SABYOrder,
    SABYDelivery,
    SABYOrderInProgress,
    SABYOrderState,
} from '@tea-house/types';

@Injectable()
export class SABYService {
    constructor(private readonly httpService: HttpService) {}

    private async GetAuthHeaders(): Promise<SABYAuthHeaders> {
        const res = await firstValueFrom(
            this.httpService.post(saby_auth_url, {
                app_client_id: process.env.APP_CLIENT_ID,
                app_secret: process.env.APP_SECRET,
                secret_key: process.env.SECRET_KEY,
            }),
        );
        return {
            SBISAccessToken: res.data.access_token,
            SBISSessionId: res.data.sid,
        };
    }

    async MakeAuth(): Promise<void> {
        const headers: SABYAuthHeaders = await this.GetAuthHeaders();
        process.env.SBISAccessToken = headers.SBISAccessToken;
        process.env.SBISSessionId = headers.SBISSessionId;
    }

    GetSalesPoints(): Promise<SABYSalesPoint[]> {
        return this.SABYAuthGet(saby_sales_points_url).then(
            (res) => res.data.salesPoints,
        );
    }

    GetPriceLists(): Promise<SABYPriceList[]> {
        const params = {
            pointId: process.env.COMPANY_ID,
            actualDate: new Date().toISOString().split('T')[0],
        };
        return this.SABYAuthGet(saby_price_lists_url, params).then(
            (res) => res.data.priceLists,
        );
    }

    async GetProductsFromPriceList(
        priceListId: string,
    ): Promise<SABYProduct[]> {
        const params = {
            pointId: process.env.COMPANY_ID,
            priceListId: priceListId,
            withBalance: true,
            page: 0,
        };
        const products: SABYProduct[] = [];
        let res;
        do {
            res = await this.SABYAuthGet(saby_nomenclature_list_url, params);
            products.push(...res.data.nomenclatures);
            params.page += 1;
        } while (res.data.outcome.hasMore);
        return products;
    }

    GetWarehouses(): Promise<SABYWarehouse[]> {
        const params = {
            companyId: process.env.COMPANY_ID,
        };
        return this.SABYAuthGet(saby_warehouses_url, params).then(
            (res) => res.data.warehouses,
        );
    }

    GetBalancesFromPriceLists(
        priceLists: SABYPriceList[],
    ): Promise<SABYBalance[]> {
        const params = {
            companies: process.env.COMPANY_ID,
            priceListIds:
                '[' +
                priceLists.map((a: SABYPriceList, ind: number, arr) => a.id) +
                ']',
            warehouses: 246,
        };
        return this.SABYAuthGet(saby_nomenclature_balances_url, params).then(
            (res) => res.data.balances,
        );
    }

    GetBalancesFromNomenclatures(
        nomenclatures: number[],
    ): Promise<SABYBalance[]> {
        const params = {
            companies: process.env.COMPANY_ID,
            nomenclatures: '[' + nomenclatures + ']',
            warehouses: 246,
        };
        return this.SABYAuthGet(saby_nomenclature_balances_url, params).then(
            (res) => res.data.balances,
        );
    }

    async GetOrders(
        fromDateTime: string,
        toDateTime: string,
    ): Promise<SABYOrder[]> {
        const params = {
            fromDateTime: fromDateTime,
            toDateTime: toDateTime,
            page: 0,
        };
        const orders: SABYOrder[] = [];
        let res;
        do {
            res = await this.SABYAuthGet(saby_orders_url, params);
            if (res.data.orders && Object.keys(res.data.orders).length != 0) {
                orders.push(...res.data.orders);
            }
            params.page += 1;
        } while (res.data.outcome.hasMore);
        return orders;
    }

    async GetOrderInfo(externalId: string): Promise<SABYOrderInProgress> {
        const res = await this.SABYAuthGet(saby_get_order_url + externalId);
        return res.data;
    }

    async CancelOrder(externalId: string) {
        const res = await this.SABYAuthPut(
            saby_cancel_order.replace('externalId', externalId),
        );
        return res.data;
    }

    async GetOrderState(externalId: string): Promise<SABYOrderState> {
        const res = await this.SABYAuthGet(
            saby_get_order_state.replace('externalId', externalId),
        );
        return res.data;
    }

    async GetPaymentLink(externalId: string): Promise<string> {
        const data = {
            externalId: externalId,
            shopURL: frontend_main_page,
            successURL: frontend_main_page,
            errorURL: frontend_main_page,
        };
        const config = this.createConfig({}, 'json', JSON.stringify(data));
        return (
            await firstValueFrom(
                this.httpService.get(
                    saby_get_payment_link.replace('externalId', externalId),
                    config,
                ),
            )
        ).data.link;
    }

    async CreateOrder(
        sabyDelivery: SABYDelivery,
    ): Promise<SABYOrderInProgress> {
        const data = JSON.stringify(sabyDelivery);
        const res = await this.SABYAuthPost(saby_create_order, data);
        return res.data;
    }

    async CorrectAddress(addressFull: string) {
        const params = {
            enteredAddress: addressFull,
        };
        return this.SABYAuthGet(saby_correct_address, params).then(
            (res) => res.data.addresses,
        );
    }

    SABYAuthGet(
        link: string,
        params: object = {},
        responseType: ResponseType = 'json',
    ): Promise<AxiosResponse> {
        const config = this.createConfig(params, responseType);
        return firstValueFrom(this.httpService.get(link, config));
    }

    SABYAuthPut(
        link: string,
        data: string = '',
        params: object = {},
        responseType: ResponseType = 'json',
    ): Promise<AxiosResponse> {
        const config = this.createConfig(params, responseType);
        return firstValueFrom(this.httpService.put(link, data, config));
    }

    SABYAuthPost(
        link: string,
        data: string = '',
        params: object = {},
        responseType: ResponseType = 'json',
    ): Promise<AxiosResponse> {
        const config = this.createConfig(params, responseType);
        return firstValueFrom(this.httpService.post(link, data, config));
    }

    createConfig(
        params: object = {},
        responseType: ResponseType = 'json',
        data: string = '',
    ): AxiosRequestConfig {
        return {
            responseType: responseType,
            headers: {
                'X-SBISAccessToken': process.env.SBISAccessToken,
            },
            params: params,
            data: data,
        };
    }
}
