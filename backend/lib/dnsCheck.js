// backend/lib/dnsCheck.js
const dns = require("dns").promises;

/**
 * 检查指定域名的 TXT 记录是否包含 token
 * @param {string} domain - 用户域名，如 example.com
 * @param {string} token - 验证 token（我们要求用户把 token 放在 TXT _appstore-verification.domain）
 * @returns {Promise<{ok:boolean, details:string}>}
 */
async function checkTxtToken(domain, token) {
  // 我们建议用户把 TXT 记录放在 _appstore-verification.<domain>
  const txtHost = `_appstore-verification.${domain}`;
  try {
    const records = await dns.resolveTxt(txtHost);
    // records is array of arrays of strings
    const flat = records.flat().join(" ");
    const ok = flat.includes(token);
    return { ok, details: `TXT ${txtHost} => ${JSON.stringify(records)}` };
  } catch (err) {
    return { ok: false, details: `TXT lookup error: ${err.code || err.message}` };
  }
}

/**
 * 可选：检查 domain 是否 CNAME 指向我们提供的目标（如果你想用 CNAME 验证）
 * @param {string} domain
 * @param {string} expectedTarget
 */
async function checkCname(domain, expectedTarget) {
  try {
    const cnames = await dns.resolveCname(domain);
    const ok = cnames.some(c => c === expectedTarget || c.endsWith(expectedTarget));
    return { ok, details: `CNAME => ${JSON.stringify(cnames)}` };
  } catch (err) {
    return { ok: false, details: `CNAME lookup error: ${err.code || err.message}` };
  }
}

module.exports = {
  checkTxtToken,
  checkCname
};
