import { CircularProgress } from '@mui/material';
import styles from './ConfirmButton.module.scss';

export function ConfirmButton({
    onClick,
    sending,
}: {
    onClick: () => void;
    sending: boolean;
}) {
    return (
        <div className={styles.wrapper}>
            <div onClick={onClick} className={styles.button}>
                {sending ? <CircularProgress /> : 'СФОРМИРОВАТЬ'}
            </div>
        </div>
    );
}
