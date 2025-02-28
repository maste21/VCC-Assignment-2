# VCC-Assignment-2
Commands:

# 1. Initialize a project
npm init -y

# 2. Install the Google Cloud Compute and IAM libraries
npm install @google-cloud/compute @google-cloud/iam


# 4. Set  Google Cloud project ID as an environment variable
export GOOGLE_CLOUD_PROJECT=vcc-assignment-452211

# 5. Instll google cloud cli and Authenticate
Download the installer from: https://cloud.google.com/sdk/docs/install

gcloud init
gcloud auth application-default login

# 6. Run the script
node create-vm.js
