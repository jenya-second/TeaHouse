import { Link } from 'react-router';
import styles from './CircleBuddon.module.scss';

export function CircleButton() {
    return <Link className={styles.circle} to={'/'} />;
}
