# -*- coding:utf-8 -*-
#    author    :   丁雪峰
#    time      :   2015-07-22 18:21:04
#    email     :   fengidri@yeah.net
#    version   :   1.0.1

import os
import json
import time
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
        except:
            continue
        Info[k.strip()] = v.strip()

    return Info

def getinfo_all(store):
    fs = os.listdir(store)
    infos = {}
    for f in fs:

        if not f.isdigit():
            continue

        path = os.path.join(store, f)
        if not os.path.isdir(path):
            continue

        info = getinfo(path)
        infos[int(f)] = info
    return infos

def tt():
    infos = json.load(open('index.json'))
    for info in infos:
        ID = info[0]
        ctime = info[3]
        path = "%s/info" % ID
        open(path, 'w').write("ctime: %s"% time.ctime(float(ctime)))

c = json.dumps(getinfo_all('.'))
open("index.json", 'w').write(c)

if __name__ == "__main__":
    pass

