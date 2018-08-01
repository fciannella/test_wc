import os

from flask import Blueprint

# Standard flask blueprints to serve static UI resources (HTML, CSS, JS etc.)
# This means that the static files have to be built out before deployment. (i.e. npm run build)

web = Blueprint ('web', __name__, static_folder='../static/build')
pwd = web.root_path
build = os.path.abspath (os.path.join (pwd, '..', 'static', 'build'))


# Serve index.html file
@web.route ('/')
def root():
    return web.send_static_file ('index.html')


# Serve any 'dist' files as required.

dist = Blueprint ('dist', __name__, static_folder='../static/build/dist')


@dist.route ('/<path:path>')
def dist_all(path):
    return dist.send_static_file (path)


# Serve any 'static' files as required.

static = Blueprint ('static', __name__, static_folder='../static/build/static')


@static.route ('/<path:path>')
def static_all(path):
    return static.send_static_file (path)
