<?php

class DesignGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_galleries')->delete();
		DB::unprepared("ALTER TABLE `design_galleries` AUTO_INCREMENT = 1;");

		$urlBase = 'http://local.dev/playground/imageCreator/dev/app/image.php';
		$color = '#33E8CA';

		for($i=1; $i <= 9; ++$i) {
			$title = 'Design #'.$i;

			DesignGallery::create([
				'title' => $title,
				'link' => 'gallery_'.$i,
				'image' => $urlBase . '?w=300&h=200&color='.urlencode($color).'&text='.urlencode($title)
			]);
		}
	}
}