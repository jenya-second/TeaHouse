import styles from './PageName.module.scss';

export function PageName({ name }: { name: string }) {
    return <div className={styles.main}>{name}</div>;
}
