<?php

class PhotoTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photos')->delete();
		DB::unprepared("ALTER TABLE `photos` AUTO_INCREMENT = 1;");

		$urlBase = 'http://local.dev/playground/imageCreator/dev/app/image.php';
		$color = '#DBA97D';

		for($i=1; $i <= 12; ++$i) {
			$height = rand(200,400);
			$title = 'Photo #'.$i;
			$urlParams = '?w=300&h='.$height.'&color='.urlencode($color).'&text='.urlencode($title);


			Photo::create([
				'title' => $title,
				'filename' => $urlBase . $urlParams,
				'featured' => 1
			]);
		}
	}
}