@echo off
title Triv - github.com/William5553/triv
echo Starting..

:main
node index.js
echo Restarting in 5 seconds...
timeout /t 5 /nobreak
goto main