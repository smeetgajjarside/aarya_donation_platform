--get discount code id with the minimum amount of uses
-- insert into discount_codes (discount_code_id, amount, date_created)
-- VALUES
-- ('GXIYF50WT_2', 50, datetime('now')),
-- ('GXIYF50WT_3', 50, datetime('now')),
-- ('GXIYF50WT_4', 50, datetime('now'));

--query to get the discount code with the minimum number of uses for this amount
select dc.discount_code_id,
	(select count(*) 
		from gift_success
		where discount_code_used=dc.discount_code_id) as numUses
from discount_codes dc
where amount=50
order by num_uses asc;

select dc.discount_code_id,
	(select count(*) 
		from gift_success
		where discount_code_used=dc.discount_code_id) as numUses
from discount_codes dc
where amount=50
order by numUses asc
limit 1;

select count(*) 
from gift_success
where discount_code_used='GXIYF50WT';


select dc.discount_code_id, count(*) as numUses
from discount_codes dc inner join gift_success gs on gs.discount_code_used=dc.discount_code_id
where dc.amount=50
group by dc.discount_code_id;
