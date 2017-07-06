all:



render:
	@python2 bin/blog.py

create:
	@python2 bin/blog.py new


list:
	@python2 bin/blog.py list


post:
	@python2 bin/blog.py
	@git commit -a -m 'post blog'
	@git push aliyun
	@git push
