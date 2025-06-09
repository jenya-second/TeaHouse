import { Outlet, useNavigate, useParams } from 'react-router';
import styles from './Navigation.module.scss';
import { ButtonNav } from '../../Main/ButtonNav/ButtonNav';
import { BackButton } from '../BackButton/BackButton';
import { CircleButton } from '../CircleButton/CircleButton';
import { ProductModal } from '#components/Catalog/ProductModal/ProductModal.js';
import {
    backButton,
    closeMiniApp,
    useSignal,
    viewport,
} from '@telegram-apps/sdk-react';
import { useEffect } from 'react';
import { combineStyles } from '#utils/styles.js';
import { Badge } from '@mui/material';
import { useAppSelector } from '#redux/index.js';

export function Navigation() {
    const navigation = useNavigate();
    const { order } = useParams();
    const countItemsInBasket = useAppSelector((state) => {
        return state.basket.value.length;
    });
    const isFullscreen = useSignal(viewport.isFullscreen);

    useEffect(() => {
        if (backButton.onClick.isAvailable()) {
            backButton.offClick(closeMiniApp);
            const off = backButton.onClick(() => navigation(-1));
            return off;
        }
    }, []);

    return (
        <>
            {!isFullscreen && <BackButton />}
            <CircleButton />
            <div className={styles.backGroundImage} />
            <div
                className={combineStyles(
                    styles.mainWrapper,
                    order ? '' : styles.small,
                )}
            >
                <Outlet />
            </div>
            <div className={styles.footer}>
                <ButtonNav
                    to={'/o/all'}
                    routes={['/o', '/t']}
                    icon="/catalogLogo.svg"
                />
                <Badge
                    max={9}
                    badgeContent={countItemsInBasket}
                    color="success"
                >
                    <ButtonNav
                        to={'/basket'}
                        routes={['/basket', '/processing']}
                        icon="/order.svg"
                    />
                </Badge>
                <ButtonNav to={'/user'} icon="/user.svg" />
            </div>
            <ProductModal />
        </>
    );
}
