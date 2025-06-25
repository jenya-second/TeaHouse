import { DeleteOrder } from '#utils/requests.js';
import { useNavigate } from 'react-router';
import styles from './DeleteButton.module.scss';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function DeleteButton({ id }: { id: number }) {
    const navigate = useNavigate();
    const [popUp, showPopUp] = usePopUp();
    const [modal, setModal] = useState(false);
    const root = document.getElementById('root');
    const onClick = async () => {
        const res = await DeleteOrder(id);
        if (res) {
            navigate('/user/history', { replace: true });
        } else {
            showPopUp('Не удалось удалить заказ. Повторите попытку позже');
        }
    };

    return (
        <>
            {popUp}
            <div
                className={styles.deleteButton}
                onClick={() => setModal(!modal)}
            />
            {modal &&
                root &&
                createPortal(
                    <div
                        onClick={() => setModal(false)}
                        className={styles.back}
                    >
                        <div className={styles.modal}>
                            <span>{'Удалить заказ'}</span>
                            <span>
                                {'Подтвердите для отмены и удаления заказа'}
                            </span>
                            <div className={styles.bottomWrap}>
                                <span onClick={onClick}>{'УДАЛИТЬ'}</span>
                                <span onClick={() => setModal(false)}>
                                    {'ОТМЕНА'}
                                </span>
                            </div>
                        </div>
                    </div>,
                    root,
                )}
        </>
    );
}
