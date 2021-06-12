@echo off
title Triv - github.com/William5553/triv
echo Starting..

:main
node index.js
echo Restarting...
timeout /t 5 /nobreak
goto main