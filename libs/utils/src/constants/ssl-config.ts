// import * as fs from 'fs';
// import { isLocal } from './env';
// export const httpsOptions = isLocal
//   ? null
//   : {
//       key: fs.readFileSync(process.env.PRIVATE_KEY),
//       cert: fs.readFileSync(process.env.FULL_CHAIN),
//     };
import * as fs from 'fs';
import { isLocal } from './env';

export const httpsOptions = isLocal
  ? null
  : (() => {
      const { PRIVATE_KEY, FULL_CHAIN } = process.env;

      if (!PRIVATE_KEY || !FULL_CHAIN || !fs.existsSync(PRIVATE_KEY) || !fs.existsSync(FULL_CHAIN)) {
        console.warn('SSL cert files not found. Falling back to HTTP.');
        return null;
      }

      return {
        key: fs.readFileSync(PRIVATE_KEY),
        cert: fs.readFileSync(FULL_CHAIN),
      };
    })();


    