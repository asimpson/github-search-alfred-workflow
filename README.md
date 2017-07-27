This workflow is a thin 🍬 wrapper around https://api.github.com/orgs/:orgname/members.

It lists all the org 👥 members and optionally tries to do some basic 🔍 searching.

📦 Download the latest version from the [releases section](https://github.com/asimpson/github-search-alfred-workflow/releases/).

## 💪 Usage
- Hitting `enter` on a returned name will copy the formatted name, e.g. `@asimpson`, to your clipboard.
- Holding `⌥ (alt)` and hitting `enter` will launch that user's Github profile.
- Hitting `⇧ (shift)` will quicklook that user's avatar.

## ✅ Requirements
- [ ] Obtain a Github token. Personal access tokens work great!
You'll want at least these permissions `read:org, user`.
https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
- [ ] Fill in your organization name, e.g. `sparkbox`, and new token in the variables section of the workflow preferences.
![](https://files.adamsimpson.net/Napkin%2007-27-17%2C%209.58.30%20AM.png)
- [ ] Have node installed at this path `/usr/local/bin/node`.
