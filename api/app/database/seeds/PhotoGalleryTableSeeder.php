<?php

class PhotoGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photo_galleries')->delete();
		DB::unprepared("ALTER TABLE `photo_galleries` AUTO_INCREMENT = 1;");

		$galleries = ['lifestyle', 'editorial', 'portraits', 'travel'];


		foreach ($galleries as $gallery) {
			PhotoGallery::create([
				'title' => ucwords($gallery),
				'link' => $gallery
			]);
		}
	}
}