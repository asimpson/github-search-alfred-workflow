'use strict';

const api = require('child_process').spawnSync('curl', [
  '-u',
  `username:${process.env.githubToken}`,
  `https://api.github.com/orgs/${process.env.orgName}/members`,
]);
const name = process.argv[2];
const result = JSON.parse(api.stdout.toString());
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

if (process.env.githubToken) {
  console.log(JSON.stringify(items));
} else {
  const error = {
    items: [
      {
        subtitle: 'Go to preferences now',
        title: 'Please add an API token to the workflow',
        arg: 'pref',
      },
    ],
  };

  console.log(JSON.stringify(error));
}
