<?php

class DesignEntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_entries')->delete();
		DB::unprepared("ALTER TABLE `design_entries` AUTO_INCREMENT = 1;");
		DB::table('design_galleries_entries')->delete();
		DB::unprepared("ALTER TABLE `design_galleries_entries` AUTO_INCREMENT = 1;");

		$galleries = DesignGallery::orderBy('id', 'asc')->get(['id','slug']);

		foreach($galleries as $key => $gall) {

			$dir = dirname(dirname(dirname(dirname(__DIR__)))).'/dev/assets/imgs/'.$gall['slug'];

			if (is_dir($dir)) {
				$theFiles = scandir($dir);
				$theFiles = array_diff($theFiles, array('..', '.', '.DS_Store'));

						'design_gallery_id' => $key+1,
				foreach($theFiles as $fKey => $file) {
					$entry = DesignEntry::create([
						'title' => ucwords(explode('.',$file)[0]),
						'location' => $gall['slug'] . '/' . $file
					]);
					DesignGalleryEntry::create([
						'gallery_id' => $gall['id'],
						'entry_id' => $entry['id'],
						'sort_pos' => $fKey+1,
					]);
				}
			}
		}
	}
}