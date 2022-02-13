# Script based on: https://cloud.google.com/python/django/kubernetes-engine

# Set environment variables
set -a
. ./config
set +a

# Initial steps
echo 'In the Google Cloud Console, on the project selector page, select or create a Google Cloud project.'
echo 'Go to project selector:'
echo -e 'https://console.cloud.google.com/projectselector2/home/dashboard'
read -p 'Press Enter when done ' -r
echo -e '\n'
echo 'Make sure that billing is enabled for your Cloud project. Learn how to check if billing is enabled on a project:'
echo -e 'https://cloud.google.com/billing/docs/how-to/modify-project#confirm_billing_is_enabled_on_a_project'
read -p 'Press Enter when done ' -r
echo -e '\n'
echo 'Enable the GKE and Compute Engine APIs:'
echo -e 'https://console.cloud.google.com/flows/enableapi?apiid=compute.googleapis.com,container.googleapis.com'
read -p 'Press Enter when done ' -r
echo -e '\n'

# Install docker (based on https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)
sudo apt-get remove docker docker-engine docker.io containerd runc
curl -fsSL https://get.docker.com -o ~/get-docker.sh
sudo . ~/get-docker.sh

# Install the gcloud CLI from versioned archives (based on: https://cloud.google.com/sdk/docs/downloads-versioned-archives)
GCLOUD_CLI_FILENAME=google-cloud-sdk-372.0.0-linux-$(uname -m).tar.gz
(cd && curl https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/"$GCLOUD_CLI_FILENAME")
(cd && tar -xzf GCLOUD_CLI_FILENAME)
(cd ~/google-cloud-sdk/ && . install.sh)
~/google-cloud-sdk/bin/gcloud init

# Create a Cloud Storage bucket and make it publicly readable
gsutil mb gs://"$GCP_PROJECT_ID"_"$GCP_MEDIA_BUCKET"
gsutil defacl set public-read gs://"$GPC_PROJECT_ID"_"$GCP_MEDIA_BUCKET"

# Initialize GKE
echo -e '\n'
echo 'To initialize GKE, go to the Clusters page:'
echo -e 'https://console.cloud.google.com/kubernetes/list'
echo 'When you use GKE for the first time in a project, you need to wait for the "Kubernetes Engine is getting ready. This may take a minute or more" message to disappear.'
read -p 'Press Enter when done ' -r

# Create a GKE cluster
gcloud container clusters create polls \
  --scopes "https://www.googleapis.com/auth/userinfo.email","cloud-platform" \
  --num-nodes 4 --zone "us-central1-a"

# After the cluster is created, use the kubectl command-line tool, which is integrated with the gcloud, to interact with your GKE cluster. Because gcloud and kubectl are separate tools, make sure kubectl is configured to interact with the right cluster.
gcloud container clusters get-credentials polls --zone "us-central1-a"

# Configure Docker to use gcloud as a credential helper, so that you can push the image to Container Registry
gcloud auth configure-docker

# Create the GKE resource
envsubst < polls.yaml | kubectl create -f -

# After the pods are ready, you can get the public IP address of the load balancer
kubectl get services polls
