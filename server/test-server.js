const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Test server upload functionality
async function testUpload() {
  try {
    console.log('🧪 Testing server upload functionality...');
    
    // Create a test image file (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    console.log('✅ Created test image file');
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(testImagePath));
    
    console.log('📤 Uploading test image...');
    
    // Upload to server
    const response = await axios.post('https://api-inventory.isavralabel.com/lilymilykosmetik/api/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 10000
    });
    
    console.log('✅ Upload successful!');
    console.log('Response:', response.data);
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    console.log('🧹 Cleaned up test file');
    
  } catch (error) {
    console.error('❌ Upload test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test server status
async function testServerStatus() {
  try {
    console.log('🔍 Testing server status...');
    
    const response = await axios.get('https://api-inventory.isavralabel.com/lilymilykosmetik/api/test-uploads', {
      timeout: 5000
    });
    
    console.log('✅ Server is running');
    console.log('Uploads directory info:', response.data);
    
  } catch (error) {
    console.error('❌ Server status test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting server tests...\n');
  
  await testServerStatus();
  console.log('');
  
  await testUpload();
  console.log('');
  
  console.log('🏁 Tests completed');
}

// Check if required packages are installed
try {
  require('form-data');
  require('axios');
  runTests();
} catch (error) {
  console.error('❌ Missing required packages. Please install them:');
  console.error('npm install form-data axios');
}
