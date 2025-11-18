ALTER TABLE "habit_tags" RENAME TO "habitTags";--> statement-breakpoint
ALTER TABLE "habitTags" DROP CONSTRAINT "habit_tags_habit_id_habits_id_fk";
--> statement-breakpoint
ALTER TABLE "habitTags" DROP CONSTRAINT "habit_tags_tag_id_tags_id_fk";
--> statement-breakpoint
ALTER TABLE "habitTags" ADD CONSTRAINT "habitTags_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habitTags" ADD CONSTRAINT "habitTags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;