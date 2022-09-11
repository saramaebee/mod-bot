# Not Just Your Average Mod Bot
Originally created to be used with the [CodeSupport](https://codesupport.dev) [Discord server](https://codesupport.dev/discord).

As our community grew, finding an effective way to track the moderation of our users became difficult. If people wanted to attempt to appeal a moderative action taken against them, we had to find out who took the actions and wait for them to be available to explain the context of the actions and come to a decision. 

We took a few actions to remedy this:
1. We started logging all deleted messages to a private channel
2. When moderators took action against a user, they would submit some details to a Google Form that would update another private channel

This has served us well since for nearly 2.5 years, but it can be quite a hassle. If you ban the user and delete messages, you then have to go to the audit log to copy the user information. Because the form asks for username and user ID, you typically have to switch back and forth between users. Plus, who wants to do paperwork?

This bot addresses the problem by taking advantage of the modals that Discord enables mod authors to use now. This bot uses a slash command/modal workflow to keep moderation of our Discord server IN Discord.

## Limitations
- Modals only allow so many fields
- Modals have two input types: text and select
  - Select inputs are not current supported by Discord.js, we'll need to submit manual API requests
