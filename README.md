# Celestia Light node monitor

Provide information related to the Header, Share, P2p, DAS, and State of your light node

## Use scripts to install and run

```bash
curl https://gist.githubusercontent.com/suntzu93/6f50b3a6863767479a09ad0cd2a190b4/raw/install_light_node_ui.sh | bash

# url : http://0.0.0.0:5001
# If you want access from client then allow firewall port 5001 if you are using ufw.
ufw allow 5001

# Now you can access by url : http://<your_server_ip>:5001

# To update code 

cd ~/celestia-light-node-ui
git pull
pm2 restart start_light_node_ui.sh

```

## Install by manually
You can edit the configs in `.env` file.

```bash
git clone https://github.com/suntzu93/celestia-light-node-ui.git
cd celestia-light-node-ui

npm install -g yarn
yarn install

#------------ PROXY SERVER -------------------

# Start proxy server to pass CORS
node proxy_backend/proxy_server.js
# PORT 5002 will be used for proxy server

#-------------------------------


#--------------- WEBSITE ----------------------
# Get auth token by command 
celestia light auth admin --p2p.network blockspacerace
#copy data response and paste to .env file

# create a .env file
cp .env.example .env
# edit VITE_TOKEN and VITE_RPC in .env file

# run in dev mode
yarn start

# run in produce mode
yarn build-prod
yarn preview

# http://localhost:5001

#-------------------------------
```

``
