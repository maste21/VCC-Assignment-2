# VCC-Assignment-2

Commands:

Initialize a project

    npm init -y

Install the Google Cloud Compute and IAM libraries

    npm install @google-cloud/compute @google-cloud/iam


Set Google Cloud project ID as an environment variable

    export GOOGLE_CLOUD_PROJECT=vcc-assignment-452211

Install google cloud cli and Authenticate

Download the installer from: https://cloud.google.com/sdk/docs/install

    gcloud init
    gcloud auth application-default login

Run the script

    node create-vm.js
