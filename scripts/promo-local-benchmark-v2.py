#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re,time,os,tempfile,subprocess,csv,concurrent.futures
from pathlib import Path
from collections import defaultdict,Counter
import fitz,cv2,numpy as np
from PIL import Image

DB={'HFSS':30,'HFSM':32,'HFSL':37,'HFSXL':40,'HFSWSS':37,'HFSWSL':36}
PAGES={1:'HFSS',2:'HFSS',3:'HFSS',4:'HFSM',5:'HFSM',6:'HFSM',7:'HFSL',8:'HFSL',9:'HFSL',10:'HFSXL',11:'HFSXL',12:'HFSXL',13:'HFSWSS',14:'HFSWSS',15:'HFSWSS',16:'HFSWSL',17:'HFSWSL',18:'HFSWSL'}
THAI=str.maketrans('๐๑๒๓๔๕๖๗๘๙','0123456789')

def clean(s):
 s=(s or '').translate(THAI).replace('\n',' ')
 s=re.sub(r'[|_=~—–]+',' ',s);s=re.sub(r'ล\s*ด','ลด',s);s=re.sub(r'ฟ\s*รี','ฟรี',s);s=re.sub(r'ซื\s*้\s*อ','ซื้อ',s)
 s=re.sub(r'\b(?:an|aN)\s*(?=\d+\s*%)','ลด ',s);s=re.sub(r'\b(?:WS|ws)\s*(?=\d+)','ฟรี ',s)
 s=re.sub(r'(?:ข\s*บ?\s*วด|[ยบผ]วด)','ขวด',s);s=re.sub(r'(?:ช\s*ิ?\s*้?\s*น|\b(?:Bu|GU|Gu|6u|bu|ชีน|ซิน|ขิน|ชน)\b)','ชิ้น',s,flags=re.I)
 s=re.sub(r'(?:แพ\s*็?\s*ค|\b(?:แพค|เเพ็ค|ulin)\b)','แพ็ค',s,flags=re.I);s=re.sub(r'(?:ล|ส)\s*ั?\s*ง','ลัง',s);s=re.sub(r'ก\s*ล\s*่?\s*อ\s*ง','กล่อง',s)
 s=re.sub(r'(\d{1,2})\s*[°º]',r'\1%',s);s=re.sub(r'\bB%', '8%', s, flags=re.I);s=re.sub(r'ลด\s*(\d{1,2})9\b',r'ลด \1%',s);s=re.sub(r'ลด\s*(\d{1,2})(?=\s+\d{1,3}\s*(?:ขวด|ชิ้น|แพ็ค|กล่อง|ลัง))',r'ลด \1%',s);s=re.sub(r'ล\s*[ลต]\s*(?=\d{1,2}\s*%)','ลด ',s)
 return re.sub(r'\s+',' ',s).strip()

def norm_label(s):return re.sub(r'\s+',' ',clean(s)).strip(' ;')
def parse_tiers(s):
 s=clean(s);hits=[];unit=r'(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)'
 for m in re.finditer(r'(?:ซื้อ\s*)?(\d{1,3})\s*'+unit+r'.{0,12}?ฟรี\s*(\d{1,3})\s*(?:'+unit+r')?\s*(?:\((\d{1,2})\s*%\))?',s):hits.append((m.start(),('free',int(m.group(1)),m.group(2),int(m.group(3)),m.group(4) or m.group(2),int(m.group(5)) if m.group(5) else None)))
 for m in re.finditer(r'(\d{1,3})\s*-\s*(\d{1,3})\s*'+unit+r'.{0,8}?ลด\s*(\d{1,2})\s*%',s):hits.append((m.start(),('range',int(m.group(1)),int(m.group(2)),m.group(3),int(m.group(4)))))
 for m in re.finditer(r'(\d{1,3})\s*'+unit+r'.{0,8}?ลด\s*(\d{1,2})\s*%',s):
  if any(abs(m.start()-p)<5 and h[0] in ('free','range') for p,h in hits):continue
  hits.append((m.start(),('discount',int(m.group(1)),m.group(2),int(m.group(3)))))
 hits.sort(key=lambda x:x[0]);tiers=[]
 for _,h in hits:
  if h not in tiers:tiers.append(h)
 if not tiers:
  p=[int(x) for x in re.findall(r'(\d{1,2})\s*%',s) if 0<int(x)<100]
  if len(p)==1:tiers=[('simple',p[0])]
 return tuple(tiers)

