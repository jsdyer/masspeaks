// Integer hundredths preserve the inclusive lower and exclusive upper boundaries.
export function histogram(bins, lower, upper, width) {
  const rows=Array.from({length:Math.ceil((upper-lower)/width)},(_,i)=>({lo:lower+i*width,hi:Math.min(upper,lower+(i+1)*width),counts:[0,0]}));
  for(const [mass,opposite,same] of bins){
    if(mass<lower || mass>=upper) continue;
    const bucket=rows[Math.floor((mass-lower)/width)].counts;
    bucket[0]+=opposite;bucket[1]+=same;
  }
  return rows;
}
export const binName=r=>(r.lo/100).toFixed(2)+'–'+(r.hi/100).toFixed(2);
