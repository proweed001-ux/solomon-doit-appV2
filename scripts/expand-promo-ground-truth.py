#!/usr/bin/env python3
import argparse,json
from pathlib import Path
PAGES={1:'HFSS',2:'HFSS',3:'HFSS',4:'HFSM',5:'HFSM',6:'HFSM',7:'HFSL',8:'HFSL',9:'HFSL',10:'HFSXL',11:'HFSXL',12:'HFSXL',13:'HFSWSS',14:'HFSWSS',15:'HFSWSS',16:'HFSWSL',17:'HFSWSL',18:'HFSWSL'}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('compact',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args();src=json.loads(args.compact.read_text(encoding='utf-8'));counts={};cards=[]
 for page in range(1,19):
  class_id=PAGES[page];counts.setdefault(class_id,0)
  for label in src['labels_by_page'][str(page)]:
   counts[class_id]+=1;cards.append({'card_id':f'JUL26-{class_id}-{counts[class_id]:03d}','class_id':class_id,'page_no':page,'card_no':counts[class_id],'expected_label':label})
 out={'source':src.get('source'),'pages':18,'cards':cards};args.output.write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({'cards':len(cards),'counts':counts,'output':str(args.output)},ensure_ascii=False))
if __name__=='__main__':main()
