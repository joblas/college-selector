#!/bin/bash
export PYTHONPATH=/home/lurkr-bot/.mempalace_venv/lib/python3.12/site-packages:$PYTHONPATH
cd /home/lurkr-bot/Projects/college-selector
exec /home/lurkr-bot/.mempalace_venv/bin/python3 mempalace_api.py