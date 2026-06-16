const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const readline = require('readline');

require('dotenv').config();

// Configuración de la conexión
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'test123',
  database: process.env.DB_NAME || 'reposteria'
});

// Directorios
const sourceDir = path.join(__dirname, 'public', 'Imagenes');
const destDir = path.join(__dirname, 'backend', 'uploads', 'productos');

// Mapeo de archivos a categorías y productos
const imagenesMap = {
  'pasteldechoco.jpg': { nombre: 'Pastel de Chocolate', categoria: 'Pasteles' },
  'cupcake.jpg': { nombre: 'Cupcake Vainilla', categoria: 'Repostería Individual' },
  'chessecake.jfif': { nombre: 'Cheesecake Arándanos', categoria: 'Repostería Individual' },
  'galletas.jpg': { nombre: 'Galletas Chocolate', categoria: 'Repostería Individual' },
  'tartadefresas.jfif': { nombre: 'Tarta de Fresas Premium', categoria: 'Pasteles' },
  'cafecookie.jpg': { nombre: 'Café de Grano', categoria: 'Cafetería y Té' },
  'teinfucionado.jpg': { nombre: 'Tarta de Fresas', categoria: 'Pasteles' },
  'tartadebodas.jfif': { nombre: 'Tarta de Fresas Premium', categoria: 'Pasteles' },
  'pasteles.jfif': { nombre: 'Pasteles Varios', categoria: 'Pasteles' },
  'pasteldevaini.jfif': { nombre: 'Tarta de Fresas', categoria: 'Pasteles' }
};

function copyImageToUploads(sourceFile) {
  const destFile = path.join(destDir, sourceFile);
  
  if (fs.existsSync(sourceFile)) {
    const src = path.join(sourceDir, sourceFile);
    fs.copyFileSync(src, destFile);
    return sourceFile;
  }
  return null;
}

function updateProductImage(productId, imageName) {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE productos SET imagen = ? WHERE id = ?',
      [imageName, productId],
      (err) => {
        if (err) {
          console.error('Error actualizando producto:', err.message);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function main() {
  console.log('🔄 Actualizando imágenes de productos...\n');
  
  // Asegurar que el directorio existe
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('✅ Directorio de uploads creado');
  }
  
  // Obtener todos los productos sin imagen
  db.query('SELECT id, nombre, categoria FROM productos WHERE imagen IS NULL', [], async (err, rows) => {
    if (err) {
      console.error('Error al obtener productos:', err.message);
      return;
    }
    
    console.log(`Encontrados ${rows.length} productos sin imagen:\n`);
    
    for (const row of rows) {
      console.log(`📦 Producto: ${row.nombre} (ID: ${row.id}) - Categoría: ${row.categoria}`);
      
      // Buscar imagen en el mapeo
      let imageName = null;
      for (const [file, data] of Object.entries(imagenesMap)) {
        if (data.nombre === row.nombre || data.categoria === row.categoria) {
          imageName = copyImageToUploads(file);
          if (imageName) {
            break;
          }
        }
      }
      
      if (imageName) {
        try {
          await updateProductImage(row.id, imageName);
          console.log(`   ✅ Actualizado con: ${imageName}\n`);
        } catch (error) {
          console.log(`   ❌ Error actualizando ID ${row.id}\n`);
        }
      } else {
        console.log(`   ⚠️ No se encontró imagen asignada\n`);
      }
    }
    
    console.log('✅ Proceso completado');
    db.end();
  });
}

main();
