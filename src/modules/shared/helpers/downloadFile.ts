export const downloadFile = (data: object | string | Blob, fileName: string, fileType: string): void => {
    let blob: Blob;

    switch (typeof data) {
        case "object":
            if (data instanceof Blob) {
                blob = data;
            } else {
                const jsonString = JSON.stringify(data, null, 2);
                blob = new Blob([jsonString], { type: fileType });
            }
            break;
        case "string":
            blob = new Blob([data], { type: fileType });
            break;
        default:
            throw new Error("Unsupported data type");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
};
