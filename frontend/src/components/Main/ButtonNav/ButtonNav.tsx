import { Link } from 'react-router';
import styles from './ButtonNav.module.scss';
import { combineStyles } from '#utils/styles.js';

interface buttonNavProps {
    to?: string;
    icon?: string;
    signature?: string;
}

export function ButtonNav({
    to = './',
    icon = '',
    signature = '',
}: buttonNavProps) {
    return (
        <div className={styles.wraper}>
            <Link
                to={to}
                className={combineStyles(styles.button, styles.outShadow)}
            >
                <img className={styles.navImg} src={icon} />
            </Link>
            {signature != '' && (
                <div className={styles.spanText}>{signature}</div>
            )}
        </div>
    );
}
