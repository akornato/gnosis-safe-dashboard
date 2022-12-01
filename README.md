## Gnosis Safe dashboard

This app allows to create a new Gnosis Safe, add/remove its owners, and execute both native and ERC20 token transfer transactions. If loaded in [Gnosis Safe](https://gnosis-safe.io) iframe, it detects Safe address automatically. If loaded outside of Gnosis Safe iframe, you need to enter Safe address manually (or create new one).

Deployed to https://gnosis-safe-dashboard-flax.vercel.app

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk) - to detect Safe address automatically when inside of Gnosis Safe iframe
- [Safe Core SDK](https://github.com/safe-global/safe-core-sdk) - to interact with the Safe contract e.g. add new owners

## Getting Started

- `yarn dev` starts the web app at [https://localhost:4000/](https://localhost:4000/). Note its HTTPS rather than HTTP - SSL is required for Gnosis custom apps - so local Next.js port is mapped with [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy). You can also go to your Gnosis Safe, Apps, add custom app, and paste in the same URL.
