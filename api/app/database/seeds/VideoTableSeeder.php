<?php

class VideoTableSeeder extends Seeder {

	public function run()
	{
		DB::table('videos')->delete();
		DB::unprepared("ALTER TABLE `videos` AUTO_INCREMENT = 1;");

		$dir = dirname(dirname(dirname(dirname(__DIR__)))).'/dev/uploads/videos/';

		if (is_dir($dir)) {
			foreach( glob($dir . '*.mp4') as $key => $file ) {
				$file = pathinfo($file);

				Video::create([
					'title' => ucwords($file['filename']),
					'image_url' => 'uploads/videos/' . $file['filename'] . '.jpg',
					'video_url' => 'uploads/videos/' . $file['basename'],
					'sort_pos' => $key+1
				]);
			}
		} else {
			return 'Not a directory';
		}
	}
}