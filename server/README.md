# Toko Kosmetik Ariani - Backend API

Backend API server untuk aplikasi Toko Kosmetik Ariani.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Pastikan MySQL server berjalan dan database `toko_kosmetik_ariani` sudah dibuat.

3. Konfigurasi database di `server.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'toko_kosmetik_ariani'
});
```

## Menjalankan Server

### Development mode (dengan auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin

### Categories
- `GET /api/categories` - Ambil semua kategori
- `POST /api/categories` - Buat kategori baru
- `PUT /api/categories/:id` - Update kategori
- `DELETE /api/categories/:id` - Hapus kategori

### Brands
- `GET /api/brands` - Ambil semua brand
- `POST /api/brands` - Buat brand baru (dengan upload logo)
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Hapus brand

### Products
- `GET /api/products` - Ambil semua produk aktif
- `POST /api/products` - Buat produk baru (dengan upload gambar)
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Soft delete produk

### Reviews
- `GET /api/reviews` - Ambil review yang sudah disetujui
- `GET /api/reviews/admin` - Ambil semua review (untuk admin)
- `POST /api/reviews` - Submit review baru
- `PUT /api/reviews/:id/approve` - Setujui review
- `DELETE /api/reviews/:id` - Hapus review

### File Upload
- `POST /api/upload` - Upload file

## Struktur Database

Pastikan database memiliki tabel berikut:
- `categories` - Kategori produk
- `brands` - Brand produk
- `products` - Produk
- `reviews` - Review pelanggan

 

## Upload Files

File yang diupload akan disimpan di folder `uploads-tokokosmetik-ariani/` dan dapat diakses melalui `/uploads/` endpoint.
