# apps/metrics/services/aggregator.py
from datetime import datetime, timedelta
from collections import defaultdict
from typing import List, Dict, Optional

# --- helpers (รองรับ dd/MM/yyyy และ ISO yyyy-MM-dd) ---
def parse_dmy(s: str) -> datetime:
    d, m, y = map(int, s.split('/'))
    return datetime(y, m, d)

def parse_row_date(s: str) -> datetime:
    if '/' in s:
        return parse_dmy(s)
    # assume ISO-ish
    return datetime.fromisoformat(s)

def day_key(dt: datetime) -> str:
    return dt.strftime('%Y-%m-%d')

def month_key(dt: datetime) -> str:
    return dt.strftime('%Y-%m')

def iso_week(dt0: datetime) -> str:
    # compute ISO week string YYYY-Www
    # use isocalendar
    y, w, _ = dt0.isocalendar()
    return f"{y}-W{w:02d}"

def to_range(range_obj: dict):
    if not range_obj or not range_obj.get('startDate') or not range_obj.get('endDate'):
        return None
    start = datetime.fromisoformat(range_obj['startDate'])
    end = datetime.fromisoformat(range_obj['endDate'])
    # make inclusive end of day
    end = end.replace(hour=23, minute=59, second=59, microsecond=999999)
    return {'start': start, 'end': end}

def filter_by_range(rows: List[Dict], r):
    if not r:
        return rows
    s, e = r['start'], r['end']
    out = []
    for row in rows:
        d = parse_row_date(row.get('date'))
        if s <= d <= e:
            out.append(row)
    return out

def aggregate_core(rows: List[Dict], period='day', mode='sum'):
    if not rows:
        return []
    keyfn = day_key if period == 'day' else (iso_week if period == 'week' else month_key)
    # value keys: every key except 'date'
    value_keys = [k for k in rows[0].keys() if k != 'date']
    buckets = {}  # key -> { sums: {vk: number}, n: count }
    for r in rows:
        k = keyfn(parse_row_date(r['date']))
        if k not in buckets:
            buckets[k] = {'sums': {vk: 0.0 for vk in value_keys}, 'n': 0}
        b = buckets[k]
        for vk in value_keys:
            try:
                b['sums'][vk] += float(r.get(vk, 0) or 0)
            except Exception:
                b['sums'][vk] += 0.0
        b['n'] += 1

    out = []
    for k in sorted(buckets.keys()):
        sums = buckets[k]['sums']
        n = buckets[k]['n']
        obj = {'date': k}
        for vk in value_keys:
            obj[vk] = (sums[vk] / n) if mode == 'avg' and n > 0 else sums[vk]
        out.append(obj)
    return out

# --- Public API (same shape as JS aggregateByRange) ---
def aggregate_by_range(data: List[Dict], period='day', mode='sum', range_obj=None, compare_range=None):
    try:
        if not isinstance(data, list) or len(data) == 0:
            print('ไม่ใช่ dict')
            return {'primary': [], 'compare': []}

        r1 = to_range(range_obj)
        if not r1:
            print('ไม่มีวันที่')
            return {'primary': [], 'compare': []}
        primary_rows = filter_by_range(data, r1)
        primary = aggregate_core(primary_rows, period, mode)
        if compare_range and compare_range.get('startDate') and compare_range.get('endDate'):
            r2 = to_range(compare_range)
            compare_rows = filter_by_range(data, r2)
            compare = aggregate_core(compare_rows, period, mode)
            return {'primary': primary, 'compare': compare}
        return {'primary': primary}
    except Exception as e:
        print(e)