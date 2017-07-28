'use strict';
const qs = require('querystring');
const fs = require('fs');
const fetch = require('node-fetch');
const dateFns = require('date-fns/difference_in_minutes');

let store = [];
let page = 1;

const cacheIsFresh = () => {
  const lastRun = JSON.parse(fs.readFileSync('timestamp.json').toString());
  const diff = dateFns(Date.now(), lastRun.time) < 120 ? true : false;
  return diff;
};

const parseLink = link => {
  return link
    .replace('>', '')
    .split(',')
    .filter(x => x.indexOf('next') !== -1)
    .map(x => qs.parse(x.split(';')[0], '?'))[0];
};

const getUsers = page =>
  new Promise((resolve, reject) => {
    if (page) {
      fetch(
        `https://api.github.com/orgs/${process.env
          .orgName}/members?page=${page}`,
        {
          headers: {
            Authorization: `token ${process.env.githubToken}`,
          },
        }
      )
        .then(x => {
          const link = x.headers.get('link');
          const hasNext = link.indexOf('next') !== -1;
          page = hasNext ? parseLink(link).page : false;
          return x.json();
        })
        .then(x => store.push(x) && resolve(getUsers(page)));
    } else {
      resolve();
    }
  });

const displayList = () => {
  const name = process.argv[2];
  const result = JSON.parse(fs.readFileSync('data.json').toString());
  let resultList = name
    ? result.filter(x => x.login.indexOf(name) !== -1)
    : result;
  const items = {
    items: resultList.map(x => {
      return {
        title: x.login,
        arg: `@${x.login}`,
        quicklookurl: x.avatar_url,
        subtitle: `copy @${x.login} to clipboard`,
        mods: {
          alt: {
            arg: x.html_url,
            subtitle: `visit ${x.html_url}`,
          },
        },
      };
    }),
  };

  console.log(JSON.stringify(items));
};

if (!process.env.githubToken || !process.env.orgName) {
  const error = {
    items: [
      {
        subtitle: 'Go to preferences now',
        title: 'Please add an API token and org name to the workflow',
        arg: 'pref',
      },
    ],
  };

  console.log(JSON.stringify(error));
} else if (cacheIsFresh()) {
  displayList();
} else {
  getUsers(page).then(() => {
    const data = store.reduce((a, x) => a.concat(x), []).map(x => {
      return {
        login: x.login,
        avatar_url: x.avatar_url,
        html_url: x.html_url,
      };
    });
    fs.writeFileSync('data.json', JSON.stringify(data));
    fs.writeFileSync('timestamp.json', JSON.stringify({ time: Date.now() }));
    displayList();
  });
}
