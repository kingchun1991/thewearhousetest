FROM google/nodejs

# Install gem sass for  grunt-contrib-sass
RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN apt-get install libssl-dev -y
RUN apt-get install -y ruby
RUN apt-get install nodejs-legacy -y
RUN gem install sass

WORKDIR /home/mean

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g load-grunt-tasks

# Install Mean.JS packages
COPY package.json /home/mean/package.json
RUN npm install --quiet && npm cache clean
RUN npm install -D load-grunt-config

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/mean/.bowerrc
ADD bower.json /home/mean/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
COPY . /home/mean

# Set development environment as default
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 8080 35729
CMD ["grunt --development --force"]
