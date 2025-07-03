import { PropsWithChildren } from 'react';

export function ScrollWrapper({
    children,
    topHeight = 17,
    aaah = false,
}: PropsWithChildren & { topHeight?: number; aaah?: boolean }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: aaah ? 'normal' : 'space-between',
                overflow: 'scroll',
                maxHeight: `calc(100% - ${topHeight}vw)`,
                height: `calc(100% - ${topHeight}vw)`,
            }}
            id="scroll"
        >
            {children}
        </div>
    );
}
