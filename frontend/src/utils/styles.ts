export function combineStyles(...styles: string[]): string {
    let style: string = '';
    styles.forEach((val) => {
        style += val + ' ';
    });
    return style;
}
