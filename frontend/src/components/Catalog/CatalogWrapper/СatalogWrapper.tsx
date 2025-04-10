import { BackButton } from '#components/Common/BackButton/BackButton.js';
import { CatalogMain } from '../CatalogMain/CatalogMain';
import styles from './CatalogWrapper.module.scss';

export function CatalogWrapper() {
    return (
        <>
            <BackButton />
            <div className={styles.backGroundImage} />
            <div className={styles.mainWrapper}>
                <CatalogMain />
            </div>
        </>
    );
}
