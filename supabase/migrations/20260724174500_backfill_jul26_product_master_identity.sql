-- Prepared only. Do not apply to Production without explicit approval.
-- Adds Structured Identity to the 42 active JUL26 Product Master rows.

do $$
declare
  v_updated integer := 0;
begin
  if to_regclass('public.promo_product_master') is null then
    raise notice 'promo_product_master not present; JUL26 identity backfill skipped';
    return;
  end if;

  with expected(
    normalized_key, brand, product_type, variant,
    size_value, size_unit, sales_unit, pack_quantity
  ) as (
    values
      ('hsแชมพู140ml', 'H&S', 'แชมพู', 'ทุกสูตร', 140::numeric, 'มล.', 'ขวด', 1),
      ('hsแชมพู370ml', 'H&S', 'แชมพู', 'ทุกสูตร ยกเว้น CM/AF', 370::numeric, 'มล.', 'ขวด', 1),
      ('hsแชมพู65ml', 'H&S', 'แชมพู', 'ทุกสูตร', 65::numeric, 'มล.', 'ขวด', 1),
      ('hsแพ็คแชมพูแชมพู370370ml', 'H&S', 'แพ็กแชมพู', 'แชมพู 370 + แชมพู 370 มล.', null::numeric, null::text, 'แพ็ค', 2),
      ('เซฟการ์ดสบู่ก้อน120g', 'เซฟการ์ด', 'สบู่ก้อน', '120 กรัม', 120::numeric, 'กรัม', 'ชิ้น', 1),
      ('เซฟการ์ดสบู่ก้อน4858g', 'เซฟการ์ด', 'สบู่ก้อน', '48-58 กรัม', null::numeric, null::text, 'ชิ้น', 1),
      ('downyปรับผ้านุ่มsunrisefresh480ml', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'ซันไรซ์เฟรช', 480::numeric, 'มล.', 'ถุง', 1),
      ('downyปรับผ้านุ่ม100mlหอมแดดม่วงเหลือง', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'หอมแดดม่วงและเหลือง', 100::numeric, 'มล.', 'ถุง', 1),
      ('downyปรับผ้านุ่ม100130ml', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'ทุกสูตร 100-130 มล.', null::numeric, null::text, 'ถุง', 1),
      ('downyปรับผ้านุ่มถุงเติมใหญ่แพ็ค1แถม1', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'ถุงเติมขนาดใหญ่ แพ็ก 1 แถม 1 ทุกสูตร', null::numeric, null::text, 'แพ็ค', 2),
      ('downyปรับผ้านุ่มซอง24ซอง', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'ซอง แพ็ก 24 ซอง', null::numeric, null::text, 'แพ็ค', 24),
      ('downyปรับผ้านุ่ม480ml', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'ทุกสูตร/กลุ่มสูตรน้ำหอม', 480::numeric, 'มล.', 'ถุง', 1),
      ('downyปรับผ้านุ่มแพ็ค2แถม1', 'ดาวน์นี่', 'ปรับผ้านุ่ม', 'แพ็ก 2 แถม 1 ทุกสูตร', null::numeric, null::text, 'แพ็ค', 3),
      ('panteneครีมนวด120ml', 'แพนทีน', 'ครีมนวด', 'ทุกสูตร', 120::numeric, 'มล.', 'ขวด', 1),
      ('panteneครีมนวด60ml', 'แพนทีน', 'ครีมนวด', 'ทุกสูตร', 60::numeric, 'มล.', 'ขวด', 1),
      ('panteneแชมพู120ml', 'แพนทีน', 'แชมพู', 'ทุกสูตร', 120::numeric, 'มล.', 'ขวด', 1),
      ('panteneแชมพู70ml', 'แพนทีน', 'แชมพู', 'ทุกสูตร', 70::numeric, 'มล.', 'ขวด', 1),
      ('panteneแชมพูครีมนวด380ml', 'แพนทีน', 'แชมพู/ครีมนวด', 'ทุกสูตร', 380::numeric, 'มล.', 'ขวด', 1),
      ('panteneแชมพูครีมนวด450ml', 'แพนทีน', 'แชมพู/ครีมนวด', 'ทุกสูตร', 450::numeric, 'มล.', 'ขวด', 1),
      ('panteneทรีทเมนต์คอลลาเจนไบโอตินเคราติน6ซอง', 'แพนทีน', 'ทรีทเมนต์', 'คอลลาเจน/ไบโอติน/เคราติน', null::numeric, null::text, 'กล่อง', 6),
      ('panteneแพ็คแชมพูครีมนวด370470ml', 'แพนทีน', 'แพ็กแชมพู/ครีมนวด', 'แชมพู 370 + ครีมนวด 470 มล.', null::numeric, null::text, 'แพ็ค', 2),
      ('panteneแพ็คแชมพูแชมพู370370ml', 'แพนทีน', 'แพ็กแชมพู', 'แชมพู 370 + แชมพู 370 มล.', null::numeric, null::text, 'แพ็ค', 2),
      ('ยิลเลตต์blueiiแผง', 'ยิลเลตต์', 'มีดโกน', 'Blue II รุ่นแผง', null::numeric, null::text, 'ชิ้น', 1),
      ('ยิลเลตต์flexiblue3', 'ยิลเลตต์', 'มีดโกน', 'Flexi Blue 3', null::numeric, null::text, 'ชิ้น', 1),
      ('ยิลเลตต์superthiniiแผง', 'ยิลเลตต์', 'มีดโกน', 'Super Thin II รุ่นแผง', null::numeric, null::text, 'ชิ้น', 1),
      ('ยิลเลตต์คู่แพ็ค', 'ยิลเลตต์', 'มีดโกน', 'คู่แพ็ก', null::numeric, null::text, 'ชิ้น', 2),
      ('ยิลเลตต์ด้ามมีดsuperclick', 'ยิลเลตต์', 'ด้ามมีด', 'Super Click', null::numeric, null::text, 'ด้าม', 1),
      ('ยิลเลตต์ด้ามมีดvector', 'ยิลเลตต์', 'ด้ามมีด', 'Vector', null::numeric, null::text, 'ด้าม', 1),
      ('ยิลเลตต์ใบมีดsuperthin', 'ยิลเลตต์', 'ใบมีด', 'Super Thin', null::numeric, null::text, 'ชิ้น', 1),
      ('ยิลเลตต์ใบมีดvectorแพ็ค2', 'ยิลเลตต์', 'ใบมีด', 'Vector แพ็ก 2', null::numeric, null::text, 'แพ็ค', 2),
      ('rejoiceครีมนวด60ml', 'รีจอยส์', 'ครีมนวด', 'ทุกสูตร', 60::numeric, 'มล.', 'ขวด', 1),
      ('rejoiceแชมพู70ml', 'รีจอยส์', 'แชมพู', 'ทุกสูตร', 70::numeric, 'มล.', 'ขวด', 1),
      ('วิคส์vaporub10g', 'วิคส์', 'VapoRub', 'VapoRub', 10::numeric, 'กรัม', 'ชิ้น', 1),
      ('วิคส์vaporub25g', 'วิคส์', 'VapoRub', 'VapoRub', 25::numeric, 'กรัม', 'ชิ้น', 1),
      ('วิคส์vaporub5g', 'วิคส์', 'VapoRub', 'VapoRub', 5::numeric, 'กรัม', 'ชิ้น', 1),
      ('ออรัลบีแปรงสีฟันชายนิ่งคลีน', 'ออรัลบี', 'แปรงสีฟัน', 'ชายนิ่งคลีน', null::numeric, null::text, 'ด้าม', 1),
      ('ออรัลบีแปรงสีฟันเซนซิทีฟคลีน', 'ออรัลบี', 'แปรงสีฟัน', 'เซนซิทีฟคลีน', null::numeric, null::text, 'ด้าม', 1),
      ('แอมบิเพอร์เจลเฟรชมินิ75g', 'แอมบิเพอร์', 'เจลปรับอากาศ', 'เฟรช มินิ', 75::numeric, 'กรัม', 'ชิ้น', 1),
      ('olayโททัลไวท์ซองไม่มีฝา', 'โอเลย์', 'โททัลไวท์', 'ซองฉีก/ไม่มีฝา', null::numeric, null::text, 'ซอง', 1),
      ('olayโททัลไวท์ซองมีฝา', 'โอเลย์', 'โททัลไวท์', 'ซองมีฝา', null::numeric, null::text, 'ซอง', 1),
      ('olayโททัลเอฟเฟคส์เดย์ไนท์เซรั่มซอง7g', 'โอเลย์', 'โททัลเอฟเฟคส์', 'เดย์/ไนท์/เซรั่ม', 7::numeric, 'กรัม', 'ซอง', 1),
      ('olayไวท์เรเดียนซ์ยูวีโลชั่น30ml', 'โอเลย์', 'ไวท์เรเดียนซ์ ยูวีโลชั่น', 'ไวท์เรเดียนซ์', 30::numeric, 'มล.', 'ขวด', 1)
  ), updated as (
    update public.promo_product_master master
    set brand = expected.brand,
        product_type = expected.product_type,
        variant = expected.variant,
        size_value = expected.size_value,
        size_unit = expected.size_unit,
        sales_unit = expected.sales_unit,
        pack_quantity = expected.pack_quantity,
        updated_at = now()
    from expected
    where master.status = 'active'
      and master.normalized_key = expected.normalized_key
    returning master.master_product_id
  )
  select count(*) into v_updated from updated;

  if v_updated <> 42 then
    raise exception 'jul26_product_master_identity_count_mismatch:%', v_updated;
  end if;
end
$$;
