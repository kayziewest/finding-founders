const OWNER_EMAIL='ai@oysterskin.com';
const activities=['Games night','Potluck','Dinner','VC-founder roundtable','Coffee','Dancing','Walks','Sport','Film night','Making things'];
const topics=['Building a company','AI and technology','Design','Food','Music','Books and films','Life outside work','Money and fundraising'];
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
function owner(req){return req.headers.get('oai-authenticated-user-email')?.toLowerCase()===OWNER_EMAIL;}
function clean(s,n){return typeof s==='string'?s.trim().slice(0,n):'';}
function list(v,allowed,max=10){return Array.isArray(v)?[...new Set(v.filter(x=>allowed.includes(x)))].slice(0,max):[];}
function publicRecord(r){return {...r,activities:JSON.parse(r.activities),topics:JSON.parse(r.topics),dates:JSON.parse(r.dates),pairing:!!r.pairing};}
export function pairing(rows){let pairs=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const a=rows[i],b=rows[j];if(!a.pairing||!b.pairing)continue;const sharedActivities=a.activities.filter(x=>b.activities.includes(x));const sharedTopics=a.topics.filter(x=>b.topics.includes(x));const sharedDates=a.dates.filter(x=>b.dates.includes(x));if(!sharedActivities.length&&!sharedTopics.length)continue;if(a.dates.length&&b.dates.length&&!sharedDates.length)continue;const score=sharedActivities.length*3+sharedTopics.length*2+sharedDates.length*4+(a.vibe===b.vibe?1:0);pairs.push({a:{id:a.id,name:a.name},b:{id:b.id,name:b.name},sharedActivities,sharedTopics,sharedDates,score});}return pairs.sort((a,b)=>b.score-a.score).slice(0,80);}
export default {async fetch(request,env){const url=new URL(request.url);try{
 if(url.pathname.startsWith('/api/')){
  if(!env.DB)return json({error:'The guest list is unavailable. Please try again shortly.'},503);
  if(url.pathname==='/api/rsvp'&&request.method==='POST'){
   if(request.headers.get('Origin')!==url.origin)return json({error:'Please submit from the RSVP page.'},403);
   if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Use the RSVP form.'},415);
   const raw=await request.text();if(raw.length>12000)return json({error:'Your response is too long.'},413);
   let data;try{data=JSON.parse(raw)}catch{return json({error:'Please check your details.'},400)}
   if(data.website)return json({error:'Please try again.'},400);
   const name=clean(data.name,100),email=clean(data.email,180).toLowerCase(),dates=Array.isArray(data.dates)?[...new Set(data.dates)].slice(0,3):[];
   const today=new Date().toISOString().slice(0,10);
   if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:'Please add your name and a valid email.'},400);
   if(!dates.length||dates.some(x=>typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x)||x<today||Number.isNaN(Date.parse(x))))return json({error:'Choose at least one future date.'},400);
   const selected=list(data.activities,activities),interests=list(data.topics,topics);if(!selected.length)return json({error:'Pick at least one activity.'},400);
   if(data.consent!==true)return json({error:'Please agree to let the organisers save your response.'},400);
   const id=clean(data.id,60);if(!/^[a-f0-9-]{36}$/.test(id))return json({error:'Please reload the form and try again.'},400);
   // Retry-safe insertion. No client can use an existing ID to overwrite another guest.
   await env.DB.prepare('INSERT OR IGNORE INTO guests (id,name,email,dates,activities,topics,vibe,about,hopes,pairing,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(id,name,email,JSON.stringify(dates),JSON.stringify(selected),JSON.stringify(interests),clean(data.vibe,50),clean(data.about,350),clean(data.hopes,350),data.pairing===true?1:0,new Date().toISOString()).run();
   return json({ok:true,message:'You are on the list. We will use your dates and interests to plan a gathering. Your seat is confirmed when the organisers contact you.'},201);
  }
  if(url.pathname==='/api/admin/guests'&&request.method==='GET'){
   if(!owner(request))return json({error:'This guest list is for the organiser.'},403);
   const result=await env.DB.prepare('SELECT * FROM guests ORDER BY created_at DESC LIMIT 1000').all();const guests=result.results.map(publicRecord);return json({guests,pairs:pairing(guests)});
  }
  return json({error:'Not found'},404);
 }
 if(url.pathname==='/organiser'||url.pathname.startsWith('/organiser/')){if(!owner(request))return new Response('This page is for the event organiser.',{status:403});}
 return env.ASSETS.fetch(request);
 }catch(e){console.error('Request failed',e.message);return json({error:'We could not save that right now. Your answers are still here. Please try again.'},503);}}};
