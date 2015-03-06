<?php

class PhotoEntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photo_entries')->delete();
		DB::unprepared("ALTER TABLE `photo_entries` AUTO_INCREMENT = 1;");

		$arr = [
			'lifestyle',
			'portraits',
			'editorial',
			'travel'
		];

		foreach($arr as $key => $gall) {

			$dir = dirname(dirname(dirname(dirname(__DIR__)))).'/dev/assets/imgs/'.$gall;

			if (is_dir($dir)) {
				$theFiles = scandir($dir);
				$theFiles = array_diff($theFiles, array('..', '.', '.DS_Store'));

				foreach($theFiles as $file) {
					PhotoEntry::create([
						'photo_gallery_id' => $key+1,
						'title' => ucwords(explode('.',$file)[0]),
						'image' => $file
					]);
				}
			}
		}
	}
}