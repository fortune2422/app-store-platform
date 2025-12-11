// backend/lib/dnsCheck.js
const dns = require("dns").promises;

/**
 * checkCnamePointingToR2
 * - domain: 'dl.example.com' or 'example.com'
 * - r2TargetSubstr: a substring of the R2 account endpoint (like 'r2.cloudflarestorage.com' or the exact target)
 *
 * returns: { ok: boolean, message: string, cname?: string[] }
 */
async function checkCnamePointingTo(domain, r2TargetSubstr) {
  try {
    // try CNAME first
    const cnames = await dns.resolveCname(domain).catch(() => null);
    if (cnames && cnames.length) {
      const matched = cnames.some((c) => c.includes(r2TargetSubstr));
      return {
        ok: matched,
        message: matched
          ? `CNAME points to ${r2TargetSubstr}`
          : `CNAME exists but does not point to ${r2TargetSubstr}. Found: ${cnames.join(", ")}`,
        cname: cnames
      };
    }

    // if no CNAME, also check A record as fallback
    const as = await dns.resolve4(domain).catch(() => null);
    if (as && as.length) {
      return { ok: false, message: `Domain has A records (${as.join(", ")}). R2 custom domain normally requires a CNAME to R2 target.` };
    }

    return { ok: false, message: "No CNAME or A records found for domain." };
  } catch (err) {
    return { ok: false, message: `DNS check failed: ${err.message}` };
  }
}

module.exports = {
  checkCnamePointingTo
};
