<?php

class PhotoEntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('photo_entries')->delete();
		DB::unprepared("ALTER TABLE `photo_entries` AUTO_INCREMENT = 1;");

		$galleries = PhotoGallery::orderBy('id', 'asc')->get(['id','slug']);

		foreach($galleries as $key => $gall) {

			$dir = dirname(dirname(dirname(dirname(__DIR__)))).'/dev/uploads/photography/'.$gall['slug'];

			if (is_dir($dir)) {
				$theFiles = scandir($dir);
				$theFiles = array_diff($theFiles, array('..', '.', '.DS_Store'));
				$theFiles = array_values($theFiles);

				foreach($theFiles as $fKey => $file) {
					$entry = PhotoEntry::create([
						'title' 		=> ucwords(explode('.',$file)[0]),
						'image_url' => 'uploads/photography/' . $gall['slug'] . '/' . $file
					]);

					PhotoGalleryEntry::create([
						'gallery_id' => $gall['id'],
						'entry_id' => $entry['id'],
						'sort_pos' => $fKey+1,
					]);
				}
			}
		}
	}
}