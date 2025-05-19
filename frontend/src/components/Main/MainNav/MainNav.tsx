import { combineStyles } from '#utils/styles.js';
import { ButtonNav } from '../ButtonNav/ButtonNav';
import styles from './MainNav.module.scss';

export function MainNav() {
    return (
        <>
            <div
                className={combineStyles(
                    styles.circle,
                    styles.circleShift,
                    styles.outShadow,
                )}
            />
            <img
                className={combineStyles(styles.logo, styles.circleShift)}
                src="/Logo.png"
            />
            <div className={combineStyles(styles.navBar, styles.inShadow)}>
                <ButtonNav
                    to={'/main/o/all'}
                    signature="Каталог"
                    icon="/catalogLogo.svg"
                />
                <ButtonNav
                    to={'/main/basket'}
                    signature="Заказ"
                    icon="/order.svg"
                />
                <ButtonNav
                    to={'/profile'}
                    signature="Профиль"
                    icon="/user.svg"
                />
            </div>
        </>
    );
}
