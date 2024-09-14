
#!/bin/bash
cd  /usr/share/nginx/html
 
host_prefix=$STATIC_PORTAL_ENV
 
echo host_prefix:$host_prefix
 
# 静态域名替换
find . -name "*.json" -o -name "*.js" -o -name "*.css" -o -name "*.html" | xargs sed -i "s|{&&ENV&&}|$host_prefix|g"
# 请求接口替换
find . -name "*.json" -o -name "*.js" -o -name "*.css" -o -name "*.html" | xargs sed -i "s|{&&API_ENV&&}|$STATIC_PORTAL_ENV|g"
