import {el,fmt,options,table,start} from './ui.mjs';
import {histogram,binName} from './model.mjs';
start(data=>{
  const ranges={psi:[250,370],ups:[800,1150],z:[6500,11500],low:[0,1200]};
  options('window',[['psi','J/ψ · 2.5–3.7 GeV/c²'],['ups','Υ · 8–11.5 GeV/c²'],['z','Z · 65–115 GeV/c²'],['low','Low mass · 0–12 GeV/c²']]);
  options('width',[[5,'0.05 GeV/c²'],[10,'0.10 GeV/c²'],[25,'0.25 GeV/c²'],[50,'0.50 GeV/c²'],[100,'1.00 GeV/c²']],10);
  options('charge',[['both','Both charge selections'],['op','Opposite charge'],['same','Same charge']]);
  options('scale',[['counts','Number of events'],['share','% of each full charge sample']]);
  let rows=[],series=[];
  const plot=el('plot');
  function selected(){
    const r=rows[Number(el('bin').value)]??rows[0];
    el('result').textContent=binName(r)+' GeV/c² · '+series.map(i=>fmt(r.counts[i],0)+(i?' same-charge':' opposite-charge')).join(' and ')+' pairs';
  }
  function draw(){
    const share=el('scale').value==='share';
    const value=(r,i)=>share?100*r.counts[i]/data.totals[i]:r.counts[i];
    const max=Math.max(1,...rows.flatMap(r=>series.map(i=>value(r,i))));
    const w=Math.max(250,plot.clientWidth),h=240,dpr=window.devicePixelRatio||1;
    plot.width=w*dpr;plot.height=h*dpr;
    const ctx=plot.getContext('2d');ctx.scale(dpr,dpr);
    const left=60,right=w-10,top=20,bottom=h-28,step=(right-left)/rows.length;
    ctx.fillStyle='#36484b';ctx.font='12px system-ui';
    for(const f of [0,.5,1]){
      const y=bottom-(bottom-top)*f;ctx.fillText(fmt(max*f,share?2:0)+(share?'%':''),2,y+4);
      ctx.strokeStyle='#d7e0da';ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
    }
    rows.forEach((r,k)=>series.forEach((i,col)=>{
      const bar=(bottom-top)*value(r,i)/max;
      ctx.fillStyle=i?'#b35327':'#005658';
      ctx.fillRect(left+k*step+col*step/series.length,bottom-bar,Math.max(.3,step/series.length*.92),bar);
    }));
    ctx.fillStyle='#36484b';ctx.fillText((rows[0].lo/100).toFixed(1),left,h-5);
    ctx.textAlign='right';ctx.fillText((rows.at(-1).hi/100).toFixed(1)+' GeV/c²',right,h-5);
    el('caption').textContent=share?'Each percentage uses all events of the same charge selection in the full sample.':'Vertical axis counts selected pairs in each mass interval.';
  }
  function update(){
    rows=histogram(data.bins,...ranges[el('window').value],Number(el('width').value));
    series=el('charge').value==='both'?[0,1]:[el('charge').value==='same'?1:0];
    const best=rows.reduce((i,r,k)=>r.counts[series[0]]>rows[i].counts[series[0]]?k:i,0);
    options('bin',rows.map((r,i)=>[i,binName(r)]),best);
    table('rows',['Mass (GeV/c²)',...series.map(i=>i?'Same charge':'Opposite charge')], rows.map(r=>[binName(r),...series.map(i=>fmt(r.counts[i],0))]));
    draw();selected();
  }
  for(const id of ['window','width','charge','scale']) el(id).onchange=update;
  el('bin').onchange=selected;update();new ResizeObserver(draw).observe(plot);
});
