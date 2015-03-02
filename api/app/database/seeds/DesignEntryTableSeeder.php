<?php

class DesignEntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_entries')->delete();
		DB::unprepared("ALTER TABLE `design_entries` AUTO_INCREMENT = 1;");

		$urlBase = 'http://local.dev/playground/imageCreator/dev/app/image.php';
		$color = '#D192A7';

		for($i=1; $i <= 25; ++$i) {
			$title = 'Entry #'.$i;
			$width = rand(500, 900);

			DesignEntry::create([
				'design_gallery_id' => rand(1,9),
				'title' => $title,
				'image' => $urlBase . '?w='.$width.'&h=600&color='.urlencode($color).'&text='.urlencode($title)
			]);
		}
	}
}