# -*- coding:utf-8 -*-
#    author    :   丁雪峰
#    time      :   2014-11-14 22:05:50
#    email     :   fengidri@yeah.net
#    version   :   1.0.1

# 本模块只提供blog 信息的数据修改, 并不提供读取分析功能

import os
from cottle import  handle
import json
import time
import shutil

path = __file__
if path.endswith('.pyc'):
    path = path[0:-1]
print "__file__: ", path
print "realpath: ", os.path.realpath(__file__)
STOREPATH = os.path.join(os.path.dirname(os.path.realpath(path)), 'store')
print "STOREPATH: ", STOREPATH

def getv(line):
    tmp = line[1:].split(':', 1)
    if len(tmp) < 2:
        return []
    return [tmp[0].strip().lower(), tmp[1].strip()]


def getinfo(path):
    mkiv = os.path.join(path, "index.mkiv")
    info = os.path.join(path, "info")
    Info = {}
    for line in open(mkiv).readlines():
        if len(line) < 2 or line[0] != '%':
            break
        try:
            k,v = getv(line)
            Info[k] = v
        except:
            pass

    for line in open(info).readlines():
        try:
            k, v = line.split(':', 1)
            k = k.strip()
            v = v.strip()
        except:
            continue
        Info[k] = v

    return Info


################################################################################
name = 'fwikiapi'
urls = (
    '/chapters',       'chapters',
    '/chapters/(\d+)', 'chapter',
    '/refresh',        'Refresh',
    '/msg',            'msg',

        )



def update(s_id, tex, html):
    dir_path = os.path.join(STOREPATH, s_id)
    index_path = os.path.join(STOREPATH, 'index.json')

    fp = os.path.join(dir_path, 'index.mkiv')
    open(fp, 'wb').write(tex.encode('utf8'))

    fp = os.path.join(dir_path, 'index.html')
    open(fp, 'wb').write(html.encode('utf8'))


    index = json.load(open(index_path))

    index[s_id] = getinfo(dir_path)

    content_index = json.dumps(index)
    open(index_path, 'w').write(content_index)

def refresh():
    store = STOREPATH
    fs = os.listdir(store)
    infos = {}
    for f in fs:
        if not f.isdigit():
            continue

        path = os.path.join(store, f)
        if not os.path.isdir(path):
            continue

        info = getinfo(path)
        infos[f] = info

    index_path = os.path.join(STOREPATH, 'index.json')
    content_index = json.dumps(infos)
    open(index_path, 'w').write(content_index)

class Refresh(handle):
    def GET(self): #刷新index.json
        refresh()


class chapters(handle):
    def POST(self):
        tex      = self.forms.get('tex')
        html     = self.forms.get('html')

        ctime = time.time()

        # 生成 ID
        i_id = int(ctime) - 1416010575
        s_id = str(i_id)

        # 检查目录, 生成目录
        dirpath = os.path.join(STOREPATH, s_id)
        if os.path.isdir(dirpath):
            return -2#duplie path

        try:
            os.mkdir(dirpath)
        except:
            return  -3

        # 写和 info 信息
        info_path = os.path.join(dirpath, 'info')
        open(info_path, 'w').write("ctime: %s" % time.ctime())

        update(s_id, tex, html)

        return i_id

class chapter(handle):
    def PUT(self):
        s_id = self.params[0]
        tex  = self.forms.get('tex')
        html = self.forms.get('html')

        dirpath = os.path.join(STOREPATH, s_id)
        if not os.path.isdir(dirpath):
            return -404 #duplie path

        update(s_id, tex, html)

        return s_id

    def DELETE(self):
        s_id = self.params[0]
        dirpath = os.path.join(STOREPATH, s_id)
        shutil.rmtree(dirpath)
        refresh()


