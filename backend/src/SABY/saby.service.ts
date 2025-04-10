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
    saby_auth_url,
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
} from '@tea-house/types';

@Injectable()
export class SABYService {
    constructor(private readonly httpService: HttpService) {}

    private GetAuthHeaders(): Promise<SABYAuthHeaders> {
        return firstValueFrom(
            this.httpService.post(saby_auth_url, {
                app_client_id: process.env.APP_CLIENT_ID,
                app_secret: process.env.APP_SECRET,
                secret_key: process.env.SECRET_KEY,
            }),
        ).then((res) => {
            return {
                SBISAccessToken: res.data.access_token,
                SBISSessionId: res.data.sid,
            };
        });
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
            if (res.length != 0) {
                orders.push(...res.data.orders);
            }
            params.page += 1;
        } while (res.data.outcome.hasMore);
        return orders;
    }

    SABYAuthGet(
        link: string,
        params: object = {},
        responseType: ResponseType = 'json',
    ): Promise<AxiosResponse> {
        const config: AxiosRequestConfig = {
            responseType: responseType,
            headers: {
                'X-SBISAccessToken': process.env.SBISAccessToken,
            },
            params: params,
        };
        return firstValueFrom(this.httpService.get(link, config));
    }
}
