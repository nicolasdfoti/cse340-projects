-- Assignment 2

-- 1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
    )
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

-- 3
DELETE 
FROM public.account
WHERE account.account_firstname = 'Tony';

-- 4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior');

-- 5
SELECT classification_name, inv_make, inv_model
FROM public.inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- 6
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles');
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');