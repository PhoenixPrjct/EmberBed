function isRelevant(k: string): boolean {
    // console.log(k)
    let result
    switch (k) {
        case 'bump':
            result = false;
            console.log('bump', result)
            break;
        case 'isInitialized':
            result = false;
            break;
        default:
            result = true;
            break;
    }
    return result;
}
export { isRelevant };