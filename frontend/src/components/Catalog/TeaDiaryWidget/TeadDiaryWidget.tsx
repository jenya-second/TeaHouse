import { useEffect, useState } from 'react';
import styles from './TeaDiaryWidget.module.scss';
import { GetOneTeaDiary, PostTeaDiary } from '#utils/requests.js';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { combineStyles } from '#utils/styles.js';
import { FormInput } from '#components/Processing/FormInput/FormInput.js';
import { TeaDiaryRequest } from '@tea-house/types';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';
import { CircularProgress } from '@mui/material';
import { useAppDispatch } from '#redux/index.js';
import { setTeaDiary } from '#redux/tea.js';
import { useNavigate } from 'react-router';

export function TeaDiaryWidget({
    productId,
    editable,
}: {
    productId: number;
    editable: boolean;
}) {
    const [popUp, showPopUp] = usePopUp();
    const [rank, setRank] = useState(0);
    const [impression, setImression] = useState('');
    const [taste, setTaste] = useState('');
    const [smell, setSmell] = useState('');
    const [afterstate, setAfterstate] = useState('');
    const [edit, setEdit] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [sending, setSending] = useState(false);
    const init = useSignal(initData.raw);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!init) return;
        GetOneTeaDiary(productId).then((res) => {
            if (!res) return;
            setRank(res.rank);
            setImression(res.impression);
            setTaste(res.taste);
            setSmell(res.smell);
            setAfterstate(res.afterstate);
            setLoaded(true);
        });
    }, [init]);

    const send = async () => {
        const post: TeaDiaryRequest = {
            impression: impression,
            taste: taste,
            smell: smell,
            afterstate: afterstate,
            rank: rank,
            productId: productId,
        };
        setSending(true);
        const ans = await PostTeaDiary(post);
        if (ans == false) {
            showPopUp('Произошла ошибка. Повторите попытку позже.');
        } else {
            setEdit(false);
            dispatch(setTeaDiary(post));
        }
        setSending(false);
    };

    const noEditInfo = (
        <>
            {impression.length != 0 && (
                <div className={styles.text}>
                    <span>Общее впечатление:</span>
                    {impression}
                </div>
            )}
            {taste.length != 0 && (
                <div className={styles.text}>
                    <span>Вкус:</span>
                    {taste}
                </div>
            )}
            {smell.length != 0 && (
                <div className={styles.text}>
                    <span>Аромат:</span>
                    {smell}
                </div>
            )}
            {afterstate.length != 0 && (
                <div className={styles.text}>
                    <span>Состояние:</span>
                    {afterstate}
                </div>
            )}
        </>
    );

    const editInfo = (
        <>
            <span className={styles.text}>Общее впечатление:</span>
            <FormInput
                multirow={true}
                text="Введите ваш текст..."
                value={impression}
                onChange={(e) => setImression(e.target.value)}
            />
            <span className={styles.text}>Вкус:</span>
            <FormInput
                multirow={true}
                text="Введите ваш текст..."
                value={taste}
                onChange={(e) => setTaste(e.target.value)}
            />
            <span className={styles.text}>Аромат:</span>
            <FormInput
                multirow={true}
                text="Введите ваш текст..."
                value={smell}
                onChange={(e) => setSmell(e.target.value)}
            />
            <span className={styles.text}>Состояние:</span>
            <FormInput
                multirow={true}
                text="Введите ваш текст..."
                value={afterstate}
                onChange={(e) => setAfterstate(e.target.value)}
            />
        </>
    );

    return (
        <>
            {loaded && (
                <div className={styles.item}>
                    {popUp}
                    {(rank != 0 || editable) && (
                        <>
                            <div className={styles.title}>Ваше описание</div>
                            <div className={styles.devider}>
                                ___________________________________
                            </div>
                        </>
                    )}
                    {impression == '' &&
                        smell == '' &&
                        taste == '' &&
                        afterstate == '' &&
                        !edit && (
                            <div
                                onClick={() => {
                                    if (editable) {
                                        setEdit(true);
                                        if (rank == 0) setRank(1);
                                    }
                                }}
                                className={styles.teaDiaryIcon}
                            />
                        )}
                    {editable && (
                        <div
                            onClick={
                                edit
                                    ? send
                                    : () => {
                                          setEdit(true);
                                          if (rank == 0) setRank(1);
                                      }
                            }
                            className={combineStyles(
                                styles.edit,
                                edit ? styles.editOn : '',
                            )}
                        />
                    )}
                    {rank == 0 && !editable && (
                        <div
                            onClick={() => navigate('/user/tea')}
                            className={styles.goToDiary}
                        >
                            Чайный дневник
                        </div>
                    )}
                    {edit ? editInfo : noEditInfo}
                    <div className={styles.devider}>
                        ___________________________________
                    </div>
                    <div className={styles.allMark}>Общая оценка</div>
                    <div className={styles.rank}>
                        {new Array(rank).fill(0).map((_, i) => (
                            <div
                                onClick={() => {
                                    if (edit) setRank(i + 1);
                                }}
                                key={i}
                                className={styles.starFilled}
                            />
                        ))}
                        {new Array(5 - rank).fill(0).map((_, i) => (
                            <div
                                onClick={() => {
                                    if (edit) setRank(i + 1 + rank);
                                }}
                                key={i + rank}
                                className={styles.starHollow}
                            />
                        ))}
                    </div>
                    {edit && (
                        <div onClick={send} className={styles.saveButton}>
                            {sending ? (
                                <CircularProgress />
                            ) : (
                                <span>СОХРАНИТЬ</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
