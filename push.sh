#!/bin/bash
git fetch origin master
git checkout FETCH_HEAD -- style.css
sleep 5
git add .
git commit -m "🚀 $1"
git push origin master --force
