import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile);
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
/** Only explicitly inventoried canonical redirects may be followed, once. */
export function validateRedirect(original,destination,allowed){
 const from=new URL(original),to=new URL(destination);
 if(to.protocol!=='https:'||to.host!==from.host||to.username||to.password||!allowed.includes(to.href))throw new Error('Untrusted canonical redirect');
 return to.href;
}
/** Bounded, non-executing retrieval. No arbitrary redirect following. */
export async function retrieveDocument(url,output,extension,allowedRedirects=[]){
 const target=new URL(url);
 if(target.protocol!=='https:'||target.username||target.password||target.port||!['www.uiltexas.org','realignment.uiltexas.org','www.gocoyoteu.com','www.maxpreps.com'].includes(target.hostname))throw new Error('Untrusted retrieval URL');
 const retrievedAt=new Date().toISOString();
 const {stdout}=await execute('curl',['--fail','--silent','--show-error','--max-time','30','--max-filesize','10485760','--proto','=https','--output',output,'--write-out','{"httpStatus":%{http_code},"contentType":"%{content_type}","redirectURL":"%{redirect_url}"}',url],{encoding:'utf8',timeout:35000,maxBuffer:1048576});
 const metadata=JSON.parse(stdout);
 if([301,302,303,307,308].includes(metadata.httpStatus)){
  const canonical=validateRedirect(url,metadata.redirectURL,allowedRedirects);
  return {...await retrieveDocument(canonical,output,extension),originalURL:url};
 }
 if(metadata.httpStatus!==200)throw new Error(`Unexpected HTTP status ${metadata.httpStatus}`);
 const bytes=await readFile(output);
 if(extension==='pdf'&&!bytes.subarray(0,5).equals(Buffer.from('%PDF-')))throw new Error('Expected PDF signature');
 if(extension==='html'&&!metadata.contentType.includes('text/html'))throw new Error('Expected HTML');
 return {url,retrievedAt,...metadata,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
}
