CREATE TABLE IF NOT EXISTS "cuisines" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" serial NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cuisines_to_recipes" (
	"cuisine_id" serial NOT NULL,
	"recipe_id" serial NOT NULL,
	CONSTRAINT "cuisines_to_recipes_cuisine_id_recipe_id_pk" PRIMARY KEY("cuisine_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "family" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" serial NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe_categories_to_recipes" (
	"recipe_id" serial NOT NULL,
	"recipe_category_id" serial NOT NULL,
	CONSTRAINT "recipe_categories_to_recipes_recipe_id_recipe_category_id_pk" PRIMARY KEY("recipe_id","recipe_category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(500),
	"image" varchar(255),
	"prep_time" interval,
	"cook_time" interval,
	"total_time" interval,
	"servings" integer,
	"ingredients" varchar(255)[] DEFAULT '{}'::text[] NOT NULL,
	"method" varchar(255)[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" serial NOT NULL,
	"cognitoId" varchar(255),
	"givenName" varchar(255) NOT NULL,
	"familyName" varchar(255) NOT NULL,
	"date_of_birth" date NOT NULL,
	"picture" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_categories_to_recipes" ADD CONSTRAINT "recipe_categories_to_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_categories_to_recipes" ADD CONSTRAINT "recipe_categories_to_recipes_recipe_category_id_recipe_categories_id_fk" FOREIGN KEY ("recipe_category_id") REFERENCES "public"."recipe_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_family_id_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_family_id_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
