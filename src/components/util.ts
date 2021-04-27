const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const randomString = (length: number) => {
    var text = "";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const createNonce = () => {
    return randomString(8);
}
