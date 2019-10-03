[![standard-readme compliant](https://img.shields.io/badge/Project-NZB%20CLoud%20|%20Frontend-green.svg?style=flat-square)]()

## Initial install

`sudo apt-get install nodejs npm nodejs-legacy`

If your system does not have `nodejs-legacy` package, create symlink `sudo ln -s /usr/bin/nodejs /usr/bin/node`

## Install

```bash
$ git clone https://{{Username}}@bitbucket.org/jantonk/nzbcloud-spa-frontend.git
$ cd nzbcloud-spa-frontend
$ npm install
```
### Run project

For Development:

Go to project folder and run project with the following command:
```bash
$ npm start
```

For Production:

Before run project we need change some configs:
```bash
$ nano nzbcloud-spa-frontend/client/src/app/configs/global.config.ts (set true for production config)
```
After that go to project folder and run project with the following command:
```bash
$ npm run build
```

