As you can see, there is no documentation...

`user@computer:~/ . venv/bin/activate` is what I use to run the venv

and then from the project directory, run `flask run`

There are a few dependencies which are already part of the repo which will need proper declaration in a requirements.txt file once packaging happens.

Requirements (so far)
1. flask (and whatever it pulls in)
2. sqlalchemy
3. wheel
4. flask-wtf (not used currently, but we will in the near future)

This is a python3 project. 
