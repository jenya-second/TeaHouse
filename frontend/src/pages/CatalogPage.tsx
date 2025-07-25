import {
    CategoryWrapper,
    TopMenu,
} from '#components/Catalog/CatalogMain/CategoryWrapper.js';
import { ToggleButton } from '#components/Catalog/ToggleButton/ToggleButton.js';
import { initBasket } from '#redux/basket.js';
import { fetchCatalogs } from '#redux/catalog.js';
import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { fetchTeaDiary } from '#redux/tea.js';
import { ProductEntity } from '@tea-house/types';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { joke } from './TeaPal';

export function CatalogPage() {
    const allCategories = useAppSelector(
        (state) => state.catalog.value.allCategories,
    );
    const deliveryCategories = useAppSelector(
        (state) => state.catalog.value.deliveryCategories,
    );
    const teaDiary = useAppSelector((state) => state.tea.value);
    const dispatch = useAppDispatch();
    const init = useSignal(initData.raw);
    const [ids, setIds] = useState<number[]>([]);

    useEffect(() => {
        dispatch(fetchCatalogs());
    }, []);

    useEffect(() => {
        if (!init) return;
        dispatch(fetchTeaDiary());
    }, [init]);

    const { order, categoryId } = useParams();

    const observer = useRef<IntersectionObserver>(null);

    //i can avoid it all only if i get ready data from backend but i wont
    const [myDelCat, myAllCat] = useMemo(() => {
        const out: joke[] = [];
        const out2: joke[] = [];
        for (let i = 0; i < deliveryCategories.length; i++) {
            const t = deliveryCategories[i];
            if (t.name != 'Чай развесной*') {
                out.push(t);
                continue;
            }
            const z = { ...t };
            z.mySubcat = [];
            t.mySubcat.forEach((element) => {
                const p: (ProductEntity & {
                    rank?: number;
                })[] = [];
                element.myProducts.forEach((val) => {
                    const q = teaDiary.find((z) => z.productId == val.id);
                    p.push({ ...val, rank: q?.rank });
                });
                z.mySubcat.push({ ...element, myProducts: p });
            });
            out.push(z);
        }
        for (let i = 0; i < allCategories.length; i++) {
            const t = allCategories[i];
            if (t.name != 'Чай развесной*') {
                out2.push(t);
                continue;
            }
            const z = { ...t };
            z.mySubcat = [];
            t.mySubcat.forEach((element) => {
                const p: (ProductEntity & {
                    rank?: number;
                })[] = [];
                element.myProducts.forEach((val) => {
                    const q = teaDiary.find((z) => z.productId == val.id);
                    p.push({ ...val, rank: q?.rank });
                });
                z.mySubcat.push({ ...element, myProducts: p });
            });
            out2.push(z);
        }
        return [out, out2];
    }, [teaDiary]);

    const curCategory: joke | undefined = (
        order == 'o' ? myAllCat : myDelCat
    ).find((val) => val.id.toString() == categoryId);

    useEffect(() => {
        dispatch(initBasket(deliveryCategories));
    }, [deliveryCategories]);

    useEffect(() => {
        const scroll = document.getElementById('scroll');
        if (!scroll) return;
        setIds([]);
        observer.current = new IntersectionObserver(
            (entries) => {
                setIds((prevIds) => {
                    const locIds = prevIds.concat();
                    entries.forEach((entry) => {
                        if (entry.intersectionRatio > 0) {
                            locIds.push(+entry.target.id);
                        } else {
                            const bebe = locIds.findIndex(
                                (val) => val == +entry.target.id,
                            );
                            if (bebe != -1) {
                                locIds.splice(bebe, 1);
                            }
                        }
                    });
                    document
                        .getElementById('menu' + locIds[0])
                        ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    return locIds;
                });
            },
            {
                root: scroll,
                threshold: 0,
            },
        );
        Array.from(scroll.children).forEach((child) =>
            observer.current?.observe(child),
        );
        return () => {
            observer.current?.disconnect();
        };
    }, [allCategories, categoryId]);

    return (
        <>
            <ToggleButton state={order == 't'} />
            {categoryId != 'all' && (
                <TopMenu category={curCategory} id={ids[0]} />
            )}
            <CategoryWrapper
                allCat={myAllCat}
                delivery={myDelCat}
                order={order}
                curCategory={curCategory}
            />
        </>
    );
}
