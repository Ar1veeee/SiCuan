export interface MenuRequest {
  nama_menu: string;
}

export interface MenuData {
  id: string;
  userId: string;
  nama_menu: string;
  hpp?: number | null;
  keuntungan?: number | null;
  harga_jual?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuResponse {
  message: string;
  data?: object;
}
