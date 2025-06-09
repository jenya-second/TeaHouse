import { DeleteOrder } from '#utils/requests.js';
import { useNavigate } from 'react-router';
import styles from './DeleteButton.module.scss';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';

export function DeleteButton({ id }: { id: number }) {
    const navigate = useNavigate();
    const [popUp, showPopUp] = usePopUp();
    const onClick = async () => {
        const res = await DeleteOrder(id);
        if (res) {
            navigate('/user/history');
        } else {
            showPopUp('Не удалось удалить заказ. Повторите попытку позже');
        }
    };

    return (
        <>
            {popUp}
            <div className={styles.deleteButton} onClick={onClick} />
        </>
    );
}
