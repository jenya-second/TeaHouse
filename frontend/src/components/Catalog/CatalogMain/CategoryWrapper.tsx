import { CategoryEntity } from '@tea-house/types';
import { memo } from 'react';
import { Category } from '../Category/Category';
import styles from './CategoryWrapper.module.scss';
import { SubCategory } from '../Subcategory/Subcategory';

export const CategoryWrapper = memo(function CategoryWrapper({
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
                allCat.map((category) => (
                    <Category key={category.id} category={category} />
                ))
            ) : (
                <SubCategory category={curCategory} />
            )}
        </div>
    );
});

export function TopMenu({
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
