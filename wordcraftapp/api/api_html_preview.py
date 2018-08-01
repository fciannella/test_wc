# -*- coding: utf-8 -*-
"""
Created on Mon Jun  4 04:00:37 2018

@author: anil
"""

import codecs
from bs4 import BeautifulSoup
import re
import os

def html_preview(data, template):
    print("data",data)

    # if campaignname == 'Digital Revolution - Ransomware' or campaignname == 'Test Campaign':
    #     if "OPENSHIFT_APP_UUID" in os.environ:
    #         html_file = './app-root/repo/data/Digital Revolution - Ransomware/template/Cisco_Ransomware_with_Tags.html'
    #     else:
    #         html_file = './data/Digital Revolution - Ransomware/template/Cisco_Ransomware_with_Tags.html'
    # elif campaignname == 'Email Security':
    #     if "OPENSHIFT_APP_UUID" in os.environ:
    #         html_file = './app-root/repo/data/Email Security/template/Cisco_Email_Security_With_Tags.html'
    #     else:
    #         html_file = './data/Email Security/template/Cisco_Email_Security_With_Tags.html'

    # file = codecs.open(html_file,'r','utf-8')
    # soup = BeautifulSoup(file,"html.parser")

    html_string = template

    match = re.findall(r"{TAG:.*?}",html_string ,re.I)
    print(len(match))

    no_data_tags = []
    all_html_tags =[]
    no_html_tags = []
    for tag in match:
        tag_name = re.search(r"{TAG:\s?(.*?)}",tag).group(1)
        all_html_tags.append(tag_name.lower())
        data = { k.lower() : v for k,v in data.items() }

        if tag_name.lower() in data:
#==============================================================================
#             print("found",tag_name)
#             print("replacing",data[tag_name.lower()])
#==============================================================================
            html_string = html_string.replace(tag,data[tag_name.lower()])
        else:
            no_data_tags.append(tag_name)
    for key in data:
        if key.lower() not in all_html_tags :
            no_html_tags.append(key)
#    no_html_tags = [tag if tag.lower() not in all_html_tags for tag in data.keys()]
#==============================================================================
#     print("not data tags",no_data_tags)
#     print("not html tags",no_html_tags)
#     print("all html tags",all_html_tags)
#==============================================================================
    print(len(no_html_tags))
#    print(soup)
#    print(html_string)

    final = {'html_preview':html_string, 'unknown_tags_in_html': no_data_tags , 'unused_tags_in_data': no_html_tags}

    return final


#data = {'NextGen_Icon': 'changed', 'Sub_Head_3_Icon': 'changed', 'AmpEmail_Status': 'changed', 'Recommendation_Icon': 'changed', 'Sub_Head_3_Text': 'changed', 'AnyConnect_Status': 'changed', 'ThreatGrid_Icon': 'changed', 'Umbrella_Icon': 'changed', 'ThreatGrid_Link': 'changed', 'Sub_Closing': 'changed', 'ThreatGrid_Status': 'changed', 'AmpEmail_Icon': 'changed', 'AnyConnect_Link': 'changed', 'Learn_More_Button_Icon': 'changed', 'Sub_Head_4_Text': 'changed', 'Copy_Block_4': 'changed', 'Umbrella_Link': 'changed', 'Renew_Button_Link': 'changed', 'Copy_Block_3_1': 'changed', 'Copy_Block_3_2': 'changed', 'Learn_More_Button_Link': 'changed', 'COPY_BLOCK_1': 'changed', 'NextGen_Link': 'changed', 'AmpEmail_Link': 'changed', 'NextGen_Status': 'changed', 'Umbrella_Status': 'changed', 'Renew_Button_Icon': 'changed', 'AnyConnect_Icon': 'changed'}
#data = {'copy_block_3_1': "Great news! Your next contract doesn't expire for a while. We'll let you know when products are coming up for renewal, but for now, you're good to go.", 'umbrella_link': '', 'sub_head_1': 'Your Current Protection', 'threatgrid_link': '', 'nextgen_status': 'Status: Active', 'sub_head_4_text': "What's Next?", 'sub_closing': 'Sincerely, Your Ransomware Team ', 'sub_head_3_text': 'Are you up to date?', 'copy_block_4_1': "You have features to guard against ransomware and other threats, but we recommend that you bulk up your defenses. And there's a fast way to do so.", 'ampend_status': 'Learn More ', 'copy_block_1': "Cisco's Ransomware Security Suite is made up of six features that work together for robust protection against ransomware and similar threats. Read on for a quick snapshot of your current features, upcoming renewals, and easy recommendations for upping your defense.", 'recommendation_icon': '', 'anyconnect_status': 'Learn More', 'copy_block_3_2': 'ADD CONTEXT HERE!', 'nextgen_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7B79b714fb-0801-4d1f-928a-31a8ef688f7c%7D_nlg_icon_ngfw.png', 'ampemail_status': 'Learn More', 'threatgrid_status': 'Learn More', 'recommendation_link': 'Generic Lookbook', 'anyconnect_link': '', 'ampemail_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7B76fff394-e104-41f2-9d07-4c34880f1e3f%7D_nlg_icon_ampemail_gray.png', 'umbrella_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7B41dfa9c9-895a-41a7-a1ba-928b6c3b333a%7D_nlg_icon_umbrellas_gray.png', 'renew_button_icon': '', 'umbrella_status': 'Learn More', 'ampemail_link': '', 'ampend_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7Ba0931119-acd5-4f18-9810-4dceed5f4f66%7D_nlg_icon_ampendpoints_gray.png', 'sub_head_3_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7Bf494b26e-fde8-436c-ad0c-5c3e04e4169c%7D_nlg_icon_next.png', 'threatgrid_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7Ba6a7f8f5-65f9-4091-b6d6-4780b7695e33%7D_nlg_icon_threatgrid_gray.png', 'learn_more_button_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7Bb8068d75-16ef-4ad8-ad9a-971664d000aa%7D_nlg_btn_features1.png ', 'copy_block_4_2': 'Cisco Ransomware Defense Quick Prevention uses quick-to-deploy cloud-based services to defend the edges of your network, so nothing gets to the core. Check out Cisco Umbrella, AMP for Email, and AMP for Endpoints to learn more.', 'renew_button_link': '', 'anyconnect_icon': 'http://images.response.cisco.com/EloquaImages/clients/CiscoSystems/%7B7a7b6659-5b1f-45cf-9b57-650db7cde393%7D_nlg_icon_anyconnect_gray.png', 'nextgen_link': '', 'ampend_link': '', 'header': 'Ransomware Defense Snapshot', 'learn_more_button_link': 'Link to product page'}
#html_preview(data)
