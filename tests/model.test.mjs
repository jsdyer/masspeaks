import assert from 'node:assert/strict';
import test from 'node:test';
import {histogram,binName} from '../web/model.mjs';
test('inclusive lower bound, exclusive upper bound and separate charges',()=>{
  const r=histogram([[299,20,5],[300,3,4],[309,4,0],[310,1,9],[320,8,9]],300,320,10);
  assert.deepEqual(r.map(x=>x.counts),[[7,4],[1,9]]);assert.equal(binName(r[0]),'3.00–3.10');
});
