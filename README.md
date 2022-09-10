## Gnosis Safe dashboard

If loaded in [Gnosis Safe](https://gnosis-safe.io) iframe, it detects Safe address automatically. If loaded outside Gnosis Safe iframe, it retains the basic functionality of wallet/network selection.

Deployed to https://gnosis-safe-dashboard-flax.vercel.app

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk) - to get Safe address automatically when inside of Gnosis Safe iframe
- [Safe Core SDK](https://github.com/safe-global/safe-core-sdk) - to interact with the Safe contract i.e. add new owners

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [https://localhost:4000/](https://localhost:4000/) with your browser to see the outside-of-Gnosis-iframe version. Then go to your Gnosis Safe, Apps, add custom app, and paste in the url, i.e. `https://localhost:4000/` to see all functionality. Note its HTTPS rather than HTTP - SSL is required for Gnosis custom apps - so local Next.js port is mapped with [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy)