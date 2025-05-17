"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHpp = void 0;
const calculateHpp = (hargaBeli, jumlah, jumlahDigunakan) => {
    const biayaPerSatuan = hargaBeli / jumlah;
    return biayaPerSatuan * jumlahDigunakan;
};
exports.calculateHpp = calculateHpp;
