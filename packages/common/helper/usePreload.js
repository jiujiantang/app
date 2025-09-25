export function usePreloadImg(url = "") {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
    });
}
