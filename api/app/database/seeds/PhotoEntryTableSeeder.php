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

			PhotoEntry::create([
				'photo_gallery_id' => rand(1,4),
				'title' => $title,
				'image' => $urlBase . '?w=300&h=200&color='.urlencode($color).'&text='.urlencode($title)
			]);
		}
	}
}