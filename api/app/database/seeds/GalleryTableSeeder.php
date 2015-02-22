<?php

class GalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('galleries')->delete();
		DB::unprepared("ALTER TABLE `galleries` AUTO_INCREMENT = 1;");

		for($i=1; $i <= 9; ++$i) {
			Gallery::create([
				'title' => 'Gallery #'.$i,
				'link' => 'gallery_'.$i,
				'image_filename' => 'gallery_'.$i.'.png'
			]);
		}
	}
}