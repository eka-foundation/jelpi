<h1 align="center">
  <br>
  <a href="http://eka.to"><img src="https://github.com/eka-foundation/jelpi/blob/master/jelpi_logo.svg" alt="Jelpi" width="200"></a>
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

### how?

Jelpi is not a service, it is a platform that can rapidly deployed (TODO: single click AWS deployment) and customized for any purpose that involves mathing of help requests with help offers.

### why?

Taking care of others is the basic principle of being a human; if we can afford helping someone in our community, by doing so, we are strengthening the community, and therefore also helping ourselves.

### Key Features

ASK:

- request help (need groceries, supplies, or medicine)
- provide contact information
- wait for notification for match
- move to communicate in facebook messanger (requires login with facebook)

GIVE:

- find suitable match from proximity sorted list of asks*
- move to communicate in facebook messanger (requires login with facebook)

*by next week we should already have GIVE preferences which allow to further refine the match list, and in two weeks from now in true matchmaking service that pops up matches as they become available and the fastest to respond gets it

GENERAL:

It must take no longer than 10-minute without computer savvy to change the look and feel, language, and logo of the application. We're not building a service, but a "kit" for those that want to provide service.

## Setup

Application is based on [AdonisJS](https://adonisjs.com/)

First install all dependencies:

```bash
npm install
```

Then copy `.env.example` to `.env` and set some secure `APP_KEY` in `.env` file

## Run

For dev mode with auto restart:

```bash
npx adonis serve --dev
```

For production:

```bash
node server.js
# or
npm run start
```
