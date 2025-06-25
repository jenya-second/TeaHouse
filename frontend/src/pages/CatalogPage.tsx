import {
    CategoryWrapper,
    TopMenu,
} from '#components/Catalog/CatalogMain/CategoryWrapper.js';
import { ToggleButton } from '#components/Catalog/ToggleButton/ToggleButton.js';
import { initBasket } from '#redux/basket.js';
import { useAppDispatch } from '#redux/index.js';
import { GetProductsRequest } from '#utils/requests.js';
import { CategoryEntity, ProductEntity } from '@tea-house/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';

export function CatalogPage() {
    const [categories, setCategories] = useState<CategoryEntity[] | null>(null);
    const [ids, setIds] = useState<number[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        GetProductsRequest().then(setCategories);
    }, []);

    const [deliveryCat, allCat] = useMemo((): [
        CategoryEntity[],
        CategoryEntity[],
    ] => {
        if (!categories) return [[], []];
        const newCategories: CategoryEntity[] = [];
        const deliveryCat: CategoryEntity[] = [];
        const d: CategoryEntity[] = [];
        for (const category of categories ?? []) {
            if (!category.parentCategory) {
                newCategories.push(category);
                if (category.name.includes('*')) deliveryCat.push(category);
            }
        }
        for (const category of newCategories) {
            const subcategories: CategoryEntity[] = [];
            for (const sub of category.subcategories) {
                const subcat = categories?.find((c) => c.id == sub.id);
                if (!subcat) continue;
                subcategories.push(subcat);
            }
            category.subcategories = subcategories;
        }
        for (let i = 0; i < deliveryCat.length; i++) {
            d.push({ ...deliveryCat[i] });
            const subcategories: CategoryEntity[] = [];
            deliveryCat[i].subcategories.forEach((val) => {
                const sub = { ...val };
                sub.products = val.products.filter((val) => {
                    const countInGr = val.press
                        ? val.pressAmount / (val.pressAmount >= 200 ? 2 : 1)
                        : 25;
                    const max = Math.floor(val.balance / countInGr);
                    return max > 0;
                });
                subcategories.push(sub);
            });
            d[i].subcategories = subcategories;
        }
        for (let i = 0; i < d.length; i++) {
            d[i].subcategories = d[i].subcategories.filter(
                (val) => val.products.length != 0,
            );
        }
        console.log(d);
        const b = localStorage.getItem('basket');
        if (!b) return [d, newCategories];
        const state: { product: ProductEntity; count: number }[] = [];
        const basket: { index: string; count: number }[] = JSON.parse(b);
        for (let i = 0; i < d.length; i++) {
            d[i].subcategories.forEach((cat) => {
                basket.forEach((val) => {
                    const product = cat.products.find(
                        (z) => z.nomNumber == val.index,
                    );
                    if (!product) return;
                    const countInGr = product.press
                        ? product.pressAmount /
                          (product.pressAmount >= 200 ? 2 : 1)
                        : 25;
                    const max = Math.floor(product.balance / countInGr);
                    state.push({
                        count: Math.min(max, val.count),
                        product: product,
                    });
                });
            });
        }
        setTimeout(() => dispatch(initBasket({ value: state })), 100);

        return [d, newCategories];
    }, [categories]);

    const { order, categoryId } = useParams();
    const curCategory: CategoryEntity | undefined = (
        order == 'o' ? allCat : deliveryCat
    ).find((val) => val.id.toString() == categoryId);

    const observer = useRef<IntersectionObserver>(null);

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
    }, [allCat, categoryId]);

    return (
        <>
            <ToggleButton state={order == 't'} />
            {categoryId != 'all' && (
                <TopMenu category={curCategory} id={ids[0]} />
            )}
            <CategoryWrapper
                allCat={allCat}
                delivery={deliveryCat}
                order={order}
                curCategory={curCategory}
            />
        </>
    );
}
