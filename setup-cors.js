/**
 * This script sets up CORS configuration for your existing Firebase Storage bucket.
 * Run it with: node setup-cors.js
 */

const { Storage } = require('@google-cloud/storage');
const serviceAccount = require('./firebase-service-account.json');

async function setupCors() {
  console.log('Setting up CORS configuration for Firebase Storage bucket...');
  
  // Initialize the Storage client
  const storage = new Storage({
    projectId: serviceAccount.project_id,
    credentials: serviceAccount
  });
  
  const bucketName = 'mrjohn-8ee8b.firebasestorage.app';
  
  try {
    // Check if the bucket exists
    const [exists] = await storage.bucket(bucketName).exists();
    
    if (!exists) {
      console.error(`Bucket ${bucketName} does not exist. Please create it first.`);
      return;
    }
    
    console.log(`Bucket ${bucketName} exists. Setting up CORS configuration...`);
    
    // Set up CORS configuration
    const corsConfiguration = [
      {
        origin: ['*'],
        method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
        responseHeader: ['Content-Type', 'Access-Control-Allow-Origin'],
        maxAgeSeconds: 3600
      }
    ];
    
    await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
    console.log('CORS configuration set successfully.');
    
    // Make the bucket publicly accessible
    try {
      await storage.bucket(bucketName).makePublic();
      console.log('Bucket is now publicly accessible.');
    } catch (error) {
      console.warn('Could not make bucket public:', error.message);
      console.log('You may need to set up IAM permissions manually.');
    }
    
    console.log('\nCORS configuration setup completed successfully!');
    console.log(`Your bucket ${bucketName} is ready to use.`);
  } catch (error) {
    console.error('Error setting up CORS configuration:', error);
    console.log('\nPlease follow these manual steps:');
    console.log('1. Go to the Firebase Console: https://console.firebase.google.com/');
    console.log(`2. Select your project: ${serviceAccount.project_id}`);
    console.log('3. Click on "Storage" in the left sidebar');
    console.log(`4. Select your bucket: ${bucketName}`);
    console.log('5. Click on the "Rules" tab');
    console.log('6. Update the rules to allow public access if needed');
  }
}

setupCors(); 