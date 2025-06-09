import styles from './Radio.module.scss';

export function Radio({
    onSet,
    labelText,
    state,
}: {
    onSet: () => void;
    labelText: string;
    state: boolean;
}) {
    return (
        <div className={styles.formRadio}>
            <input
                id={labelText}
                type="radio"
                checked={state}
                onChange={onSet}
            />
            <label htmlFor={labelText}>{labelText}</label>
        </div>
    );
}
