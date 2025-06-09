import { CategoryEntity } from '@tea-house/types';
import styles from './Category.module.scss';
import { useNavigate } from 'react-router';
import { combineStyles } from '#utils/styles.js';

export function Category({ category }: { category: CategoryEntity }) {
    const navigate = useNavigate();

    return (
        <>
            <div
                onClick={() => {
                    navigate(`/o/${category.id}`);
                }}
                className={combineStyles(
                    styles.category,
                    styles.inShadow,
                    styles.papyrusFont,
                )}
                key={category?.id}
            >
                <span>{category.name}</span>
            </div>
        </>
    );
}
