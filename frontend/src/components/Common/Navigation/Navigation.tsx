import { Outlet } from 'react-router';
import styles from './Navigation.module.scss';
import { ButtonNav } from '../../Main/ButtonNav/ButtonNav';
import { BackButton } from '../BackButton/BackButton';
import { CircleButton } from '../CircleButton/CircleButton';
import { ProductModal } from '#components/Catalog/ProductModal/ProductModal.js';

export function Navigation() {
    return (
        <>
            <BackButton />
            <CircleButton />
            <div className={styles.backGroundImage} />
            <div className={styles.mainWrapper}>
                <Outlet />
            </div>
            <div className={styles.footer}>
                <ButtonNav
                    to={'/main/o/all'}
                    routes={['/main/o', '/main/t']}
                    icon="/catalogLogo.svg"
                />
                <ButtonNav to={'/main/basket'} icon="/order.svg" />
                <ButtonNav to={'/user'} icon="/user.svg" />
            </div>
            <ProductModal />
        </>
    );
}
