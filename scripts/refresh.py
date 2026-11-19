"""Preserve exact 0.01 GeV/c² bin counts from the CMS outreach CSV."""
import csv
from collections import Counter
from decimal import Decimal
from hashlib import sha256
from io import StringIO
from source import fetch, store

URL = 'https://opendata.cern.ch/record/303/files/dimuon.csv'

def spectrum(content):
    bins = [Counter(),Counter()]
    count = 0
    for row in csv.DictReader(StringIO(content.decode('utf-8-sig'))):
        charges = (int(row['Q1']), int(row['Q2']))
        if any(abs(q) != 1 for q in charges):
            raise ValueError('Unexpected muon charge')
        mass = Decimal(row['M'])
        if not mass.is_finite() or mass < 0:
            raise ValueError('Invalid dimuon mass')
        bins[int(charges[0] == charges[1])][int(mass * 100)] += 1
        count += 1
    if count != 100000:
        raise ValueError('Review the published sample size before changing this edition')
    keys = sorted(bins[0].keys() | bins[1].keys())
    return dict(count=count, bins=[[k,bins[0][k],bins[1][k]] for k in keys],
                totals=[sum(b.values()) for b in bins], coverage='CMS selected 2010 dimuon sample',
                source=URL,sha256=sha256(content).hexdigest())

if __name__ == '__main__':
    store(spectrum(fetch(URL)))
