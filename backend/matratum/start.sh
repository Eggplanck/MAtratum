python manage.py migrate
python manage.py collectstatic --no-input
gunicorn --config "gunicorn.conf.py" matratum.wsgi