# -*- coding:utf-8 -*-
#    author    :   丁雪峰
#    time      :   2017-07-06 02:37:29
#    email     :   fengidri@yeah.net
#    version   :   1.0.1



import os
import json
import time

import jinja2


def get_infos():
    ids = os.listdir('store')
    infos = []


    for i in ids:
        info_path = "store/%s/info" % i
        if not os.path.isfile(info_path):
            continue

        info = open(info_path).read()
        info = json.loads(info)

        t = time.strptime(info['ctime'], "%a %b %d %H:%M:%S %Y")
        info['timestamp'] = time.mktime(t)
        info['showtime'] = time.strftime("%Y-%m-%d", t)
        info['id'] = i
        infos.append(info)


    infos.sort(key = lambda x:x['timestamp'], reverse=True)

    return infos



template = open("web/index.html.sample").read().decode('utf8')
template =  jinja2.Template(template)
html = template.render(infos = get_infos())
open("web/index.html", 'w').write(html.encode('utf8'))