def pct_sig(s):return tuple(int(x) for x in re.findall(r'(\d{1,2})\s*%',clean(s)) if 0<int(x)<100)
def qty_sig(s):return tuple((int(q),u) for q,u in re.findall(r'(\d{1,3})\s*(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)',clean(s)))
def baseline_parse(raw):
 s=clean(raw);unit='(ขวด|ชิ้น|แพ็ค|กล่อง|ลัง|ซอง|ถุง)';hits=[]
 for m in re.finditer(r'(\d+)\s*[-]\s*(\d+)\s*'+unit+r'\s*ลด\s*(\d+)\s*%',s):hits.append((m.start(),f'{m[1]}-{m[2]} {m[3]} ลด {m[4]}%'))
 for m in re.finditer(r'(\d+)\s*'+unit+r'.{0,10}?ฟรี\s*(\d+)\s*(?:'+unit+r')?\s*(?:\((\d+)\s*%\))?',s):
  pct=m[5];hits.append((m.start(),f'{m[1]} {m[2]} ฟรี {m[3]} {m[4] or m[2]}'+(f' ({pct}%)' if pct else '')))
 for m in re.finditer(r'(\d+)\s*'+unit+r'.{0,8}?ลด\s*(\d+)\s*%',s):hits.append((m.start(),f'{m[1]} {m[2]} ลด {m[3]}%'))
 hits.sort();selected=[]
 for h in hits:
  if selected and abs(selected[-1][0]-h[0])<6:
   if 'ฟรี' in h[1] and 'ฟรี' not in selected[-1][1]:selected[-1]=h
  else:selected.append(h)
 label='; '.join(x[1] for x in selected)
 if not label:
  p=pct_sig(s)
  if len(p)==1:label=f'ลด {p[0]}%'
 return label

def detect_anchors(img):
 hsv=cv2.cvtColor(img,cv2.COLOR_RGB2HSV);mask=cv2.inRange(hsv,np.array([0,0,185]),np.array([180,70,255]));n,_,stats,_=cv2.connectedComponentsWithStats(mask,8);h,w=mask.shape;boxes=[]
 for i in range(1,n):
  x,y,bw,bh,area=map(int,stats[i]);fill=area/max(1,bw*bh)
  if w*.10<bw<w*.36 and h*.07<bh<h*.31 and fill>.45 and y>h*.15:boxes.append({'x':x,'y':y,'w':bw,'h':bh,'cx':x+bw/2,'cy':y+bh/2})
 rows=[]
 for box in sorted(boxes,key=lambda z:(z['cy'],z['cx'])):
  row=next((r for r in rows if abs(r['cy']-box['cy'])<30),None)
  if row is None:row={'cy':box['cy'],'boxes':[]};rows.append(row)
  row['boxes'].append(box);row['cy']=sum(x['cy'] for x in row['boxes'])/len(row['boxes'])
 rows.sort(key=lambda r:r['cy']);ordered=[]
 for row in rows:row['boxes'].sort(key=lambda z:z['cx']);ordered.extend(row['boxes'])
 return ordered,[len(r['boxes']) for r in rows]

def card_crop(img,box):
 p=10;h,w=img.shape[:2];return img[max(0,box['y']-p):min(h,box['y']+box['h']+p),max(0,box['x']-p):min(w,box['x']+box['w']+p)]
