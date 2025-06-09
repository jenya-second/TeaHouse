import { ChangeEvent } from 'react';
import styles from './FormInput.module.scss';
import { combineStyles } from '#utils/styles.js';

export function FormInput({
    text,
    multirow,
    value,
    onChange,
}: {
    text: string;
    multirow: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
    return (
        <div className={styles.inpWrapper}>
            <textarea
                onChange={onChange}
                className={combineStyles(
                    styles.inp,
                    multirow ? styles.multirow : '',
                )}
                placeholder={text}
                value={value}
            />
        </div>
    );
}
