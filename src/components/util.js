export const setHashParameter = (key, val) => {
    let hash = document.location.hash;
    if (hash.startsWith('#')) {
        hash = hash.substr(1);
    }
    let tokens = hash.split('&');
    let found = false;
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const keyVal = token.split('=');
        if (keyVal[0] == key) {
            tokens[i] = `${key}=${val}`;
            found = true;
            break;
        }
    }
    if (!found) {
        tokens.push(`${key}=${val}`);
    }
    tokens = tokens.filter(token => token.length > 1);
    location.hash = `#${tokens.join('&')}`;
}

export const setMetapageDefinitionInHashParam = (definition) => {
    const metapageString = JSON.stringify(definition);
    setHashParameter('definition', btoa(metapageString));
}
