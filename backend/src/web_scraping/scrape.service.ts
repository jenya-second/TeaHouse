import { Injectable } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import { Client, Promotion } from 'src/database/entities';

@Injectable()
export class ScrapeService {
    private browser: Browser;
    private delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    async init(): Promise<ScrapeService> {
        this.browser = await launch({
            headless: true,
            args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
        });
        await this.AuthOnSABY();
        return this;
    }

    async AuthOnSABY(): Promise<void> {
        const page: Page = await this.browser.newPage();
        await page.goto('https://ret.sbis.ru/');
        await page.waitForSelector('.controls-InputBase__field');
        await this.delay(500);
        await page.type('.controls-InputBase__field', process.env.SABY_LOGIN);
        await page.click('.auth-AdaptiveLoginForm__loginButton');
        await this.delay(1000);
        await page.type(
            '.controls-Password__field_margin-null',
            process.env.SABY_PASS,
        );
        await page.click('.auth-AdaptiveLoginForm__loginButton');
        await page.waitForSelector('.NavigationPanels-Sidebar__header');
        await page.close();
    }

    //trash))
    // async GetPromotions(): Promise<Promotion[]> {
    //     const page: Page = await this.browser.newPage();
    //     await page.goto('https://ret.sbis.ru');
    //     await this.delay(1000);
    //     await page.click('a[data-name="promotion"');
    //     await this.delay(1000);
    //     await Promise.all([
    //         page.waitForNavigation(),
    //         page.click('a[data-name="promotion"'),
    //     ]);
    //     const response = await page.waitForResponse((response) => {
    //         if (!response.request().hasPostData()) return false;
    //         const postData = JSON.parse(response.request().postData());
    //         return postData.method == 'Promotion.GetList';
    //     });
    //     const promotions: Promotion[] = [];
    //     const res = await response.json();
    //     const types: { n: string; t: string }[] = res.result.s;
    //     const name = types.findIndex((val) => val.n == 'Name');
    //     const description = types.findIndex(
    //         (val) => val.n == 'RegistryDescription',
    //     );
    //     res.result.d.forEach((promotion) => {
    //         if (promotion[description] == null) return;
    //         const newPromotion = new Promotion();
    //         newPromotion.name = promotion[name];
    //         newPromotion.discountPercentage = +(
    //             promotion[description] as string
    //         ).split(' ')[1];
    //         promotions.push(newPromotion);
    //     });
    //     page.close();
    //     return promotions;
    // }

    async GetUsers(): Promise<Client[]> {
        const page: Page = await this.browser.newPage();
        await page.goto('https://ret.sbis.ru/page/crm-simple-clients');
        await this.delay(1000);
        await page.click('span[title="В конец"]');
        let res;
        const clients: Client[] = [];
        do {
            const response = await page.waitForResponse((response) => {
                if (!response.request().hasPostData()) return false;
                const postData = JSON.parse(response.request().postData());
                return postData.method == 'CRMClients.ListClientsOnline';
            });
            res = await response.json();
            const types: { n: string; t: string }[] = res.result.s;
            const deleted = types.findIndex((val) => val.n == 'НеОтображается');
            const name = types.findIndex((val) => val.n == 'Name');
            const num = types.findIndex((val) => val.n == 'Entrepreneur');
            const uuid = types.findIndex((val) => val.n == 'UUID');
            const contact = types.findIndex((val) => val.n == 'ContactData');
            // const folders = types.findIndex((val) => val.n == 'Folders');
            res.result.d.forEach((client) => {
                if (client[deleted] == true) return;
                const newClient = new Client();
                newClient.name = client[name];
                newClient.num = client[num];
                if (client[contact].d.length != 0)
                    newClient.phone = client[contact].d[0][2];
                newClient.uuid = client[uuid];
                // const SABYprom = (client[folders].d as []).find(
                //     (val) => val[3] != 'Клиенты',
                // );
                // if (SABYprom) {
                //     const prom = new Promotion();
                //     prom.name = SABYprom[3];
                //     newClient.promotion = prom;
                // }
                clients.push(newClient);
            });
            await page.click('span[title="Назад"]');
        } while (res.result.n);
        page.close();
        return clients;
    }
}
