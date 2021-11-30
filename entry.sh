gunicorn --daemon --config "gunicorn.conf.py" matratum.wsgi
envsubst '$$PORT' < /etc/nginx/conf.d/custom.template > /etc/nginx/conf.d/custom.conf
nginx -g 'daemon off;'