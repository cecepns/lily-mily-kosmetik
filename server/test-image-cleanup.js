const fs = require('fs');
const path = require('path');

// Test the deleteOldImage function
const uploadsDir = 'uploads-tokokosmetik-ariani';

// Helper function to delete old image file (copied from server.js)
const deleteOldImage = (imageFilename) => {
  if (imageFilename && imageFilename !== 'null' && imageFilename !== 'undefined') {
    const imagePath = path.join(uploadsDir, imageFilename);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`✅ Deleted old image: ${imageFilename}`);
        return true;
      } catch (error) {
        console.error(`❌ Error deleting image ${imageFilename}:`, error);
        return false;
      }
    } else {
      console.log(`⚠️  Image file not found: ${imagePath}`);
      return false;
    }
  } else {
    console.log(`⚠️  Invalid image filename: ${imageFilename}`);
    return false;
  }
};

// Test cases
console.log('🧪 Testing image deletion functionality...\n');

// Test 1: Valid image filename
console.log('Test 1: Valid image filename');
const testResult1 = deleteOldImage('image-1755759490459-854370950.jpg');
console.log(`Result: ${testResult1 ? 'PASS' : 'FAIL'}\n`);

// Test 2: Null filename
console.log('Test 2: Null filename');
const testResult2 = deleteOldImage(null);
console.log(`Result: ${testResult2 === false ? 'PASS' : 'FAIL'}\n`);

// Test 3: Undefined filename
console.log('Test 3: Undefined filename');
const testResult3 = deleteOldImage(undefined);
console.log(`Result: ${testResult3 === false ? 'PASS' : 'FAIL'}\n`);

// Test 4: String "null"
console.log('Test 4: String "null"');
const testResult4 = deleteOldImage('null');
console.log(`Result: ${testResult4 === false ? 'PASS' : 'FAIL'}\n`);

// Test 5: Non-existent file
console.log('Test 5: Non-existent file');
const testResult5 = deleteOldImage('non-existent-file.jpg');
console.log(`Result: ${testResult5 === false ? 'PASS' : 'FAIL'}\n`);

console.log('✅ Image deletion tests completed!');
