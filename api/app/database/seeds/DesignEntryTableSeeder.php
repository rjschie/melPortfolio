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

			$dir = dirname(dirname(dirname(dirname(__DIR__)))).'/dev/uploads/design/'.$gall['slug'];

			switch($gall['slug']) {
				case 'valise':
					$entry = DesignEntry::create([
						'title' => strtoupper($gall['slug']),
						'subtitle' => 'A travel app for the full-time wanderer.',
						'body' => 'Valise connects the wanderlust with local employers as they travel around the world. Travelers exchange labor for their basic travel needs such as lodging, food, or transportation so travel doesn\'t have to stop when your pockets are empty. The custom symbol set allows power users to quickly browse for the form of compensation they are looking for.',
						'footer' => 'MOBILE DESIGN + SYMBOL SET',
						'bgColor' => '#ba8a38',
						'type' => 2
					]);
					DesignGalleryEntry::create([
						'gallery_id' => $gall['id'],
						'entry_id' => $entry['id'],
						'sort_pos' => 0,
						]);
					break;
				case 'sorted':
					$entry = DesignEntry::create([
						'title' => strtoupper($gall['slug']),
						'subtitle' => 'An online and mobile tool that helps students manage their active schedules.',
						'body' => 'A foundational feature of SORTED is the ability to rearrange tasks from global to daily task lists; this encourages students to schedule. SORTED allows students to organize their assignments and class times and as well as monitor projected degree requirements. Navigating the university campus is made seamless with SORTED as well. Whether quickly mapping classroom locations, finding food near campus, or locating rental equipment for an upcoming project, the map features makes it easy.',
						'footer' => 'WEB + MOBILE DESIGN',
						'bgColor' => '#e46942',
						'type' => 2
					]);
					DesignGalleryEntry::create([
						'gallery_id' => $gall['id'],
						'entry_id' => $entry['id'],
						'sort_pos' => 0,
					]);
					break;
			}

			if (is_dir($dir)) {
				$theFiles = scandir($dir);
				$theFiles = array_diff($theFiles, array('..', '.', '.DS_Store'));
				$theFiles = array_values($theFiles);
				$valiseNotDone = false;
				$sortedNotDone = false;

				foreach($theFiles as $fKey => $file) {

					if($gall['slug'] == 'valise' && !$valiseNotDone) {
						$valiseNotDone = true;
						continue;
					}
					if($gall['slug'] == 'sorted' && !$sortedNotDone) {
						$sortedNotDone = true;
						continue;
					}
					if($file == "docs_04.jpg") {
						$entry = DesignEntry::create( [
							'title' => ucwords( explode( '.', $file )[ 0 ] ),
							'image_url' => 'uploads/design/' . $gall[ 'slug' ] . '/' . $file,
							'video_url' => 'uploads/videos/docs.mp4',
							'type'	=> 1
						] );
					} elseif($file == "unpack_01.jpg") {
						$entry = DesignEntry::create([
							'title' => ucwords(explode('.',$file)[0]),
							'image_url' => 'uploads/design/' . $gall['slug'] . '/' . $file,
							'video_url' => 'uploads/videos/unpack.mp4',
							'type'	=> 1
						]);
					} else {
						$entry = DesignEntry::create([
							'title' => ucwords(explode('.',$file)[0]),
							'image_url' => 'uploads/design/' . $gall['slug'] . '/' . $file
						]);
					}

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