# 🔒 Advanced Proxy Auth

Advanced Proxy Auth is a tool that allows you to create an simple reverse proxy with authentication. It is useful when you want to protect your unsecured services with a simple password.

📣 The project is still in development and features are not all implemented yet.

## 🪶 Features

✅ **Implemented:**
- Single user HTTP Authentication
- Multiple user HTTP Authentication
- WebUI based authentication
- User management
- Access logs

🛠️ **Planned:**
- LDAP Authentication
- OAuth2 Authentication
- SSL/TLS support
- Better admin UI and tools

## 🚀 Running

### 💻 Development

To run the project in development mode, you need to have [bun](https://bun.sh/) installed on your machine.

Clone the repository and run the following commands:

```bash
git clone https://github.com/Wiredista/advanced-proxy-auth.git
cd advanced-proxy-auth
bun install
```

Now copy the `.env.example` file to `.env` and set the environment variables.

```bash
cp .env.example .env
```

After that, you can run the project with the following command:

```bash
bun run .
```

### 📦 Production

To run the project in production mode, you need to have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

Create a `.env` file based on the `.env.example` file and set the environment variables.

```bash
PROXY_HOST=127.0.0.1
PROXY_PORT=80
PROXY_PROTOCOL=http

# AUTHENTICATION - HTTP_BASIC
AUTH_MODE=http
AUTH_HTTP_USERNAME=admin
AUTH_HTTP_PASSWORD=admin

# AUTHENTICATION - HTTP_ADVANCED
# AUTH_MODE=http_advanced
# AUTH_HTTP_USERNAME=admin # username for the admin UI
# AUTH_HTTP_PASSWORD=admin # password for the admin UI

# AUTHENTICATION - WEB UI
# AUTH_MODE=web_ui
# AUTH_HTTP_USERNAME=admin # username for the admin UI
# AUTH_HTTP_PASSWORD=admin # password for the admin UI
```

Create a `docker-compose.yml`

```yaml
services:
    proxy-auth:
        build: https://github.com/Wiredista/advanced-proxy-auth.git#main
        ports: 
            - "80:3000"
        env_file: .env
```

After that, you can run the project with the following command:

```bash
docker compose up
```

Since SSL/TLS is not implemented yet, you can use a reverse proxy like [Nginx Proxy Manager](https://nginxproxymanager.com/) to handle the SSL/TLS termination.

## 📖 Usage

After running the project, you can access the admin UI on `http://localhost:3000/proxyauth-admin`.

Access logs are available on `http://localhost:3000/proxyauth/logs` if you are logged in as an admin.

The default username and password are `admin`.

All other requests will be redirected to the destination URL configured in the `.env` file.

Currently supported authentication methods are:
- **HTTP Basic Authentication:** HTTP based username and password authentication configured in the `.env` file.
- **HTTP Advanced Authentication:** HTTP based username and password authentication with a WebUI to manage users.
- **WebUI Authentication:** WebUI based username and password authentication with a WebUI to manage users.


## 📚 Contributing

If you want to contribute to the project, you can open an issue or a pull request. We are open to suggestions and improvements.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
