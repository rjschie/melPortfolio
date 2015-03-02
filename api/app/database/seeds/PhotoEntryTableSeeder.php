<?php

class PhotoEntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photo_entries')->delete();
		DB::unprepared("ALTER TABLE `photo_entries` AUTO_INCREMENT = 1;");

		$urlBase = 'http://local.dev/playground/imageCreator/dev/app/image.php';
		$color = '#CFA97E';

		for($i=1; $i <= 40; ++$i) {
			$title = 'Entry #'.$i;
			$width = rand(400,900);

			PhotoEntry::create([
				'photo_gallery_id' => rand(1,4),
				'title' => $title,
				'image' => $urlBase . '?w='.$width.'&h=600&color='.urlencode($color).'&text='.urlencode($title)
			]);
		}
	}
}