#!/bin/env python2
# -*- coding:utf-8 -*-
#    author    :   丁雪峰
#    time      :   2017-07-06 02:37:29
#    email     :   fengidri@yeah.net
#    version   :   1.0.1



import os
import sys
import json
import time
import stat
import shutil

import jinja2
import textohtml


def store_git():
    IDS = []
    lines = os.popen('git status store --porcelain').readlines()

    for line in lines:
        path = line[3:-1]
        if path.startswith("store/"):
            ID = path.split('/')[1]
            if ID.isdigit():
                IDS.append(ID)

    return list(set(IDS))


def op_list():
    IDS = store_git()
    for i in IDS:
        info = get_info(i)
        if info:
            print "%10s %s" % (info['id'], info['title'])



def update_info(ID):
    info_path = "store/%s/info" % ID
    index_path = "store/%s/index.mkiv" % ID
    if not os.path.isfile(index_path):
        print ("clear empty dir %s" % ID)
        os.system("rm -r store/%s" % ID)
        return None

    if os.path.isfile(info_path):
        info = open(info_path).read()
        info = json.loads(info)
    else:

        info = {}
        info["title"] = "draft"
        info["class"] = ""
        info["post"] = "1"

        t = os.stat(index_path)[stat.ST_CTIME]
        info['ctime'] = time.ctime(t)


    lines = open(index_path).readlines()
    if len(lines) > 10:
        lines = lines[0:10]


    for line in lines:
        if line[0] != '%':
            continue

        t = line[1:].split(':', 1)
        if len(t) != 2:
            continue

        key = t[0].lower().strip()
        value = t[1].strip().decode('utf8')
        info[key] = value

    open(info_path, 'w').write(json.dumps(info))
    return info

def get_info(i):
    info_path = "store/%s/info" % i

    if os.path.isfile(info_path) and i not in store_git():
        info = open(info_path).read()
        info = json.loads(info)
    else:
        info = update_info(i)
        if not info:
            return None

    t = time.strptime(info['ctime'], "%a %b %d %H:%M:%S %Y")
    info['timestamp'] = time.mktime(t)
    info['showtime'] = time.strftime("%Y-%m-%d", t)
    info['id'] = i

    return info




def create():
    root = os.getcwd()
    path = os.path.join(root, "store/%d" % int(time.time()))
    os.mkdir(path)

    return os.path.join(path, 'index.mkiv')


def get_infos():
    ids = os.listdir('store')
    infos = []


    for i in ids:
        if not i.isdigit():
            continue

        info = get_info(i)
        if info:
            post = info.get("post")
            if post == "0":
                continue
            infos.append(info)


    infos.sort(key = lambda x:x['timestamp'], reverse=True)

    return infos

def render():
    for i in store_git():
        src_path = "store/%s/index.mkiv" % i
        html_path = "store/%s/index.html" %i
        print "render html: %s" % html_path
        html = textohtml.html(src_path)
        open(html_path, 'w').write(html.encode('utf8'))


    template = open("web/index.html.sample").read().decode('utf8')
    template =  jinja2.Template(template)
    html = template.render(infos = get_infos())
    open("web/index.html", 'w').write(html.encode('utf8'))


def main():
    op = sys.argv[1]
    if op == 'new' or op == "create":
        new = create()
        os.system("vim %s -c 'read draft/template'" % new)
        return;

    if op == 'render':
        render()
        return

    if op == 'list':
        op_list()
        return

    if op == "post":
        render()
        os.system("git add *")
        os.system("git commit -m 'post blog'")
        os.system("git push")
        return


    if op.isdigit():
        index_path = "store/%s/index.mkiv" % op
        if os.path.isfile(index_path):
            os.system("vim %s" % index_path)
        else:
            print "ID:%s not exists." % op
        return

    print "do nothing"



if __name__ == "__main__":
    main()

