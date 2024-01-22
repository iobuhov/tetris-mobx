export function getRandomColor() {
    const list = [
        "cyan",
        "blue",
        "orange",
        "yellow",
        "green",
        "pink",
        "red"
    ];
    return list[Math.floor(Math.random() * list.length)];
}
