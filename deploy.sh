(cd frontend && yarn run build)
gsutil -m -h "Cache-Control:no-store" rsync -r ./frontend/static gs://smpp-client-338121_media-bucket/static
docker build -t gcr.io/smpp-client-338121/polls .
docker push gcr.io/smpp-client-338121/polls
kubectl apply -f polls.yaml
kubectl rollout restart deployment.apps/polls
watch kubectl get pods
