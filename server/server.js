const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

// Helper function to delete old image file
const deleteOldImage = (imageFilename) => {
  if (imageFilename && imageFilename !== 'null' && imageFilename !== 'undefined') {
    const imagePath = path.join(uploadsDir, imageFilename);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`Deleted old image: ${imageFilename}`);
      } catch (error) {
        console.error(`Error deleting image ${imageFilename}:`, error);
      }
    }
  }
};

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads-tokokosmetik-ariani'));

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads-tokokosmetik-ariani';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'toko_kosmetik_ariani',
  
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Categories routes
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY name', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.query(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, name, description });
    }
  );
});

app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Category updated successfully' });
    }
  );
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

// Brands routes
app.get('/api/brands', (req, res) => {
  db.query('SELECT * FROM brands ORDER BY name', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/brands', upload.single('logo'), (req, res) => {
  const { name, description } = req.body;
  const logo = req.file ? req.file.filename : null;
  
  db.query(
    'INSERT INTO brands (name, description, logo) VALUES (?, ?, ?)',
    [name, description, logo],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, name, description, logo });
    }
  );
});

app.put('/api/brands/:id', upload.single('logo'), (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const logo = req.file ? req.file.filename : req.body.existing_logo;
  
  db.query(
    'UPDATE brands SET name = ?, description = ?, logo = ? WHERE id = ?',
    [name, description, logo, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Brand updated successfully' });
    }
  );
});

app.delete('/api/brands/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM brands WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Brand deleted successfully' });
  });
});

// Products routes
app.get('/api/products', (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  // Build base query for counting total products
  let countQuery = `
    SELECT COUNT(*) as total 
    FROM products p 
    LEFT JOIN brands b ON p.brand_id = b.id 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.is_active = TRUE
  `;
  
  // Build main query for fetching products
  let query = `
    SELECT p.*, b.name as brand_name, c.name as category_name 
    FROM products p 
    LEFT JOIN brands b ON p.brand_id = b.id 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.is_active = TRUE
  `;
  
  const queryParams = [];
  
  // Add search condition
  if (search) {
    const searchCondition = ' AND (p.name LIKE ? OR b.name LIKE ?)';
    countQuery += searchCondition;
    query += searchCondition;
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  
  // Add category filter
  if (category) {
    const categoryCondition = ' AND c.name = ?';
    countQuery += categoryCondition;
    query += categoryCondition;
    queryParams.push(category);
  }
  
  // Add pagination to main query
  query += ' ORDER BY p.id DESC LIMIT ? OFFSET ?';
  const paginationParams = [...queryParams, parseInt(limit), offset];
  
  // Execute count query first
  db.query(countQuery, queryParams, (err, countResults) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const totalProducts = countResults[0].total;
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    // Execute main query
    db.query(query, paginationParams, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Return paginated response
      res.json({
        products: results,
        totalProducts: totalProducts,
        totalPages: totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      });
    });
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, b.name as brand_name, c.name as category_name 
    FROM products p 
    LEFT JOIN brands b ON p.brand_id = b.id 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.id = ? AND p.is_active = TRUE
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json(results[0]);
  });
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, description, price, online_store_link, brand_id, category_id } = req.body;
  const image = req.file ? req.file.filename : null;
  
  db.query(
    'INSERT INTO products (name, description, price, image, online_store_link, brand_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, image, online_store_link, brand_id, category_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, message: 'Product created successfully' });
    }
  );
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description, price, online_store_link, brand_id, category_id } = req.body;
  
  // Handle image logic
  let image = null;
  if (req.file) {
    image = req.file.filename;
  } else if (req.body.existing_image && req.body.existing_image !== 'null' && req.body.existing_image !== 'undefined') {
    image = req.body.existing_image;
  }
  
  // First, get the current image filename to delete it later
  db.query('SELECT image FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const oldImage = results[0]?.image;
    
    // Update the product
    db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, online_store_link = ?, brand_id = ?, category_id = ? WHERE id = ?',
      [name, description, price, image, online_store_link, brand_id, category_id, id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Delete old image if:
        // 1. A new image was uploaded and old image exists
        // 2. Image was removed (image is null) and old image exists
        if (oldImage && oldImage !== image) {
          deleteOldImage(oldImage);
        }
        
        res.json({ message: 'Product updated successfully' });
      }
    );
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  // First, get the image filename to delete it
  db.query('SELECT image FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const imageFilename = results[0]?.image;
    
    // Soft delete the product
    db.query('UPDATE products SET is_active = FALSE WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Delete the associated image file
      if (imageFilename) {
        deleteOldImage(imageFilename);
      }
      
      res.json({ message: 'Product deleted successfully' });
    });
  });
});

// Remove product image endpoint
app.delete('/api/products/:id/image', (req, res) => {
  const { id } = req.params;
  
  // First, get the current image filename
  db.query('SELECT image FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const imageFilename = results[0]?.image;
    
    // Update product to remove image reference
    db.query('UPDATE products SET image = NULL WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Delete the image file
      if (imageFilename) {
        deleteOldImage(imageFilename);
      }
      
      res.json({ message: 'Product image removed successfully' });
    });
  });
});

// Bulk insert products
app.post('/api/products/bulk', (req, res) => {
  const { products } = req.body;
  
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Products array is required and cannot be empty' });
  }

  const values = products.map(product => [
    product.name,
    product.description,
    product.price,
    null, // image is null for bulk insert
    product.online_store_link,
    product.brand_id,
    product.category_id
  ]);

  const query = `
    INSERT INTO products (name, description, price, image, online_store_link, brand_id, category_id) 
    VALUES ?
  `;

  db.query(query, [values], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: `${products.length} products inserted successfully`,
      insertedCount: products.length,
      insertId: results.insertId
    });
  });
});

// Reviews routes
app.get('/api/reviews', (req, res) => {
  db.query('SELECT * FROM reviews WHERE is_approved = TRUE ORDER BY created_at DESC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get('/api/reviews/admin', (req, res) => {
  db.query('SELECT * FROM reviews ORDER BY created_at DESC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/reviews', (req, res) => {
  const { customer_name, rating, comment } = req.body;
  db.query(
    'INSERT INTO reviews (customer_name, rating, comment) VALUES (?, ?, ?)',
    [customer_name, rating, comment],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, message: 'Review submitted successfully' });
    }
  );
});

app.put('/api/reviews/:id/approve', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE reviews SET is_approved = TRUE WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Review approved successfully' });
  });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reviews WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Review deleted successfully' });
  });
});

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});