FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/smarth-report-zorro /usr/share/nginx/html
