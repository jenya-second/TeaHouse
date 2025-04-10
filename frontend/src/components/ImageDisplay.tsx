interface ImageDisplayProps {
    src: string;
    position?: string;
    style?: React.CSSProperties;
    text?: string;
    backgroundColor?: string;
    left?: boolean;
    shadow?: boolean;
}

export function ImageDisplay({
    src,
    position = ' ',
    style = {},
    text = '',
    backgroundColor = '',
    left = true,
    shadow = false,
}: ImageDisplayProps) {
    const myStyle = { ...style };
    myStyle.overflow = 'hidden';
    myStyle.textAlign = 'center';
    myStyle.display = 'flex';
    myStyle.alignItems = 'center';
    // myStyle.height = '100%';
    myStyle.width = '100%';
    return (
        <div style={myStyle}>
            {text != '' && (
                <div
                    style={{
                        position: 'absolute',
                        fontSize: '18px',
                        zIndex: '2',
                        width: 'auto',
                        height: 'auto',
                        marginRight: left ? '5vw' : '20vw',
                        marginLeft: left ? '20vw' : '5vw',
                    }}
                >
                    {text}
                </div>
            )}

            <img
                src={src}
                style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    objectPosition: position,
                }}
            />
            {backgroundColor != '' && (
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: backgroundColor,
                        height: '110%',
                        width: '100%',
                    }}
                />
            )}
            {shadow && (
                <div
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        boxShadow: 'inset 0px 4px 3px rgba(0, 0, 0, 0.25)',
                        borderRadius: myStyle.borderRadius,
                    }}
                />
            )}
        </div>
    );
}
