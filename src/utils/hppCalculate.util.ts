export const calculateHpp = (hargaBeli: number, jumlah: number, jumlahDigunakan: number): number => {
    const biayaPerSatuan = hargaBeli / jumlah;
    return biayaPerSatuan * jumlahDigunakan;
};
