<?php

class VideoTableSeeder extends Seeder {

	public function run()
	{
		DB::table('videos')->delete();
		DB::unprepared("ALTER TABLE `videos` AUTO_INCREMENT = 1;");

		Video::create([
			'title' => 'Video 1',
			'image_url' => '',
			'video_url' => ''
		]);
	}
}