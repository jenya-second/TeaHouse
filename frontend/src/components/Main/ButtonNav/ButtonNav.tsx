import { Link, useLocation } from 'react-router';
import styles from './ButtonNav.module.scss';
import { combineStyles } from '#utils/styles.js';
import { memo } from 'react';

interface buttonNavProps {
    to?: string;
    icon?: string;
    signature?: string;
    routes?: string[];
}

export const ButtonNav = memo(function ButtonNav({
    to = './',
    icon = '',
    signature = '',
    routes = [],
}: buttonNavProps) {
    const location = useLocation();
    if (routes.length == 0) {
        routes.push(to);
    }
    return (
        <div>
            <Link
                to={to}
                className={combineStyles(
                    styles.button,
                    routes.find((val) => location.pathname.startsWith(val))
                        ? styles.active
                        : '',
                )}
            >
                <img className={styles.navImg} src={icon} />
            </Link>
            {signature != '' && (
                <div className={styles.spanText}>{signature}</div>
            )}
        </div>
    );
});
