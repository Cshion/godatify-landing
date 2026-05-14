/**
 * Migration: Add sectionImageUrl to about_pages table
 * 
 * This migration adds the section_image_url column to support displaying
 * a static image in the "Quiénes Somos" tab of the Nosotros page.
 * 
 * @see https://docs.strapi.io/cms/database-migrations
 */
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if column already exists (idempotent migration)
  const hasColumn = await knex.schema.hasColumn('about_pages', 'section_image_url');
  
  if (!hasColumn) {
    await knex.schema.alterTable('about_pages', (table) => {
      table.string('section_image_url', 500); // URL can be long
    });
    
    console.log('✅ Migration: Added section_image_url column to about_pages');
  } else {
    console.log('ℹ️ Migration: section_image_url column already exists in about_pages, skipping');
  }
}

// Note: Strapi 5 does not support down() migrations yet
// Manual rollback: ALTER TABLE about_pages DROP COLUMN section_image_url;
