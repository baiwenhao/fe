FROM ma-imagesrepo.maezia.dev:9443/library/nginx
ADD client/dist /usr/share/nginx/html
ADD client/default.conf /etc/nginx/conf.d/default.conf
COPY client/scripts/rebuild.sh /rebuild.sh
RUN chmod +x /rebuild.sh
EXPOSE 80:80
EXPOSE 443:443
ENTRYPOINT /bin/bash rebuild.sh && /bin/bash -c "nginx -g 'daemon off;'"

