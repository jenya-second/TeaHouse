import { combineStyles } from '#utils/styles.js';
import styles from './SaveAddressButton.module.scss';

export function SaveAddressButton({
    inactive,
    onClick,
}: {
    inactive: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={inactive ? () => undefined : onClick}
            className={combineStyles(
                styles.main,
                inactive ? styles.inactive : '',
            )}
        >
            <span>{'СОХРАНИТЬ'}</span>
        </div>
    );
}
