#!/bin/bash

#GIT uses its own port of the bash shell for windows, so the script uses bash and *nix-ish constructs
#       i.e. file/paths/like/this   NOT\like\this

if [ -a .commit ]
	then
	rm .commit
	git add build/*
	git add doc/*
	git commit --amend -C HEAD --no-verify
fi
