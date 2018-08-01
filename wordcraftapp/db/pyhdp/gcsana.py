from __future__ import absolute_import
from pyhive import hive

try:
    from flask import _app_ctx_stack as _ctx_stack
except ImportError:
    from flask import _request_ctx_stack as _ctx_stack


class GCS (object):
    def __init__(self, app=None, **connect_args):
        self.connect_args = connect_args
        if app is not None:
            self.app = app
            self.init_app (self.app)
        else:
            self.app = None

    def init_app(self, app):
        self.app = app
        self.app.config.setdefault ('HIVE_HOST', 'localhost')
        self.app.config.setdefault ('HIVE_PORT', 20000)
        self.app.config.setdefault ('HIVE_USER', None)
        self.app.config.setdefault ('HIVE_PASSWORD', None)
        self.app.config.setdefault ('HIVE_DB', None)
        self.app.config.setdefault ('HIVE_AUTH', 'LDAP')
        # Flask 0.9 or later
        if hasattr (app, 'teardown_appcontext'):
            self.app.teardown_request (self.teardown_request)
        # Flask 0.7 to 0.8
        elif hasattr (app, 'teardown_request'):
            self.app.teardown_request (self.teardown_request)
        # Older versions
        else:
            self.app.after_request (self.teardown_request)

    def connect(self):
        if self.app.config['HIVE_HOST']:
            self.connect_args['host'] = self.app.config['HIVE_HOST']
        if self.app.config['HIVE_PORT']:
            self.connect_args['port'] = self.app.config['HIVE_PORT']
        if self.app.config['HIVE_USER']:
            self.connect_args['username'] = self.app.config['HIVE_USER']
        if self.app.config['HIVE_PASSWORD']:
            self.connect_args['password'] = self.app.config['HIVE_PASSWORD']
        if self.app.config['HIVE_AUTH']:
            self.connect_args['auth'] = self.app.config['HIVE_AUTH']
        if self.app.config['HIVE_DB']:
            self.connect_args['database'] = self.app.config['HIVE_DB']
        return hive.connect (**self.connect_args)

    def teardown_request(self, exception):
        ctx = _ctx_stack.top
        if hasattr (ctx, "hive"):
            ctx.hive.close ()

    def get_db(self):
        ctx = _ctx_stack.top
        if ctx is not None:
            if not hasattr (ctx, "hive"):
                ctx.hive = self.connect ()
            return ctx.hive
