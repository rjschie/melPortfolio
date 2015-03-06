<?php

class PhotoGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photo_galleries')->delete();
		DB::unprepared("ALTER TABLE `photo_galleries` AUTO_INCREMENT = 1;");

		$galleries = [
			['title'=>'Lifestyle','short_title'=>'Lifestyle','slug'=>'lifestyle', 'sort_pos'=>1],
			['title'=>'Portraits','short_title'=>'Portraits','slug'=>'portraits', 'sort_pos'=>2],
			['title'=>'Editorial','short_title'=>'Editorial','slug'=>'editorial', 'sort_pos'=>3],
			['title'=>'Travel','short_title'=>'Travel','slug'=>'travel','sort_pos'=>4]
		];


		foreach ($galleries as $gallery) {
			PhotoGallery::create([
				'title' => $gallery['title'],
				'short_title' => $gallery['short_title'],
				'slug' => $gallery['slug'],
				'sort_pos' => $gallery['sort_pos']
			]);
		}
	}
}