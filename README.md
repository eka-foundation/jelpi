<h1 align="center">
  <br>
  <a href="http://eka.to"><img src="https://raw.githubusercontent.com/eka-foundation/home/master/images/eka_logo_white_bg_both.png" alt="Eka" width="350"></a>
  <br>
</h1>

<h3 align="center">A compassion based marketplace for asking and giving help.</h3>

<p align="center">
  
  <a href="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png">
    <img width=150px src="https://raw.githubusercontent.com/eka-foundation/home/master/images/by-sa.png" alt="License">
  </a>

</p>

<p align="center">
  <a href="#what">what?</a> •
  <a href="#how">how?</a> •
  <a href="#why">why?</a> •
  <a href="#install">Install</a> •
  <a href="https://medium.com/eka-foundation">Eka's blog</a> •
  <a href="http://eka.to">About Eka</a>
</p>
<hr>

### what?

Jelpi is a marketplace that bring together people who need help with people who want to help. For example, a person who is unable to leave their home might need groceries, whereas someone in the community who is going to grocery store anyway may want to help.

#### KEY FEATURES

ASK:

- request help (need groceries, supplies, or medicine)
- provide contact information
- wait for notification for match
- move to communicate in facebook messanger (requires login with facebook)

GIVE: 

- find suitable match from proximity sorted list of asks*
- move to communicate in facebook messanger (requires login with facebook)

*by next week we should already have GIVE preferences which allow to further refine the match list, and in two weeks from now in true matchmaking service that pops up matches as they become available and the fastest to respond gets it


### how? 

Jelpi is not a service, it is a platform that can rapidly deployed (TODO: single click AWS deployment) and customized for any purpose that involves mathing of help requests with help offers.

### why? 

Taking care of others is the basic principle of being a human; if we can afford helping someone in our community, by doing so, we are strengthening the community, and therefore also helping ourselves.

## Install

Currently the application is Flask based (TODO: move to AdonisJS). 

### With Conda

```
conda create -n karuna
conda activate karuna
pip3 install flask
```

### Without Conda

```
python3 -m venv venv
. venv/bin/activate
pip3 install flask
```

## Run

```
flask run
```
