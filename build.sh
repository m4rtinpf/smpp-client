# Set environment variables
set -a
. ./config
set +a

# Install requirements
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
sudo snap install node --classic
corepack enable
(cd frontend && yarn install)

# Build the frontend
(cd frontend && yarn run build)

# Make migrations
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic

# Build the docker image
docker build -t "$DOCKER" .

