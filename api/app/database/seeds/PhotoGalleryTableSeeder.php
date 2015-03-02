<?php

class PhotoGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photo_galleries')->delete();
		DB::unprepared("ALTER TABLE `photo_galleries` AUTO_INCREMENT = 1;");

		$galleries = [
			['title'=>'Lifestyle','short_title'=>'Lifestyle','slug'=>'lifestyle'],
			['title'=>'Portraits','short_title'=>'Portraits','slug'=>'portraits'],
			['title'=>'Editorial','short_title'=>'Editorial','slug'=>'editorial'],
			['title'=>'Travel','short_title'=>'Travel','slug'=>'travel']
		];


		foreach ($galleries as $gallery) {
			PhotoGallery::create([
				'title' => $gallery['title'],
				'short_title' => $gallery['short_title'],
				'slug' => $gallery['slug']
			]);
		}
	}
}