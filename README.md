This is a [Gnosis Safe](https://gnosis-safe.io) custom app, deployed to https://gnosis-safe-dashboard-flax.vercel.app

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

Open [https://localhost:4000/](https://localhost:4000/) with your browser to see the result. Withouth Gnosis you can connect to wallets/networks and that's it.

For full functionality, go to your Gnosis Safe, Apps, add custom app, and paste in the url, i.e. `https://localhost:4000/` (note the HTTPS rather than HTTP - SSL is required for Gnosis custom apps). You'll then see your Gnosis Safe owner addresses, replaced with ENS names if available.