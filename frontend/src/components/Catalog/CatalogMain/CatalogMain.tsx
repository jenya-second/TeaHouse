import { ToggleButton } from '#components/Catalog/ToggleButton/ToggleButton.js';
import { GetProductsRequest } from '#utils/requests.js';
import { CategoryEntity } from '@tea-house/types';
import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { Category } from '../Category/Category';
import styles from './CatalogMain.module.scss';
import { useParams } from 'react-router';
import { combineStyles } from '#utils/styles.js';
import { SubCategory } from '../Subcategory/Subcategory';

export function CatalogMain() {
    const [categories, setCategories] = useState<CategoryEntity[] | null>(null);
    const [ids, setIds] = useState<number[]>([]);
    useEffect(() => {
        GetProductsRequest().then(setCategories);
    }, []);

    const [teaCat, allCat] = useMemo((): [
        CategoryEntity[],
        CategoryEntity[],
    ] => {
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
            <div className={combineStyles(styles.toggleButtonWrapper)}>
                <ToggleButton state={order == 't'} />
            </div>
            {categoryId != 'all' && (
                <TopMenu category={curCategory} id={ids[0]} />
            )}
            <SubCategories
                allCat={allCat}
                categoryId={categoryId}
                curCategory={curCategory}
            />
        </>
    );
}

const SubCategories = memo(function SubCategories({
    categoryId,
    allCat,
    curCategory,
}: {
    categoryId: string | undefined;
    allCat: CategoryEntity[];
    curCategory: CategoryEntity | undefined;
}) {
    return (
        <div id={'scroll'} className={styles.scrollWraper}>
            {categoryId == 'all' ? (
                allCat.map((category, ind) => (
                    <Category key={ind} category={category} />
                ))
            ) : (
                <SubCategory category={curCategory} />
            )}
        </div>
    );
});

function TopMenu({
    category,
    id,
}: {
    category: CategoryEntity | undefined;
    id: number;
}) {
    return (
        <div className={styles.topMenu}>
            {category?.subcategories.map((val, ind) => (
                <div
                    onClick={() => {
                        document.getElementById('' + ind)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    }}
                    id={'menu' + ind}
                    key={ind}
                    className={id == ind ? styles.current : ''}
                >
                    {val.name}
                </div>
            ))}
        </div>
    );
}
