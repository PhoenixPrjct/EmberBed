import { copyToClipboard, QNotifyCreateOptions } from 'quasar';
// const $q = useQuasar();

async function CopyClick(value: string) {
    let notiInfo: QNotifyCreateOptions
    try {
        await copyToClipboard(value)
        notiInfo = {
            color: 'green-10',
            textColor: 'white',
            icon: 'grade',
            iconColor: 'white',
            group: 'saved group',
            message: `Successfully copied to clipboard`,
            position: 'top'
        }
        return notiInfo

    } catch (err) {
        notiInfo = {
            color: 'red-10',
            textColor: 'white',
            icon: 'warning',
            message: `So that didn't work. . . sorry`,
            position: 'top'

        }
        return notiInfo
    }
}
export { CopyClick }