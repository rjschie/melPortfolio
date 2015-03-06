<?php

class DesignEntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_entries')->delete();
		DB::unprepared("ALTER TABLE `design_entries` AUTO_INCREMENT = 1;");

		$arr = [
			'docs',
			'valise',
			'unpack',
			'sorted',
			'typography',
			'subsplash',
			'pbr',
			'path'
		];

		foreach($arr as $key => $gall) {

			$dir = dirname(dirname(dirname(dirname(__DIR__)))).'/dev/assets/imgs/'.$gall;

			if (is_dir($dir)) {
				$theFiles = scandir($dir);
				$theFiles = array_diff($theFiles, array('..', '.', '.DS_Store'));

				foreach($theFiles as $file) {
					DesignEntry::create([
						'design_gallery_id' => $key+1,
						'title' => ucwords(explode('.',$file)[0]),
						'image' => $gall . '/' . $file
					]);
				}
			}
		}
	}
}