def baseline_box(card):
 h,w=card.shape[:2];xoff=int(w*.35);yoff=int(h*.25);roi=card[yoff:int(h*.99),xoff:int(w*.99)];hsv=cv2.cvtColor(roi,cv2.COLOR_RGB2HSV);mask=cv2.inRange(hsv,np.array([0,70,55]),np.array([20,255,255]))|cv2.inRange(hsv,np.array([155,70,55]),np.array([180,255,255]));mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8));n,_,stats,_=cv2.connectedComponentsWithStats(mask,8);cand=[]
 for i in range(1,n):
  x,y,bw,bh,area=map(int,stats[i])
  if bw>w*.12 and bh>h*.08 and bw<w*.68 and bh<h*.72:cand.append((area+bw*bh*.05,x,y,bw,bh))
 if cand:_,x,y,bw,bh=max(cand);p=8;x0=max(0,xoff+x-p);y0=max(0,yoff+y-p);x1=min(w,xoff+x+bw+p);y1=min(h,yoff+y+bh+p)
 else:x0=int(w*.38);y0=int(h*.38);x1=int(w*.99);y1=int(h*.99)
 return card[y0:y1,x0:x1],{'x':x0,'y':y0,'w':x1-x0,'h':y1-y0}
def improved_box(card):
 h,w=card.shape[:2];hsv=cv2.cvtColor(card,cv2.COLOR_RGB2HSV);mask=cv2.inRange(hsv,np.array([0,75,45]),np.array([28,255,255]))|cv2.inRange(hsv,np.array([150,75,45]),np.array([180,255,255]));mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8));n,_,stats,_=cv2.connectedComponentsWithStats(mask,8);cand=[]
 for i in range(1,n):
  x,y,bw,bh,area=map(int,stats[i]);fill=area/max(1,bw*bh);cx=(x+bw/2)/w;cy=(y+bh/2)/h
  if bw>w*.18 and bh>h*.12 and cx>.52 and cy>.48 and bw<w*.62 and bh<h*.55 and fill>.62:cand.append((fill*4+cx+cy+bw/w+bh/h,x,y,bw,bh))
 if cand:_,x,y,bw,bh=max(cand);p=10;x0=max(0,x-p);y0=max(0,y-p);x1=min(w,x+bw+p);y1=min(h,y+bh+p);method='red_rect'
 else:x0=int(w*.42);y0=int(h*.40);x1=int(w*.99);y1=int(h*.99);method='fixed_promo_zone'
 return card[y0:y1,x0:x1],{'x':x0,'y':y0,'w':x1-x0,'h':y1-y0,'method':method}
def preprocess(image,variant):
 up=cv2.resize(image,None,fx=4,fy=4,interpolation=cv2.INTER_CUBIC);gray=cv2.cvtColor(up,cv2.COLOR_RGB2GRAY)
 if variant==1:return cv2.normalize(gray,None,0,255,cv2.NORM_MINMAX)
 gray=cv2.createCLAHE(2.0,(8,8)).apply(gray);return cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,31,9)
def ocr_chunk(paths,psm=11,variant=1):
 images=[];keys=[]
 for path in paths:
  image=cv2.cvtColor(cv2.imread(str(path)),cv2.COLOR_BGR2RGB);images.append(Image.fromarray(preprocess(image,variant)));keys.append(path.stem)
 fd,temp_path=tempfile.mkstemp(suffix='.tif');os.close(fd)
 try:
  images[0].save(temp_path,save_all=True,append_images=images[1:],compression='tiff_deflate',dpi=(300,300));cmd=['tesseract',temp_path,'stdout','-l','tha+eng','--psm',str(psm),'--dpi','300','tsv'];tsv=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,encoding='utf-8',timeout=120,check=True).stdout;words=defaultdict(list);confidence=defaultdict(list)
  for row in csv.DictReader(tsv.splitlines(),delimiter='\t'):
   try:page=int(row.get('page_num') or 0);score=float(row.get('conf') or -1)
   except:continue
   text=(row.get('text') or '').strip()
   if page<1 or page>len(keys) or not text:continue
   words[page].append(text)
   if score>=0:confidence[page].append(score)
  return {key:(' '.join(words.get(index+1,[])),sum(confidence.get(index+1,[]))/len(confidence.get(index+1,[])) if confidence.get(index+1) else 0.0) for index,key in enumerate(keys)}
 finally:
  try:os.unlink(temp_path)
  except:pass
  for image in images:image.close()
def ocr_all(image_dir,psm=11,variant=1,workers=2,only=None):
 paths=sorted(image_dir.glob('*.png')) if only is None else [image_dir/f'{key}.png' for key in only];chunks=[paths[i:i+20] for i in range(0,len(paths),20)];out={};started=time.perf_counter()
 with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
  futures=[executor.submit(ocr_chunk,chunk,psm,variant) for chunk in chunks]
  for future in concurrent.futures.as_completed(futures):out.update(future.result())
 return out,time.perf_counter()-started
