import { ToggleButton } from '#components/Common/ToggleButton/ToggleButton.js';
import { GetProductsRequest } from '#utils/requests.js';
import { CategoryEntity } from '@tea-house/types';
import { useState, useEffect, useMemo } from 'react';
import { Category } from '../Category';
import styles from './CatalogMain.module.scss';
import { useNavigate, useParams } from 'react-router';
import { combineStyles } from '#utils/styles.js';

export function CatalogMain() {
    const [categories, setCategories] = useState<CategoryEntity[] | null>(null);
    useEffect(() => {
        GetProductsRequest().then(setCategories);
    }, []);

    const [teaCat, allCat] = useMemo((): [
        CategoryEntity[],
        CategoryEntity[],
    ] => {
        const newCategories: CategoryEntity[] = [];
        const teaCat: CategoryEntity[] = [];
        const allCat: CategoryEntity[] = [];
        for (const category of categories ?? []) {
            if (!category.parentCategory) {
                newCategories.push(category);
                if (category.name == 'Чай') {
                    teaCat.push(category);
                } else {
                    allCat.push(category);
                }
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
        return [teaCat, allCat];
    }, [categories]);

    const { order } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <div
                className={combineStyles(
                    styles.toggleButtonWrapper,
                    // productId ? styles.dialog : '',
                )}
            >
                <ToggleButton
                    onToggle1={() => {
                        navigate('../t');
                    }}
                    onToggle2={() => {
                        navigate('../o');
                    }}
                    textLeft="В чайной"
                    textRight="Доставка"
                    state={order == 't'}
                />
            </div>
            {(order == 't' ? teaCat : allCat).map((category, ind) => {
                return <Category key={ind} category={category} />;
            })}
        </>
    );
}
