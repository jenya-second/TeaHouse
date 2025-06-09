import { ImageDisplay } from '#components/Main/ImageDisplay/ImageDisplay.js';
import { Footer } from '#components/Main/Footer/Footer.js';
import { MainNav } from '#components/Main/MainNav/MainNav.js';
import { EndPhrases, Phrases } from '#constants/mainPagePahrases.js';
import { backButton, closeMiniApp } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

export function WelcomePage() {
    const heights: string[] = [
        '49',
        '49.5',
        '36',
        '32.5',
        '46.5',
        '39.5',
        '40',
        '39.5',
        '39.5',
        '44.5',
    ];

    useEffect(() => {
        if (backButton.onClick.isAvailable()) {
            const off = backButton.onClick(closeMiniApp);
            return off;
        }
    }, []);

    return (
        <>
            <MainNav />
            <ImageDisplay
                src="/bigLogo.svg"
                style={{
                    height: '80vw',
                }}
            />
            <ImageDisplay
                src="/trail.svg"
                style={{
                    height: '600vw',
                    position: 'absolute',
                }}
                position="-28vw"
            />
            <div style={{ overflow: 'hidden' }}>
                {Phrases.map((phrase, i) => {
                    return (
                        <ImageDisplay
                            key={i}
                            left={i % 2 == 0}
                            src={'/' + (i + 1) + '.jpg'}
                            text={phrase}
                            backgroundColor={'rgba(7, 20, 77, 0.7)'}
                            shadow={true}
                            style={{
                                transform:
                                    'translate(' +
                                    (i % 2 ? '+' : '-') +
                                    '14vw, -7vw)',
                                height: heights[i] + 'vw',
                                marginTop: '15vw',
                                borderRadius: '10vw',
                            }}
                        />
                    );
                })}
            </div>
            <ImageDisplay
                src="/11.jpg"
                backgroundColor={'rgba(204, 203, 43, 0.7)'}
                text={EndPhrases.gold}
                shadow={true}
                style={{
                    position: 'absolute',
                    height: '35vw',
                    marginTop: '12vw',
                }}
            />
            <div
                style={{
                    height: '35vw',
                    marginTop: '12vw',
                }}
            />
            <Footer />
        </>
    );
}
