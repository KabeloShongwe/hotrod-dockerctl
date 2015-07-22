Hotrod-Dash
============

Hotrod Dashboard seed project. Includes dashboards, API endpoints and a background job that work with the default ElasticSearch stats endpoint.

## Overview

Hotrod Dash is a configurable dashboard app for presenting and filtering data served from a backend API.

The dashboard is an Angular app using d3 charts for graphs and with filtering inspired by [Kibana](https://github.com/elastic/kibana). (_Hint: use the ESC key to quickly toggle the filter_)

The backend is a Node API which provides out of the box libraries for working with an ElasticSearch backend (but you can easily swap that out). It also includes a simple 'job' infrastructure to allow running lightweight background jobs.

### Authentication

Users login to the dashboard using an authentication service based on JSON Web Tokens (JWT). The [Hotrod Auth](https://github.com/panoptix-za/hotrod-auth) service provides an LDAP-backed JWT authentication server.

## Seed App

This repo contains a seed app structure which you can clone and follow to create your own dashboards.

It includes a [background job](src/api/jobs/serverStatsJob.js) which periodically queries the ElasticSearch `/_nodes/stats` endpoint and stores the results back in ElasticSearch in a `serverstats` index. As a result, when you start the app it may take a little but of time for data to be populated in ElasticSearch  - so you may not see any dashboard results immediately.

## Setup

1. Ensure you have an instance of the [Hotrod Auth](https://github.com/panoptix-za/hotrod-auth) JWT service running. 
Follow the repo link for setup instuctions. Make a note of the `SIGNING_SECRET` you use.

2. Clone this repo:
 
   ```
  git clone https://github.com/panoptix-za/hotrod-dash.git
  ```

3. In the root folder, run:

  ```
  bower install
  npm install
  ```

4. Copy the `/src/config/local.yml.example` to `/src/config/local.yml` and edit as follows:

  * `SIGNING_SECRET` should match that used in the `Hotrod-Auth` project you set up earlier
  * Optionally add an `ELASTICSEARCH` entry to override the default ElasticSearch location of `localhost:9200` which is set up in the `default.yml` file

5. Ready to rumble! Launch app with:

  ```
  npm start
  ```
  
6. By default the app runs on port 3000 (override with `PORT` environemnt variable), so browse to:

  ```
  http://localhost:3000
  ```
  
7. As mentioned in the [Seed App](#seed-app) section, it will take a little time for demo data to be populated so you may not see any results initially.

# License

The MIT License (MIT)

Copyright (c) Panoptix CC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
