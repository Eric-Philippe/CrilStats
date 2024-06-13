# Use the official Node.js image as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies for Chromium and Python
RUN apt-get update && \
    apt-get install -y \
    wget \
    ca-certificates \
    gnupg \
    python3 \
    python3-pip \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Add Chromium PPA and install it
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    ln -s /usr/bin/google-chrome /usr/bin/chromium && \
    rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/google.list

# Set the environment variable to use Chromium in puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Node.js application
RUN npm run build

# Install psycopg2-binary system-wide
RUN pip3 install --no-cache-dir --break-system-packages psycopg2-binary

# Run the Node.js application
CMD ["node", "./dist/run.js"]
