(function(root){
  const RULES={
    OLAY_SACHET:{
      rule_id:'OLAY_SACHET',category_th:'โอเลย์',base_unit:'ชิ้น',
      units:{'ชิ้น':1,'กล่อง':6,'ลัง':144},
      description:'1 กล่อง = 6 ชิ้น • 1 ลัง = 24 กล่อง = 144 ชิ้น'
    },
    SHAMPOO_CONDITIONER_60_70:{
      rule_id:'SHAMPOO_CONDITIONER_60_70',category_th:'แชมพูและครีมนวด 60–70 มล.',base_unit:'ขวด',
      units:{'ขวด':1,'ลัง':48},description:'1 ลัง = 48 ขวด'
    },
    SHAMPOO_CONDITIONER_105_140:{
      rule_id:'SHAMPOO_CONDITIONER_105_140',category_th:'แชมพูและครีมนวด 105–140 มล.',base_unit:'ขวด',
      units:{'ขวด':1,'ลัง':24},description:'1 ลัง = 24 ขวด'
    },
    FABRIC_SOFTENER_20:{
      rule_id:'FABRIC_SOFTENER_20',category_th:'ปรับผ้านุ่ม 20 มล.',base_unit:'ซอง',
      units:{'ซอง':1,'แพ็ค':24,'ลัง':480},description:'1 แพ็ค = 24 ซอง • 1 ลัง = 20 แพ็ค = 480 ซอง'
    },
    FABRIC_SOFTENER_100:{
      rule_id:'FABRIC_SOFTENER_100',category_th:'ปรับผ้านุ่ม 100 มล.',base_unit:'ถุง',
      units:{'ถุง':1,'ลัง':60},description:'1 ลัง = 60 ถุง'
    }
  };
  const MASTER={version:'2026-07-13.2',confirmed_at:'2026-07-13',rules:RULES};
  const ALIASES={'pcs':'ชิ้น','pc':'ชิ้น','piece':'ชิ้น','pieces':'ชิ้น','bottle':'ขวด','bottles':'ขวด','pack':'แพ็ค','packs':'แพ็ค','box':'กล่อง','boxes':'กล่อง','case':'ลัง','cases':'ลัง','carton':'ลัง','sachet':'ซอง','sachets':'ซอง','bag':'ถุง','bags':'ถุง'};
  const normalizeUnit=value=>{const raw=String(value||'').trim().toLowerCase().replace(/\./g,'');return ALIASES[raw]||raw};
  const normalizeText=value=>String(value||'').toLowerCase().replace(/[,_/\\|]+/g,' ').replace(/\s+/g,' ').trim();
  function sizeMlValues(value){
    const text=normalizeText(value),out=[];
    for(const m of text.matchAll(/(\d+(?:\.\d+)?)\s*(?:มล\.?|มลลิตร|ml)/gi)){
      const n=Number(m[1]);if(Number.isFinite(n)&&n>0&&!out.includes(n))out.push(n);
    }
    return out;
  }
  const cardText=card=>normalizeText([card?.promo_title,card?.canonical_name,card?.master_product_name,card?.product_name,card?.raw_text].filter(Boolean).join(' '));
  function resolveRule(card){
    const text=cardText(card),sizes=sizeMlValues(text);
    if(/(?:^|\s)(?:olay)(?:\s|$)|โอเลย์/.test(text))return RULES.OLAY_SACHET;
    const isSoftener=/ปรับผ้านุ่ม|downy|ดาวน์นี่|ดาวนี/.test(text);
    if(isSoftener){
      const matches=[];
      if(sizes.includes(20))matches.push(RULES.FABRIC_SOFTENER_20);
      if(sizes.includes(100))matches.push(RULES.FABRIC_SOFTENER_100);
      return matches.length===1?matches[0]:null;
    }
    const isHair=/แชมพู|ครีมนวด|head\s*(?:&|and)?\s*shoulders|h\s*&\s*s|เฮด.*โชลเดอร์|pantene|แพนทีน|rejoice|รีจอยส์|herbal\s*essences|เฮอร์บัล/.test(text);
    if(isHair){
      const matches=[];
      if(sizes.some(n=>n>=60&&n<=70))matches.push(RULES.SHAMPOO_CONDITIONER_60_70);
      if(sizes.some(n=>n>=105&&n<=140))matches.push(RULES.SHAMPOO_CONDITIONER_105_140);
      return matches.length===1?matches[0]:null;
    }
    return null;
  }
  function factor(rule,unit){return rule?.units?.[normalizeUnit(unit)]??null}
  function convert(quantity,fromUnit,toUnit,rule){
    const q=Number(quantity),from=normalizeUnit(fromUnit),to=normalizeUnit(toUnit);
    if(!Number.isFinite(q))return null;if(from===to)return q;
    const a=factor(rule,from),b=factor(rule,to);return a==null||b==null?null:q*a/b;
  }
  function units(rule){return rule?Object.keys(rule.units):[]}
  function describe(rule){return rule?.description||''}
  root.PROMO_PACKING_MASTER=MASTER;
  root.PromoPacking={MASTER,RULES,normalizeUnit,normalizeText,sizeMlValues,resolveRule,factor,convert,units,describe};
})(typeof window!=='undefined'?window:globalThis);
