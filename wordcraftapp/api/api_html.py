# -*- coding: utf-8 -*-
"""
Created on Thu Apr 12 06:26:10 2018

@author: anil
"""
import codecs
import copy
from bs4 import BeautifulSoup , Comment
import os

def htmlPreview (data):
    
    if "OPENSHIFT_APP_UUID" in os.environ:
        html_file = './app-root/repo/data/Email Security/template/Cisco_Email_Security_NLG_Template_v1.html'
    else:
        html_file = './data/Email Security/template/Cisco_Email_Security_NLG_Template_v1.html'

    file = codecs.open(html_file,'r','utf-8')
    soup = BeautifulSoup(file,"html.parser")

    # Adding Main heading and sub heading 

    main_heading = soup.find(id = "main_heading")
    cisco_img = main_heading.td
    text_heading = main_heading.td.find_next('td')
    text_heading.string = data['intromainheading']
    text_heading.append(soup.new_tag('br'))
    text_heading.append(soup.new_string(data['introsubheading']))

        
    #Adding Customer name in email
    customer_name = soup.find(id = 'customername')

    customer_name.td.string.replace_with('\r\n\t\t\t\tHi {},\r\n'.format(data['first_name']))
        
    # Finding introtext in html
    introtext_1 = soup.find(id = 'introtext1')


    # Replacing introtext with data
    introtext1 = {k:v for k,v in data.items() if k.startswith("introtext1")}

    i = 0       
    for key,value in sorted(introtext1.items()):
        if(i == 0):
            introtext_1.string = value
            i = i+1
        else:
            introtext_1.append(soup.new_tag('br'))
            introtext_1.append(soup.new_string(value))

    # Finding recommendation link in html
    r_link = soup.find(id = 'recommendation')

    r_link['href'] = data['recommendationlink']


    # Finding introtext in html
    introtext_2 = soup.find(id = 'introtext2')

    # Replacing Second introtext with data
    introtext2 = {k:v for k,v in data.items() if k.startswith("introtext2")}
           
    i = 0       
    for key,value in sorted(introtext2.items()):
        if(i == 0):
            introtext_2.string = value
            i = i+1
        else:
            introtext_2.append(soup.new_tag('br'))
            introtext_2.append(soup.new_string(value))      

    # Replacing status icon for feautres

    sicon = soup.find(id = "statusicon")
    # print(sicon)

    sicon.img['src'] = data['statusicon']

    #Replacing 2nd main heading

    heading2main = soup.find (id ="heading2main")

    heading2main.string = data['headingtwomain']

    heading2sub = soup.find (id = "heading2sub")

    heading2sub.string = data['heading2sub']

    #Updating features details

    features = soup.find(id = "features_status")

    features_text = {k:v for k,v in data.items() if k.startswith("feature") & k.endswith("text")}

    new_tag = {}
    j = 1
    
    for i in range(1,len(features_text)+1):
        
        
        if features_text['feature{}text'.format(i)] != '':

            new_tag["feature{}".format(j)] = copy.copy(features.tr)
            
            new_tag["feature{}".format(j)].td.string = features_text['feature{}text'.format(i)]       
            new_tag["feature{}".format(j)].img['src'] = data['feature{}statusimg'.format(i)]
            j+=1

    features.tbody.clear()
    # features.decompose()

    print("length of new_tag",len(new_tag))
    if (len(new_tag) == 0) :
        features.decompose()
    else:
        for k in range(1,len(new_tag)+1):
            features.tbody.append( Comment("LICENSE STATUS " + str(k)))
            features.tbody.append(new_tag["feature{}".format(k)])
            features.tbody.append( Comment("LICENSE STATUS END " + str(k)))
        # for key,value in new_tag.items():
        #     print("came here")
        #     features.tbody.append( Comment("LICENSE STATUS FOR " + str(key)))
        #     features.tbody.append(value)
        #     features.tbody.append( Comment("LICENSE STATUS END FOR" + str(key)))
            
    #Activation link
    activation_link = soup.find(id = "activationlink")


    if (data['clicktoactivatelink'] == '') :
        activation_link.decompose()
    else:
        activation_link['href'] = data['clicktoactivatelink']

    # Contact details

    heading3 = soup.find(id = "heading3main")

    heading3.strong.string = data['heading3main']

    text3 = soup.find (id = "text3")

    text3.string = data['textbox3'] 

    outtext = soup.find(id = "outrotext")

    outtext.string = data['outrotext']

    html_content = soup.prettify()

    return html_content
        
