import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { CatalogItemSmall } from '#components/Catalog/CatalogItemSmall/CatalogItemSmall.js';
import { TopMenu } from '#components/Catalog/CatalogMain/CategoryWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { InfoButton } from '#components/User/InfoButton/InfoButton.js';
import { fetchCatalogs } from '#redux/catalog.js';
import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { fetchTeaDiary } from '#redux/tea.js';
import { CategoryEntity, ProductEntity } from '@tea-house/types';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export type joke = CategoryEntity & {
    mySubcat: jokeSubcategory[];
};

export type jokeSubcategory = CategoryEntity & {
    myProducts: (ProductEntity & { rank?: number })[];
};

export function TeaPal() {
    const word1 = 'Кто видит мои описания и оценки?';
    const word2 =
        'Все описания и оценки доступны исключительно Вам.\n\nФункционал чайного дневника создан с целью помочь любителям чая самостоятельно определить, как на них влияет тот или иной чай и найти то, чего они так давно искали или даже не планировали найти';
    const allCategories = useAppSelector(
        (state) => state.catalog.value.allCategories,
    );
    const teaDiary = useAppSelector((state) => state.tea.value);
    const dispatch = useAppDispatch();
    const observer = useRef<IntersectionObserver>(null);
    const [ids, setIds] = useState<number[]>([]);
    const init = useSignal(initData.raw);
    const navigate = useNavigate();

    useEffect(() => {
        if (!init) return;
        dispatch(fetchCatalogs());
        dispatch(fetchTeaDiary());
    }, [init]);

    const cat = useMemo(() => {
        const topCategory = allCategories.find(
            (val) => val.name == 'Чай развесной*',
        );
        if (!topCategory) return;
        const newCat: joke = { ...topCategory };
        newCat.mySubcat = [];
        newCat.subcategories = [];
        topCategory.subcategories.forEach((sub) => {
            const subcat: jokeSubcategory = { ...sub, myProducts: [] };
            const products: (ProductEntity & { rank: number })[] = [];
            sub.products.forEach((val) => {
                const te = teaDiary.find((z) => z.productId == val.id);
                if (!te) return;
                products.push({ ...val, rank: te.rank });
            });
            subcat.products = products;
            subcat.myProducts = products;
            if (subcat.products.length == 0) return;
            newCat.subcategories.push(subcat);
            newCat.mySubcat?.push(subcat);
        });
        return newCat;
    }, [teaDiary, allCategories]);

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
    }, [teaDiary, allCategories]);

    return (
        <>
            <PageName name="Чайный дневник" />
            <InfoButton m1={word1} m2={word2} />
            <TopMenu category={cat} id={ids[0]} />
            <ScrollWrapper aaah={true} topHeight={36}>
                {cat?.mySubcat?.map((val, ind) => (
                    <div id={ind.toString()} key={ind}>
                        <span
                            style={{
                                margin: '5vw',
                                fontFamily: 'Papyrus',
                                fontSize: 'large',
                            }}
                        >
                            {val.name}
                        </span>
                        {val.myProducts?.map((product) => (
                            <div
                                key={product.nomNumber}
                                onClick={() =>
                                    navigate(`/user/tea/${product.id}`)
                                }
                            >
                                <CatalogItemSmall
                                    product={product}
                                    showCounter={false}
                                    rank={product.rank}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </ScrollWrapper>
        </>
    );
}