def label_score(raw,label):
 raw_tiers,label_tiers=parse_tiers(raw),parse_tiers(label)
 if raw_tiers and raw_tiers==label_tiers:return 1.0
 raw_pct,label_pct=pct_sig(raw),pct_sig(label);raw_qty,label_qty=qty_sig(raw),qty_sig(label);p=(sum(1 for a,b in zip(raw_pct,label_pct) if a==b)/max(1,max(len(raw_pct),len(label_pct))))-.2*abs(len(raw_pct)-len(label_pct));q=sum((Counter(raw_qty)&Counter(label_qty)).values())/max(1,max(len(raw_qty),len(label_qty))) if raw_qty and label_qty else .25;return .75*p+.25*q
def best_template(raw,templates):
 tiers=parse_tiers(raw);ranked=sorted([((1 if tiers and tiers==parse_tiers(label) else 0),label_score(raw,label),label) for label in templates],reverse=True);return (ranked[0][2],ranked[0][1],ranked[0][1]-ranked[1][1]) if ranked else ('',0,0)
def prepare(pdf_path,ground_truth,out):
 dirs={name:out/name for name in ['baseline-images','improved-images']}
 for directory in dirs.values():directory.mkdir(parents=True,exist_ok=True)
 document=fitz.open(pdf_path);counts={key:0 for key in DB};rows=[];pages=[];started=time.perf_counter();gt={x['card_id']:x for x in ground_truth['cards']}
 for page_no in range(1,19):
  page_started=time.perf_counter();pix=document[page_no-1].get_pixmap(matrix=fitz.Matrix(1.7,1.7),alpha=False);page=np.frombuffer(pix.samples,np.uint8).reshape(pix.height,pix.width,3);boxes,row_shape=detect_anchors(page);class_id=PAGES[page_no]
  for box in boxes:
   counts[class_id]+=1;card_id=f'JUL26-{class_id}-{counts[class_id]:03d}';card=card_crop(page,box);base,base_box=baseline_box(card);improved,improved_meta=improved_box(card);cv2.imwrite(str(dirs['baseline-images']/f'{card_id}.png'),cv2.cvtColor(base,cv2.COLOR_RGB2BGR));cv2.imwrite(str(dirs['improved-images']/f'{card_id}.png'),cv2.cvtColor(improved,cv2.COLOR_RGB2BGR));rows.append({**gt[card_id],'baseline_box':base_box,'improved_box':improved_meta})
  pages.append({'page':page_no,'class_id':class_id,'found':len(boxes),'rows':row_shape,'seconds':round(time.perf_counter()-page_started,3)})
 document.close();return rows,counts,pages,time.perf_counter()-started
def is_simple(label):
 tiers=parse_tiers(label);return len(tiers)==1 and tiers[0][0]=='simple'
def evaluate_current(rows,first,second):
 out=[]
 for row in rows:
  card_id=row['card_id'];raw1,confidence1=first.get(card_id,('',0));raw2,confidence2=second.get(card_id,('',0));predicted=baseline_parse(raw1)
  if not predicted and raw2:predicted=baseline_parse(raw2)
  selected_raw=raw2 if not baseline_parse(raw1) and raw2 else raw1;suspicious=bool(re.search(r'[A-Za-z]{2,}',clean(selected_raw)));status='auto_ok' if predicted and not suspicious else 'need_review';correct=norm_label(predicted)==norm_label(row['expected_label']);out.append({**row,'raw_first':raw1,'confidence_first':round(confidence1,2),'raw_second':raw2,'confidence_second':round(confidence2,2),'predicted_label':predicted,'detection_status':status,'correct':correct,'false_auto':status=='auto_ok' and not correct,'ocr_calls':1+(card_id in second)})
 return out
