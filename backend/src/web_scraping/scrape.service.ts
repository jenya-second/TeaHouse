import { Injectable } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import { Client } from 'src/database/entities/client.entity';

@Injectable()
export class ScrapeService {
    private browser: Browser;
    private delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    async init(): Promise<ScrapeService> {
        this.browser = await launch({ headless: true });
        await this.AuthOnSABY();
        return this;
    }

    async GetSABYPage(): Promise<string> {
        const page = await this.GetDiscounts();
        return page.content();
    }

    async AuthOnSABY(): Promise<void> {
        const page: Page = await this.browser.newPage();
        await page.goto('https://ret.sbis.ru/');
        await page.waitForSelector('.controls-InputBase__field');
        await this.delay(500);
        await page.type('.controls-InputBase__field', process.env.SABY_LOGIN, {
            delay: 100,
        });
        await page.click('.auth-AdaptiveLoginForm__loginButton');
        await this.delay(1000);
        await page.type(
            '.controls-Password__field_margin-null',
            process.env.SABY_PASS,
            {
                delay: 100,
            },
        );
        await page.click('.auth-AdaptiveLoginForm__loginButton');
        await page.waitForSelector('.NavigationPanels-Sidebar__header');
        await page.close();
    }

    async GetDiscounts(): Promise<Page> {
        const page: Page = await this.browser.newPage();
        await page.goto('https://ret.sbis.ru/page/promotion');
        return page;
    }

    async GetUsers(): Promise<Client[]> {
        const page: Page = await this.browser.newPage();
        await page.goto('https://ret.sbis.ru/page/crm-simple-clients');
        await this.delay(1000);
        await page.click('span[title="Все"]');
        const response = await page.waitForResponse((response) => {
            if (!response.request().hasPostData()) return false;
            const postData = JSON.parse(response.request().postData());
            return postData.method == 'CRMClients.ListClientsOnline';
        });
        const clients: Client[] = [];
        const res = await response.json();
        res.result.d.forEach((client) => {
            if (client[30] == true) return;
            const newClient = new Client();
            newClient.name = client[12];
            newClient.num = client[19];
            if (client[43].d.length != 0) newClient.phone = client[43].d[0][2];
            newClient.uuid = client[28];
            clients.push(newClient);
        });
        return clients;
    }
}
