## Gnosis Safe dashboard

If loaded in [Gnosis Safe](https://gnosis-safe.io) iframe, it uses Safe connector automatically and shows Safe address connected, Safe owners etc.

If loaded outside Gnosis Safe iframe, or disconnected from Safe, it retains the basic functionality of wallet/network selection and send transaction.

Deployed to https://gnosis-safe-dashboard-flax.vercel.app

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [safe-apps-sdk](https://github.com/safe-global/safe-apps-sdk)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [https://localhost:4000/](https://localhost:4000/) with your browser to see the outside-of-Gnosis-iframe version. Then go to your Gnosis Safe, Apps, add custom app, and paste in the url, i.e. `https://localhost:4000/` to see all functionality. Note its HTTPS rather than HTTP - SSL is required for Gnosis custom apps - so local Next.js port is mapped with [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy)