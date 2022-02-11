# Run with `-n` to disallow caching
if [ "$1" = -n ]; then
  BUCKET_HEADER='-h "Cache-Control:no-store"'
else
  BUCKET_HEADER=
fi

. deploy_config
(cd frontend && yarn run build)
gsutil -m "$BUCKET_HEADER" rsync -r "$STATIC_PATH" "$BUCKET"
docker build -t "$DOCKER" .
docker push "$DOCKER"
sed -e "s,<container-image>,$DOCKER,g" polls.yaml | kubectl apply -f -
kubectl rollout restart deployment.apps/polls
watch kubectl get pods
