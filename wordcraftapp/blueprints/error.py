from flask import Blueprint, jsonify

error = Blueprint ('error', __name__)


# Error handling blueprints. Below are the standard methods commonly used.

@error.errorhandler (403)
def error_403(e):
    return (jsonify ({'response_status': "Error"},
                     {'response_message': str (e)}), 403)


@error.errorhandler (404)
def error_404(e):
    return (jsonify ({'response_status': "ERROR",
                      'response_message': str (e)}), 404)


@error.errorhandler (405)
def error_405(e):
    return (jsonify ({'response_status': "ERROR",
                      'response_message': str (e)}), 405)

# The below errorhandler has been excluded for compatibility reasons. Needs further investigation.
# @error.errorhandler (500)
# def error_500(e):
#     return (jsonify ({'response_status': "ERROR",
#                       'response_message': str (e)}), 500)


@error.errorhandler (503)
def error_503(e):
    return (jsonify ({'response_status': "ERROR",
                      'response_message': str (e)}), 503)