import fs from 'node:fs';
import path from 'node:path';

const base='/finding-founders';
const out='_site';
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync('src/public',out,{recursive:true});
fs.rmSync(path.join(out,'organiser'),{recursive:true,force:true});
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(out)){
 if(!/\.(html|css|js)$/.test(file))continue;
 let s=fs.readFileSync(file,'utf8');
 if(file.endsWith('.html'))s=s.replaceAll('/assets/people.css','/assets/people.css?v=mobile-20260918');
 s=s.replaceAll('https://finding-founders.ai-f0dc.chatgpt.site','https://kayziewest.github.io/finding-founders');
 if(file.endsWith('.html'))s=s.replace(/((?:href|src|poster|action)=["'])\/(?!\/)/g,`$1${base}/`);
 else if(file.endsWith('.js'))s=s.replace(/(["'`])\/(?=(?:assets|rsvp|api|activities|gatherings|notes|about|founders-fridays)(?:\/|["'`]))/g,`$1${base}/`);
 s=s.replace(/url\(\/(?!\/)/g,`url(${base}/`);
 if(file.endsWith('people.js'))s=s.replace('if(form){','if(form&&!form.dataset.emailRsvp){');
 if(file.endsWith('rsvp/index.html')){
  s=s.replace('id="guest-form"','id="guest-form" data-email-rsvp="true" action="https://formsubmit.co/ai@oysterskin.com" method="POST"');
  s=s.replace('name="website"','name="_honey"');
  s=s.replace('<form class="ff-form"', '<p class="ff-form-note">Your answers go to the organisers by email through FormSubmit.</p><form class="ff-form"');
  s=s.replace('</form>',`<input type="hidden" name="_subject" value="Finding Founders — new RSVP"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="https://kayziewest.github.io/finding-founders/thanks/"></form>`);
  s=s.replace('</body>',`<script src="${base}/assets/email-rsvp.js" defer></script></body>`);
  s=s.replace('Your details stay with the organisers.','Your answers are sent to the organisers by email through FormSubmit.');
 }
 fs.writeFileSync(file,s);
}
fs.writeFileSync(`${out}/assets/email-rsvp.js`,`document.addEventListener('DOMContentLoaded',()=>{const form=document.getElementById('guest-form');if(!form)return;form.querySelectorAll('input[type=date]').forEach(x=>x.min=new Date().toISOString().slice(0,10));form.addEventListener('submit',e=>{const f=new FormData(form),status=document.getElementById('form-status');if(!f.getAll('activity').length){e.preventDefault();status.textContent='Pick at least one activity you would enjoy.';status.focus();return;}for(const [key,label] of [['date','Preferred dates'],['activity','Activities'],['topic','Shared interests']]){const hidden=document.createElement('input');hidden.type='hidden';hidden.name=label;hidden.value=f.getAll(key).filter(Boolean).join(', ');form.append(hidden);form.querySelectorAll('[name="'+key+'"]').forEach(x=>x.removeAttribute('name'));}const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Sending your RSVP…';});});`);
fs.mkdirSync(`${out}/thanks`,{recursive:true});
fs.writeFileSync(`${out}/thanks/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>See you soon · Finding Founders</title><style>body{margin:0;background:#f2eee6;color:#211d19;font-family:Arial,sans-serif;min-height:100vh;display:grid;place-items:center}main{max-width:640px;padding:36px}h1{font-size:clamp(48px,8vw,88px);letter-spacing:-.06em;line-height:1}p{font-size:20px;line-height:1.5}a{display:inline-block;background:#a72b24;color:white;padding:18px 28px;border-radius:40px;text-decoration:none}</style><main><p>FINDING FOUNDERS · FOUNDERS FRIDAYS</p><h1>Glad you're coming.</h1><p>Your RSVP has been sent. We'll email you to confirm a date and share the details.</p><p>Until then, think about who you're bringing to the games table.</p><a href="${base}/">Back to the good stuff ↗</a></main></html>`);
fs.writeFileSync(`${out}/.nojekyll`,'');
console.log('GitHub Pages site built with email RSVP.');
