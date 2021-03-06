# Terminate script on errors
set -e

## Run with `-n` to disallow caching
#if [ "$1" = -n ]; then
#  BUCKET_HEADER='-h "Cache-Control:no-store"'
#else
#  BUCKET_HEADER=''
#fi

# Set environment variables
set -a
. ./config
set +a

# Update the static content to the bucket
gsutil -m rsync -r "$STATIC_PATH" "$STATIC_GSUTIL"
#gsutil -m "$BUCKET_HEADER" rsync -r "$STATIC_PATH" "$STATIC_GSUTIL"

# Apply the kubernetes config, restart the deployment, watch the state, and show the logs
envsubst < polls.yaml | kubectl apply -f -
kubectl rollout restart deployment.apps/polls
watch kubectl get pods
kubectl logs -f deploy/polls polls-app
