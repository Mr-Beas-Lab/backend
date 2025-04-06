/**
 * This script helps set up a custom Firebase Storage bucket for your project.
 * Run it with: node setup-custom-bucket.js
 */

const { Storage } = require('@google-cloud/storage');
const serviceAccount = require('./firebase-service-account.json');

async function setupCustomBucket() {
  console.log('Setting up custom Firebase Storage bucket...');
  
  // Initialize the Storage client
  const storage = new Storage({
    projectId: serviceAccount.project_id,
    credentials: serviceAccount
  });
  
  const bucketName = 'mrjohn-8ee8b-customer-files';
  
  try {
    // Check if the bucket exists
    const [exists] = await storage.bucket(bucketName).exists();
    
    if (exists) {
      console.log(`Bucket ${bucketName} already exists.`);
    } else {
      console.log(`Bucket ${bucketName} does not exist. Creating it...`);
      
      // Create the bucket
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD'
      });
      
      console.log(`Bucket ${bucketName} created successfully.`);
    }
    
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
    await storage.bucket(bucketName).makePublic();
    console.log('Bucket is now publicly accessible.');
    
    console.log('\nCustom Firebase Storage bucket setup completed successfully!');
    console.log(`You can now use the bucket: ${bucketName}`);
  } catch (error) {
    console.error('Error setting up custom Firebase Storage bucket:', error);
    console.log('\nPlease follow these manual steps:');
    console.log('1. Go to the Firebase Console: https://console.firebase.google.com/');
    console.log(`2. Select your project: ${serviceAccount.project_id}`);
    console.log('3. Click on "Storage" in the left sidebar');
    console.log('4. Click "Get Started" if you haven\'t set up Storage yet');
    console.log(`5. Create a bucket named: ${bucketName}`);
    console.log('6. Set the location to "United States (us-central1)"');
    console.log('7. Set the storage class to "Standard"');
    console.log('8. Click "Create bucket"');
  }
}

setupCustomBucket(); 