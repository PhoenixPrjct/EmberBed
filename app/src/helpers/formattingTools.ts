export function camelCaseToTitleCase(camelCase: string): string {
    // Split the string into words based on the capital letters
    const words = camelCase.split(/([A-Z][a-z]+)/g);

    // Capitalize the first letter of each word
    const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words with a single space
    return titleCaseWords.join(' ');
}
