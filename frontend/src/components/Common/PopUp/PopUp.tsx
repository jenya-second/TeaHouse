import { JSX, useRef, useState } from 'react';
import styles from './PopUp.module.scss';
import { combineStyles } from '#utils/styles.js';
import { createPortal } from 'react-dom';

function PopUp({ message, active }: { message: string; active: boolean }) {
    return (
        <div
            id="PopUp"
            className={combineStyles(styles.popUp, active ? styles.active : '')}
        >
            {message}
        </div>
    );
}

export function usePopUp(): [JSX.Element, (message: string) => void] {
    const [message, setMessage] = useState('nothing to say');
    const [active, setActive] = useState(false);
    const [visible, setVisible] = useState(false);
    const timeoutActive = useRef<NodeJS.Timeout>(undefined);
    const timeoutVisible = useRef<NodeJS.Timeout>(undefined);
    const root = document.getElementById('root');
    const popUpElement = (
        <>
            {root &&
                visible &&
                createPortal(<PopUp active={active} message={message} />, root)}
        </>
    );

    const useShowPopUp = (message: string) => {
        setMessage(message);
        setVisible(true);
        setActive(true);
        clearTimeout(timeoutActive.current);
        clearTimeout(timeoutVisible.current);
        timeoutActive.current = setTimeout(() => setActive(false), 3000);
        timeoutVisible.current = setTimeout(() => setVisible(false), 4000);
    };

    return [popUpElement, useShowPopUp];
}
