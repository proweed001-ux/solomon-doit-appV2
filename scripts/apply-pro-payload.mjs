import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const root=process.cwd();
const chunkDir=path.join(root,".github/pro-payload");
const archive="/tmp/pro-followup.tar.gz";
const extract="/tmp/pro-followup-payload";
const encoded=fs.readdirSync(chunkDir).filter(name=>name.endsWith(".part")).sort().map(name=>fs.readFileSync(path.join(chunkDir,name),"utf8")).join("");
fs.writeFileSync(archive,Buffer.from(encoded,"base64"));
const sha=crypto.createHash("sha256").update(fs.readFileSync(archive)).digest("hex");
if(sha!=="6fb2ccf867429e90286d2c8e38bc0e01bde5cbf4e40be93f3ec2c6e0b50d6e9c") throw new Error(`Payload SHA mismatch: ${sha}`);
fs.rmSync(extract,{recursive:true,force:true}); fs.mkdirSync(extract,{recursive:true});
execFileSync("tar",["-xzf",archive,"-C",extract],{stdio:"inherit"});
for(const rel of ["dist/assets/pro/real-bills.js","dist/assets/pro/core.js","scripts/test-pro-real-bill-scale.mjs","tests/pro/pro-real-bill-scale.spec.mjs","package.json"]){
  const src=path.join(extract,rel),dst=path.join(root,rel); fs.mkdirSync(path.dirname(dst),{recursive:true}); fs.copyFileSync(src,dst);
}
fs.rmSync(extract,{recursive:true,force:true});
