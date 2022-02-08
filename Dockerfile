#	Copyright 2015, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START docker]

# The Google App Engine python runtime is Debian Jessie with Python installed
# and various os-level packages to allow installation of popular Python
# libraries. The source is on github at:
# https://github.com/GoogleCloudPlatform/python-docker
FROM gcr.io/google_appengine/python

# Create a virtualenv for the application dependencies.
# # If you want to use Python 2, use the -p python2.7 flag.
RUN virtualenv -p python3 /env
ENV PATH /env/bin:$PATH

ADD requirements.txt /app/requirements.txt
RUN /env/bin/pip install --upgrade pip && /env/bin/pip install -r /app/requirements.txt
ADD . /app

# React
# RUN yarn run build

# Django migrations and collecting static files
RUN /env/bin/python3 manage.py makemigrations
RUN /env/bin/python3 manage.py migrate --noinput
# RUN /env/bin/python3 manage.py migrate --noinput --fake
# RUN /env/bin/python3 manage.py migrate --noinput --fake-initial
# RUN /env/bin/python3 manage.py collectstatic --noinput

# Start Daphne
ENV DJANGO_SETTINGS_MODULE="smpp_client.settings"
CMD daphne -b 0.0.0.0 -p 8080 smpp_client.asgi:application

# [END docker]