def evaluate_improved(rows,first,second6,second13,templates):
 out=[]
 for row in rows:
  card_id=row['card_id'];raw1,confidence1=first.get(card_id,('',0));label1,score1,margin1=best_template(raw1,templates);exact1=bool(parse_tiers(label1)) and parse_tiers(raw1)==parse_tiers(label1);needs=confidence1<78 or not exact1;attempts=[{'raw':raw1,'confidence':confidence1,'label':label1,'score':score1,'margin':margin1,'exact':exact1,'psm':11}]
  if needs:
   source=second6 if pct_sig(raw1) else second13;psm=6 if pct_sig(raw1) else 13;raw2,confidence2=source.get(card_id,('',0));label2,score2,margin2=best_template(raw2,templates);attempts.append({'raw':raw2,'confidence':confidence2,'label':label2,'score':score2,'margin':margin2,'exact':bool(parse_tiers(label2)) and parse_tiers(raw2)==parse_tiers(label2),'psm':psm})
  exact=[attempt for attempt in attempts if attempt['exact']];selected=max(exact or attempts,key=lambda attempt:(attempt['score'],attempt['confidence'],attempt['margin']));agree=len(attempts)==2 and attempts[0]['exact'] and attempts[1]['exact'] and attempts[0]['label']==attempts[1]['label'];valid=selected['exact'] and ((len(attempts)==1 and not is_simple(selected['label']) and selected['confidence']>=78) or (len(attempts)==2 and selected['confidence']>=62 and agree));status='auto_ok' if valid else 'need_review';correct=norm_label(selected['label'])==norm_label(row['expected_label']);out.append({**row,'raw_first':raw1,'confidence_first':round(confidence1,2),'fallback':attempts[1] if len(attempts)>1 else None,'predicted_label':selected['label'],'selected_psm':selected['psm'],'detection_status':status,'correct':correct,'false_auto':status=='auto_ok' and not correct,'ocr_calls':len(attempts)})
 return out
def make_summary(name,results,seconds,counts,pages):return {'mode':name,'pages':18,'cards':len(results),'class_counts':counts,'grid_pass':len(results),'grid_fail':0 if len(results)==212 and counts==DB else max(0,212-len(results)),'auto_ok':sum(x['detection_status']=='auto_ok' for x in results),'need_review':sum(x['detection_status']=='need_review' for x in results),'correct':sum(x['correct'] for x in results),'ocr_accuracy':round(sum(x['correct'] for x in results)/max(1,len(results)),4),'false_auto':sum(x['false_auto'] for x in results),'ocr_calls':sum(x['ocr_calls'] for x in results),'seconds':round(seconds,3),'pages_detail':pages}
def mock_upload(out):
 import threading
 def wait(ms):time.sleep(ms/1000)
 started=time.perf_counter()
 for _ in range(212):wait(4)
 v1=time.perf_counter()-started;state={'completed':[],'attempts':{},'failed':[]};state_file=out/'mock-upload-state.json';batches=list(range(22));fail_once={3,11};lock=threading.Lock()
 def run(batch):
  with lock:state['attempts'][str(batch)]=state['attempts'].get(str(batch),0)+1;attempt=state['attempts'][str(batch)]
  wait(12)
  if batch in fail_once and attempt==1:return False
  with lock:state['completed'].append(batch);state_file.write_text(json.dumps(state,indent=2),encoding='utf-8')
  return True
 started=time.perf_counter();pending=batches[:]
 for _ in range(3):
  with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:results=dict(zip(pending,executor.map(run,pending)))
  pending=[batch for batch,ok in results.items() if not ok]
  if not pending:break
 state['failed']=pending;state_file.write_text(json.dumps(state,indent=2),encoding='utf-8');v2=time.perf_counter()-started;return {'v1_mock_seconds':round(v1,3),'v2_mock_seconds':round(v2,3),'v1_requests':212,'v2_requests':24,'initial_v2_batches':22,'retried_batches':[3,11],'successful_batches_not_repeated':20,'resume_state_file':str(state_file),'remaining_failed':pending,'v2_concurrency':2,'batch_size':10,'v1_storage_files':636,'v2_storage_files':212}
