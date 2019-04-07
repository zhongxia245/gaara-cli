upstream api_server {
    server ${NGINX_UPSTREAM}.nginx-1.${NGINX_TARGET}.lcgc.work;
    server ${NGINX_UPSTREAM}.nginx-2.${NGINX_TARGET}.lcgc.work;
    server ${NGINX_UPSTREAM}.nginx-3.${NGINX_TARGET}.lcgc.work;
}

server {
    listen ${NGINX_PORT};
    charset utf-8;
    access_log /log/access.log elk;
    error_log /log/error.log;
    root /opt/project;
}
