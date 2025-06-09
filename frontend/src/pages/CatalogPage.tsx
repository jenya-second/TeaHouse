import {
    CategoryWrapper,
    TopMenu,
} from '#components/Catalog/CatalogMain/CategoryWrapper.js';
import { ToggleButton } from '#components/Catalog/ToggleButton/ToggleButton.js';
import { GetProductsRequest } from '#utils/requests.js';
import { CategoryEntity } from '@tea-house/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';

export function CatalogPage() {
    const [categories, setCategories] = useState<CategoryEntity[] | null>(null);
    const [ids, setIds] = useState<number[]>([]);
    useEffect(() => {
        GetProductsRequest().then(setCategories);
    }, []);

    const [teaCat, allCat] = useMemo((): [
        CategoryEntity[],
        CategoryEntity[],
    ] => {
        if (!categories) return [[], []];
        const newCategories: CategoryEntity[] = [];
        const teaCat: CategoryEntity[] = [];
        for (const category of categories ?? []) {
            if (!category.parentCategory) {
                newCategories.push(category);
                if (category.name == 'Чай') teaCat.push(category);
            }
        }
        for (const category of newCategories) {
            const subcategories: CategoryEntity[] = [];
            for (const sub of category.subcategories) {
                const subcat = categories?.find((c) => c.id == sub.id);
                if (subcat) {
                    subcategories.push(subcat);
                }
            }
            category.subcategories = subcategories;
        }
        teaCat[0].subcategories.forEach((val, i) => {
            teaCat[0].subcategories[i].products = val.products.filter((val) => {
                const countInGr = val.press
                    ? val.pressAmount / (val.pressAmount >= 200 ? 2 : 1)
                    : 25;
                const max = Math.floor(val.balance / countInGr);
                return max > 0;
            });
        });
        teaCat[0].subcategories = teaCat[0].subcategories.filter(
            (val) => val.products.length != 0,
        );
        return [teaCat, newCategories];
    }, [categories]);

    const { order, categoryId } = useParams();
    const curCategory: CategoryEntity | undefined =
        categoryId == 't'
            ? teaCat[0]
            : allCat.find((val) => val.id.toString() == categoryId);

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
                categoryId={categoryId}
                curCategory={curCategory}
            />
        </>
    );
}