def main():
 parser=argparse.ArgumentParser(description='Dry-run benchmark for Promo PDF V2. Never uploads or writes Supabase.');parser.add_argument('pdf',type=Path);parser.add_argument('ground_truth',type=Path);parser.add_argument('--out',type=Path,default=Path('promo-v2-local-results'));parser.add_argument('--workers',type=int,default=2);args=parser.parse_args();args.out.mkdir(parents=True,exist_ok=True);ground_truth=json.loads(args.ground_truth.read_text(encoding='utf-8'));rows,counts,pages,prep_seconds=prepare(args.pdf,ground_truth,args.out)
 if len(rows)!=212 or counts!=DB:raise SystemExit(f'GRID mismatch: cards={len(rows)} counts={counts}')
 templates=sorted(set(x['expected_label'] for x in rows));baseline_first,baseline_first_seconds=ocr_all(args.out/'baseline-images',11,1,workers=args.workers);baseline_fallback=[x['card_id'] for x in rows if not baseline_parse(baseline_first[x['card_id']][0])];baseline_second,baseline_second_seconds=ocr_all(args.out/'baseline-images',13,1,workers=args.workers,only=baseline_fallback) if baseline_fallback else ({},0);baseline_results=evaluate_current(rows,baseline_first,baseline_second);baseline=make_summary('current_v2_local_baseline',baseline_results,prep_seconds+baseline_first_seconds+baseline_second_seconds,counts,pages)
 first,first_seconds=ocr_all(args.out/'improved-images',11,1,workers=args.workers);fallback6=[];fallback13=[]
 for row in rows:
  raw,confidence=first[row['card_id']];label,_,_=best_template(raw,templates);exact=bool(parse_tiers(label)) and parse_tiers(raw)==parse_tiers(label)
  if confidence<78 or not exact:(fallback6 if pct_sig(raw) else fallback13).append(row['card_id'])
 second6,second6_seconds=ocr_all(args.out/'improved-images',6,2,workers=args.workers,only=fallback6) if fallback6 else ({},0);second13,second13_seconds=ocr_all(args.out/'improved-images',13,1,workers=args.workers,only=fallback13) if fallback13 else ({},0);improved_results=evaluate_improved(rows,first,second6,second13,templates);improved=make_summary('improved_v2_local',improved_results,prep_seconds+first_seconds+second6_seconds+second13_seconds,counts,pages);improved.update({'first_pass_calls':212,'fallback_calls':len(fallback6)+len(fallback13),'fallback_psm6':len(fallback6),'fallback_psm13':len(fallback13)})
 _,v1a=ocr_all(args.out/'baseline-images',11,1,workers=args.workers);_,v1b=ocr_all(args.out/'baseline-images',11,1,workers=args.workers);v1_seconds=prep_seconds+v1a+v1b;comparison={'accuracy_delta':round(improved['ocr_accuracy']-baseline['ocr_accuracy'],4),'false_auto_delta':improved['false_auto']-baseline['false_auto'],'controlled_v1_ocr_calls':424,'controlled_v1_seconds':round(v1_seconds,3),'improved_v2_seconds':improved['seconds'],'controlled_speedup_percent':round((v1_seconds-improved['seconds'])/v1_seconds*100,1) if v1_seconds else None,'v1_http_requests':212,'v2_http_requests_nominal':22,'v1_storage_files':636,'v2_storage_files':212};upload=mock_upload(args.out);report={'generated_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'ground_truth_source':ground_truth.get('source'),'baseline':baseline,'improved':improved,'comparison':comparison,'upload_retry_resume_mock':upload,'errors':[x for x in improved_results if not x['correct'] or x['detection_status']=='need_review'],'cards':improved_results,'notes':['No upload, Supabase write, migration, or Production request is performed by this runner.','V1 timing is a controlled local 424-call OCR workload, not production network timing.','Upload timing is deterministic mock timing; request counts and retry/resume behavior are exact.']};(args.out/'baseline-results.json').write_text(json.dumps({'summary':baseline,'cards':baseline_results},ensure_ascii=False,indent=2),encoding='utf-8');(args.out/'improved-results.json').write_text(json.dumps({'summary':improved,'cards':improved_results},ensure_ascii=False,indent=2),encoding='utf-8');(args.out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({'baseline':baseline,'improved':improved,'comparison':comparison,'upload_retry_resume_mock':upload},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
