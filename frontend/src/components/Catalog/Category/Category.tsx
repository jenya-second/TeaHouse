import { CategoryEntity } from '@tea-house/types';
import styles from './Category.module.scss';
import { useNavigate, useParams } from 'react-router';
import { combineStyles } from '#utils/styles.js';

export function Category({ category }: { category: CategoryEntity }) {
    const navigate = useNavigate();
    const { order } = useParams();

    return (
        <>
            <div
                onClick={() => {
                    navigate(`/${order}/${category.id}`);
                }}
                className={combineStyles(
                    styles.category,
                    styles.inShadow,
                    styles.papyrusFont,
                )}
                key={category?.id}
            >
                <span>{category.name.replace('*', '')}</span>
            </div>
        </>
    );
}
