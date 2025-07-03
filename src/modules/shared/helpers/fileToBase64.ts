const fileToBase64 = async (file?: File): Promise<string> => {
    if (!file) return "";

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Przetwarzanie blokowe, aby uniknąć przekroczenia stosu
    let binaryString = "";
    const chunkSize = 8192; // Rozmiar bloku
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
        binaryString += String.fromCharCode.apply(null, uint8Array.slice(i, i + chunkSize) as unknown as number[]);
    }

    return btoa(binaryString);
};

export default fileToBase64;
