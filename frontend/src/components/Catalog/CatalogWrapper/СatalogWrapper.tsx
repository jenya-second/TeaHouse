import { BackButton } from '#components/Common/BackButton/BackButton.js';
import { CircleButton } from '#components/Common/CircleButton/CircleButton.js';
import { CatalogMain } from '../CatalogMain/CatalogMain';
import { ProductModal } from '../ProductModal/ProductModal';
import styles from './CatalogWrapper.module.scss';

export function CatalogWrapper() {
    return (
        <>
            <BackButton />
            <CircleButton />
            <div className={styles.backGroundImage} />
            <div className={styles.mainWrapper}>
                <CatalogMain />
            </div>
            <ProductModal />
        </>
    );
}
