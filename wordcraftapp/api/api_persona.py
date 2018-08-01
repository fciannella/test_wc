# from flask import request
# from flask_restful import Resource

# from wordcraftapp.extentions import mysql


# class getpersona (Resource):
#     def post(self):
#         content = request.get_json ()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']

#         cur = mysql.connect ().cursor ()

#         cur.execute (
#             "SELECT e.persona_name from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on b.motion_motion_id=c.motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on d.persona_persona_id=e.persona_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "' AND c.motion_name='" + motionname + "'")

#         rv = cur.fetchall ()
#         data = {"personas": [x[0] for x in rv]}
#         return data


# class updatepersona (Resource):
#     def put(self):
#         content = request.get_json ()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname_old = content['persona']
#         personaname_new = content['updatePersona']
#         cur = mysql.connect ().cursor ()

#         cur.execute (
#             "select persona_id from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on c.motion_id=b.motion_motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on e.persona_id=d.persona_persona_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "' and c.motion_name='" + motionname + "' and e.persona_name='" + personaname_old + "'")
#         rv = cur.fetchall ()
#         personaid = rv[0]

#         cur.execute ("UPDATE persona SET persona_name=%s WHERE persona_id=%s", (personaname_new, personaid))

#         mysql.connect ().commit ()


# class addpersona (Resource):
#     def post(self):
#         content = request.get_json ()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname = content['newPersona']
#         personarule = "1 == 1"
#         # content['persona_description']

#         cur = mysql.connect ().cursor ()
#         cur.execute ("INSERT INTO persona(persona_name,persona_rule,persona_createdate) VALUES(%s,%s,CURDATE())",
#                      (personaname, personarule))
#         mysql.connect ().commit ()

#         cur.execute (
#             "select s.motion_id from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref ms on a.segment_id=ms.segment_segment_id join motion s on ms.motion_motion_id=s.motion_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "'AND s.motion_name='" + motionname + "'")
#         motionid = cur.fetchall ()

#         int1 = motionid[0]

#         cur.execute ("SELECT persona_id FROM persona ORDER BY persona_id DESC LIMIT 1")

#         personaid = cur.fetchall ()

#         int2 = personaid[0]

#         # Updating Xref Table

#         cur.execute ("INSERT INTO motion_persona_xref(motion_motion_id,persona_persona_id) VALUES (%s,%s)",
#                      (int1, int2))
#         mysql.connect ().commit ()


# class deletepersona (Resource):
#     def delete(self):
#         content = request.get_json ()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname = content['deletePersona']
#         cur = mysql.connect ().cursor ()
#         cur.execute (
#             "select persona_id from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on c.motion_id=b.motion_motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on e.persona_id=d.persona_persona_id where a.segment_name='" + segmentname + "' and c.motion_name='" + motionname + "' and e.persona_name='" + personaname + "' and u.email='" + username + "'")
#         rv = cur.fetchall ()
#         personaids = str (sum (rv, ()))

#         personaids_1 = personaids.replace ("L,)", ")")
#         personaids = personaids_1.replace (",)", ")")

#         cur.execute (
#             "SELECT feature_feature_id FROM persona_feature_xref WHERE persona_persona_id IN " + str (personaids))
#         rv = cur.fetchall ()
#         featureids = str (sum (rv, ()))
#         featureids_1 = featureids.replace ("L,", ",")
#         featureids = featureids_1.replace (",)", ")")

#         cur.execute (
#             "SELECT language_language_id FROM feature_language_xref WHERE feature_feature_id IN " + str (featureids))
#         rv = cur.fetchall ()
#         languageids = str (sum (rv, ()))
#         languageids_1 = languageids.replace ("L,)", ")")
#         languageids = languageids_1.replace (",)", ")")

#         cur.execute ("DELETE FROM motion_persona_xref WHERE persona_persona_id IN " + str (personaids))
#         mysql.connect ().commit ()

#         cur.execute ("DELETE FROM persona_feature_xref WHERE persona_persona_id IN " + str (personaids))
#         mysql.connect ().commit ()

#         cur.execute ("DELETE FROM persona WHERE persona_id IN " + str (personaids))
#         mysql.connect ().commit ()

#         if featureids == '()':
#             print ("hi")
#         else:
#             cur.execute ("DELETE FROM feature_language_xref WHERE feature_feature_id IN " + str (featureids))
#             mysql.connect ().commit ()
#             cur.execute ("DELETE FROM feature WHERE feature_id IN " + str (featureids))
#             mysql.connect ().commit ()
#             cur.execute ("DELETE FROM language WHERE language_id IN " + str (languageids))
#             mysql.connect ().commit ()
