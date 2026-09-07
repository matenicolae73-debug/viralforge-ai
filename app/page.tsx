"use client"
import {useMemo, useState} from "react"

export default function Home(){
 const [prompt,setPrompt]=useState("A cinematic premium energy drink commercial on a futuristic city rooftop at golden hour")
 const [resolution,setResolution]=useState("720p"),[aspect,setAspect]=useState("16:9"),[duration,setDuration]=useState(5)
 const [busy,setBusy]=useState(false),[out,setOut]=useState<any>(null),[err,setErr]=useState("")
 const [email,setEmail]=useState(""),[name,setName]=useState(""),[newKey,setNewKey]=useState<any>(null),[apiKey,setApiKey]=useState(""),[plan,setPlan]=useState("starter")
 const [campaign,setCampaign]=useState<any>(null),[campaignBusy,setCampaignBusy]=useState(false)
 const [movie,setMovie]=useState<any>(null),[movieBusy,setMovieBusy]=useState(false)
 const [campaignForm,setCampaignForm]=useState({product:"",description:"",audience:"18–35 social media users",goal:"Get more sales",platform:"TikTok, Instagram Reels, Facebook Reels, YouTube Shorts",style:"Premium, cinematic, energetic",language:"English"})
 const [movieForm,setMovieForm]=useState({title:"",story:"",minutes:10,genre:"Cinematic drama",language:"English"})

 async function generate(){
  setBusy(true);setOut(null);setErr("")
  try{
   const r=await fetch("/api/video/generate",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey}`,"Idempotency-Key":crypto.randomUUID()},body:JSON.stringify({prompt,resolution,aspectRatio:aspect,duration})})
   const d=await r.json(); if(!r.ok) throw Error(d.error||"Generation failed")
   if(d.videoUrl){setOut({...d,downloadUrl:d.videoUrl,message:"Video generated successfully."});return}
   setOut({...d,message:`AI scene accepted. Request ID: ${d.requestId}. Generating…`})
   for(let attempt=0;attempt<45;attempt++){
    await new Promise(r=>setTimeout(r,4000))
    const sr=await fetch(`/api/video/status?id=${encodeURIComponent(d.requestId)}`,{headers:{Authorization:`Bearer ${apiKey}`}})
    const sd=await sr.json(); if(!sr.ok) throw Error(sd.error||"Unable to read video status")
    if(sd.status==="COMPLETED"&&sd.videoUrl){setOut({...d,...sd,downloadUrl:sd.videoUrl,message:"Video generated successfully."});return}
    if(["FAILED","CANCELLED","ERROR"].includes(sd.status)) throw Error("Video generation failed. Credits were refunded.")
    setOut({...d,...sd,message:`Video status: ${sd.status}`})
   }
   throw Error("Video is still processing. Use the request ID to poll its status.")
  }catch(e:any){setErr(e.message||"Generation failed")}finally{setBusy(false)}
 }

 async function createKey(){setErr("");setNewKey(null);try{const r=await fetch("/api/keys/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,name})});const d=await r.json();if(!r.ok)throw Error(d.error);setNewKey(d);setApiKey(d.key)}catch(e:any){setErr(e.message)}}
 async function buy(){try{const r=await fetch("/api/billing/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,plan,apiKey})});const d=await r.json();if(!r.ok)throw Error(d.error);location.href=d.url}catch(e:any){setErr(e.message)}}
 async function makeCampaign(){
  setCampaignBusy(true);setCampaign(null);setErr("")
  try{
   const r=await fetch("/api/campaign/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(campaignForm)})
   const d=await r.json();if(!r.ok)throw Error(d.error);setCampaign(d)
  }catch(e:any){setErr(e.message)}finally{setCampaignBusy(false)}
 }
 async function makeMoviePlan(){
  setMovieBusy(true);setMovie(null);setErr("")
  try{
   const r=await fetch("/api/movie/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(movieForm)})
   const d=await r.json();if(!r.ok)throw Error(d.error);setMovie(d.plan)
  }catch(e:any){setErr(e.message)}finally{setMovieBusy(false)}
 }

 const estimatedCredits = useMemo(()=>{
  const cps=resolution==="1080p"?4:resolution==="720p"?3:1
  return duration*cps
 },[duration,resolution])

 return <main className="shell">
  <nav><div className="logo">ViralMovie <span>AI</span></div><div className="links"><a href="#campaign">Campaigns</a><a href="#movie">Film Studio</a><a href="#generate">Video</a><a href="#keys">API Keys</a><a href="#pricing">Pricing</a></div></nav>
  <section className="hero"><div className="badge">VIRALMOVIE AI STUDIO</div><h1>Make <span className="grad">films & campaigns.</span></h1><p className="sub">One platform for AI movie planning, social advertising campaigns and real video generation. Your customer API key stays separate from the underlying AI provider credentials.</p></section>

  <section className="grid" id="campaign">
   <div className="card wide"><h2>📢 Campaign Studio</h2><p className="muted">Create a complete advertising campaign without spending video credits just to plan it. Gemini is used when GEMINI_API_KEY is configured; otherwise the built-in generator keeps the studio working.</p>
    <div className="row"><div><label>Product</label><input value={campaignForm.product} onChange={e=>setCampaignForm({...campaignForm,product:e.target.value})} placeholder="e.g. Coca-Cola Zero"/></div><div><label>Audience</label><input value={campaignForm.audience} onChange={e=>setCampaignForm({...campaignForm,audience:e.target.value})}/></div></div>
    <label>Product description</label><textarea value={campaignForm.description} onChange={e=>setCampaignForm({...campaignForm,description:e.target.value})} placeholder="What makes the product special?"/>
    <div className="row"><div><label>Goal</label><input value={campaignForm.goal} onChange={e=>setCampaignForm({...campaignForm,goal:e.target.value})}/></div><div><label>Platforms</label><input value={campaignForm.platform} onChange={e=>setCampaignForm({...campaignForm,platform:e.target.value})}/></div></div>
    <div className="row"><div><label>Style</label><input value={campaignForm.style} onChange={e=>setCampaignForm({...campaignForm,style:e.target.value})}/></div><div><label>Language</label><input value={campaignForm.language} onChange={e=>setCampaignForm({...campaignForm,language:e.target.value})}/></div></div>
    <button className="btn" disabled={campaignBusy||!campaignForm.product.trim()} onClick={makeCampaign}>{campaignBusy?"Creating campaign…":"Create AI Campaign"}</button>
    {campaign&&<div className="result"><div className="pill">Source: {campaign.source}</div><h3>{campaign.plan.campaignName}</h3><p><b>Hook:</b> {campaign.plan.hook}</p><p><b>Slogan:</b> {campaign.plan.slogan}</p><p><b>CTA:</b> {campaign.plan.callToAction}</p>
      <div className="adlist">{campaign.plan.ads.map((ad:any,i:number)=><div className="ad" key={i}><b>{ad.duration}s · {ad.format}</b><p>{ad.script}</p><div className="code">{ad.visualPrompt}</div><p className="muted">Caption: {ad.caption}</p><button className="btn secondary" onClick={()=>{setPrompt(ad.visualPrompt);setDuration(Math.min(8,ad.duration));setAspect(ad.format.includes("9:16")?"9:16":"16:9");document.getElementById("generate")?.scrollIntoView({behavior:"smooth"})}}>Send to Video Studio</button></div>)}</div>
    </div>}
   </div>
  </section>

  <section className="grid" id="movie">
   <div className="card wide"><h2>🎬 Film Studio · up to 10 minutes</h2><p className="muted">A 10-minute film is built from short scenes so the current video engine can render them individually while the story stays continuous.</p>
    <div className="row"><div><label>Film title</label><input value={movieForm.title} onChange={e=>setMovieForm({...movieForm,title:e.target.value})} placeholder="The Last Signal"/></div><div><label>Genre</label><input value={movieForm.genre} onChange={e=>setMovieForm({...movieForm,genre:e.target.value})}/></div></div>
    <label>Story</label><textarea value={movieForm.story} onChange={e=>setMovieForm({...movieForm,story:e.target.value})} placeholder="A short story idea. The planner turns it into continuous scenes."/>
    <div className="row"><div><label>Length</label><select value={movieForm.minutes} onChange={e=>setMovieForm({...movieForm,minutes:Number(e.target.value)})}>{Array.from({length:10},(_,i)=><option key={i} value={i+1}>{i+1} minute{i>0?"s":""}</option>)}</select></div><div><label>Language</label><input value={movieForm.language} onChange={e=>setMovieForm({...movieForm,language:e.target.value})}/></div></div>
    <button className="btn" disabled={movieBusy||!movieForm.title.trim()||!movieForm.story.trim()} onClick={makeMoviePlan}>{movieBusy?"Building film plan…":"Build 10-Minute Film Plan"}</button>
    {movie&&<div className="result"><div className="kpis"><div className="kpi"><b>{movie.sceneCount}</b><span>scenes</span></div><div className="kpi"><b>{movie.targetDurationSeconds}s</b><span>target runtime</span></div><div className="kpi"><b>8s</b><span>scene target</span></div><div className="kpi"><b>{Math.ceil(movie.sceneCount*estimatedCredits)}</b><span>rough credits at current resolution</span></div></div><p className="muted">The planner creates scene-by-scene prompts with continuity. Each scene can be sent to Video Studio and rendered with your ViralMovie API key.</p>
      <div className="scenegrid">{movie.scenes.slice(0,12).map((s:any)=><div className="scene" key={s.scene}><b>Scene {s.scene}</b><span>{s.startSecond}–{s.endSecond}s · {s.act}</span><p>{s.prompt}</p><button className="btn secondary" onClick={()=>{setPrompt(s.prompt);setDuration(Math.min(8,s.duration));setAspect("16:9");document.getElementById("generate")?.scrollIntoView({behavior:"smooth"})}}>Render Scene</button></div>)}</div>
      {movie.sceneCount>12&&<p className="muted">Showing the first 12 scenes in the browser. The API plan contains all {movie.sceneCount} scenes.</p>}
    </div>}
   </div>
  </section>

  <section className="grid" id="generate">
   <div className="card"><h2>🎥 Video Studio</h2><div className="muted">Current provider clip limit: 8 seconds per generation. Use the Film Studio to build longer films from multiple scenes.</div><label>Prompt</label><textarea value={prompt} onChange={e=>setPrompt(e.target.value)}/><div className="row"><div><label>Resolution</label><select value={resolution} onChange={e=>setResolution(e.target.value)}><option>360p</option><option>540p</option><option>720p</option><option>1080p</option></select></div><div><label>Aspect ratio</label><select value={aspect} onChange={e=>setAspect(e.target.value)}><option>16:9</option><option>9:16</option><option>1:1</option></select></div></div><label>Duration</label><select value={duration} onChange={e=>setDuration(Number(e.target.value))}><option value={1}>1 second</option><option value={2}>2 seconds</option><option value={3}>3 seconds</option><option value={4}>4 seconds</option><option value={5}>5 seconds</option><option value={6}>6 seconds</option><option value={7}>7 seconds</option><option value={8}>8 seconds</option></select><div className="muted">Estimated cost: {estimatedCredits} credits.</div><button className="btn" disabled={busy||!prompt.trim()||!apiKey} onClick={generate}>{busy?"Generating…":"Generate AI Scene"}</button>{!apiKey&&<div className="status">Create an API key first.</div>}{err&&<div className="status">Error: {err}</div>}{out&&<div className="status"><b>{out.message}</b>{out.videoUrl&&<><video src={out.videoUrl} controls playsInline style={{width:"100%",borderRadius:12,marginTop:12}}/><a className="btn" style={{display:"inline-block",marginTop:12,textDecoration:"none"}} href={out.downloadUrl} download="viralmovie-video.mp4">Download MP4</a></>}</div>}</div>
   <div className="card" id="keys"><h2>🔑 Customer API key</h2><p className="muted">ViralMovie creates the key. The provider key stays server-side.</p><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="My app"/><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/><button className="btn" onClick={createKey}>Create API key · FREE</button>{newKey&&<div className="status"><b>Save your API key now</b><div className="code" style={{marginTop:8,wordBreak:"break-all"}}>{newKey.key}</div><p className="muted">10 free credits included.</p></div>}</div>
  </section>

  <section className="grid" id="pricing"><div className="card"><h2>Public API</h2><p className="muted">Authenticate with your ViralMovie key.</p><pre className="code">{`POST /api/v1/video/generate\nAuthorization: Bearer vm_live_xxx\nIdempotency-Key: unique-request-id\nContent-Type: application/json\n\n{\n  "prompt": "cinematic coffee commercial",\n  "duration": 5,\n  "resolution": "720p",\n  "aspectRatio": "16:9"\n}`}</pre></div><div className="card"><h2>Buy API credits</h2><p className="muted">Stripe payments are converted into ViralMovie credits after webhook verification.</p><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/><select value={plan} onChange={e=>setPlan(e.target.value)}><option value="starter">Starter · 100 credits · €9</option><option value="pro">Pro · 500 credits · €29</option><option value="business">Business · 2,000 credits · €99</option></select><button className="btn" onClick={buy}>Pay with Stripe</button></div></section>
  <section className="card bottom"><h2>Production architecture</h2><div className="kpis"><div className="kpi"><b>Customer key</b><span>vm_live_…</span></div><div className="kpi"><b>Credits</b><span>Resolution-aware</span></div><div className="kpi"><b>Payments</b><span>Stripe → credits</span></div><div className="kpi"><b>AI video</b><span>Provider behind backend</span></div></div></section>
  <div className="footer">ViralMovie AI · films + advertising campaigns</div>
 </main>
}
