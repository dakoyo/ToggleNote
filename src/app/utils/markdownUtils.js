export function preprocessSpoilers(markdownText) {
    return markdownText.replace(/\|\|(.*?)\|\|/gs, (match, content) => {
        return `<span class="spoiler-text">${content}</span>`;
    });
}