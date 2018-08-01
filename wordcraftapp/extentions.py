from flaskext.mysql import MySQL

from wordcraftapp.db.pyhdp.gcsana import GCS

# The below are solely for avoiding circular referencing. Extensions file exists for this reason.
mysql = MySQL()
gcs = GCS()
