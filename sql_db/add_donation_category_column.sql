--script to add category column
ALTER TABLE payment_intents
ADD COLUMN  donation_category nvarchar(100) NOT NULL
CONSTRAINT  donation_category_default DEFAULT  'general';