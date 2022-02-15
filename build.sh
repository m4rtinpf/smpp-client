# Terminate script on errors
set -e

# Set environment variables
set -a
. ./config
set +a

# Install requirements
sudo apt-get install python3-venv -y
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
sudo snap install node --classic
# Corepack comes bundled in node >16.19
#corepack enable
(cd frontend && yarn install)

# Build the frontend
(cd frontend && yarn run build)

## Make migrations
#python3 manage.py makemigrations
#python3 manage.py migrate
#python3 manage.py collectstatic

# Add the (unprivileged) user to the `docker` group
sudo usermod -a -G docker "$USER"

# Build and push the docker image
sg docker -c "docker build -t $DOCKER_CONTAINER ."
sg docker -c "docker push $DOCKER_CONTAINER"

