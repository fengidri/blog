all:



render:
	@python2 bin/blog.py render

create:
	@python2 bin/blog.py new


list:
	@python2 bin/blog.py list


post:
	@python2 bin/blog.py render
	@git add *
	@git commit -m 'post blog'
	@git push aliyun
	@git push
