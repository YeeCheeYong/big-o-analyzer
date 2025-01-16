## Use an official Node.js runtime as a parent image
FROM node:18-alpine
#FROM node:lts-buster AS development
# Set frontend work directory
WORKDIR /frontend

# Install dependencies
COPY package.json /frontend/
#COPY  package-lock.json /frontend/
#COPY public/ /frontend/public
#COPY src/ /frontend/src

#COPY public/ /frontend/public
RUN npm install
#RUN npm ci
RUN npm install @ungap/structured-clone
#RUN npm i -g serve
# Copy frontend source code and build static files
#RUN echo $'#!/bin/sh \n\
#npm run dev & \n\
#sleep 2 # give testServer time to create the newest log \n\
#exec tail -f /root/applog.log ' >> /entrypoint.sh
#RUN chmod 755 /entrypoint.sh
#EXPOSE 3000
#ENTRYPOINT [ "/entrypoint.sh" ]
# Expose the frontend port
COPY . .
RUN npm run build
EXPOSE 5173

# Serve frontend using Node.js
CMD ["npm", "run", "dev","--",--host","0.0.0.0","--port","5173"]
#CMD ["npm", "start"]



